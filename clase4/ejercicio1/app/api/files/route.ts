import { NextResponse } from 'next/server';
import crypto from 'crypto';
import zlib from 'zlib';
import { mkdir, readFile, writeFile, unlink } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

// Configuración del algoritmo de encriptación y compresión
const ALGORITMO = 'aes-256-gcm';
const LONGITUD_KEY = 32; // 32 bytes = 256 bits
const LONGITUD_IV = 12;  // 12 bytes es el estándar para GCM

const STORAGE_DIR = path.join(process.cwd(), 'storage');
const METADATA_PATH = path.join(STORAGE_DIR, 'metadata.json');

type FileMetadata = {
  id: string;
  name: string;
  createdAt: string;
};

type PersistedFile = {
  salt: string;
  iv: string;
  authTag: string;
  data: string;
};

async function readMetadata(): Promise<FileMetadata[]> {
  try {
    return JSON.parse(await readFile(METADATA_PATH, 'utf8')) as FileMetadata[];
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

export async function POST(req: Request) {
  let filePath: string | undefined;

  try {
    const formData = await req.formData();
    const fileValue = formData.get('files');
    const passwordValue = formData.get('password');

    if (!(fileValue instanceof File) || typeof passwordValue !== 'string' || !passwordValue) {
      return NextResponse.json(
        { error: "Faltan archivos o contraseña" },
        { status: 400 }
      );
    }

    const file = fileValue;
    const password = passwordValue;
    // Encriptar y comprimir el archivo usando la contraseña proporcionada
    // Primero se comprime el archivo usando zlib
    const compressedBuffer = zlib.gzipSync(await file.arrayBuffer());

    // Luego se genera una clave a partir de la contraseña usando PBKDF2
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(password, salt, 100000, LONGITUD_KEY, 'sha256');
    // Luego se encripta el archivo comprimido con la clave generada
    const iv = crypto.randomBytes(LONGITUD_IV);
    const cipher = crypto.createCipheriv(ALGORITMO, key, iv);
    const encryptedBuffer = Buffer.concat([cipher.update(compressedBuffer), cipher.final()]);
    const id = crypto.randomUUID();
    const metadata: FileMetadata = {
      id,
      name: file.name,
      createdAt: new Date().toISOString(),
    };
    const persistedFile: PersistedFile = {
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      authTag: cipher.getAuthTag().toString('base64'),
      data: encryptedBuffer.toString('base64'),
    };

    await mkdir(STORAGE_DIR, { recursive: true });
    filePath = path.join(STORAGE_DIR, `${id}.bin`);
    await writeFile(filePath, JSON.stringify(persistedFile), 'utf8');

    const metadataList = await readMetadata();
    metadataList.push(metadata);
    await writeFile(METADATA_PATH, JSON.stringify(metadataList, null, 2), 'utf8');

    return NextResponse.json({ message: 'Archivo guardado correctamente', metadata }, { status: 201 });
  } catch (error) {
    if (filePath) {
      await unlink(filePath).catch(() => undefined);
    }
    console.error('Error al persistir el archivo:', error);
    return NextResponse.json(
      { error: "Error interno al procesar los archivos" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get('id');
    const metadataList = await readMetadata();

    if (id) {
      const metadata = metadataList.find((item) => item.id === id);
      if (!metadata) {
        return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
      }
      return NextResponse.json(metadata);
    }

    return NextResponse.json(metadataList);
  } catch (error) {
    console.error('Error al leer el registro de archivos:', error);
    return NextResponse.json(
      { error: 'Error interno al consultar los archivos' },
      { status: 500 }
    );
  }
}