import { NextResponse } from 'next/server';
import crypto from 'crypto';
import JSZip from 'jszip';
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

/**
 * Lee los metadatos de los archivos almacenados.
 * @returns Una promesa que resuelve en un array de metadatos de archivos.
 * @throws Si ocurre un error al leer el archivo de metadatos, excepto si el archivo no existe (ENOENT), en cuyo caso devuelve un array vacío.
 */
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

async function downloadFile(id: string, password: string): Promise<NextResponse> {
  const metadataList = await readMetadata();
  const metadata = metadataList.find((item) => item.id === id);
  if (!metadata) {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
  }

  try {
    const filePath = path.join(STORAGE_DIR, `${id}.bin`);
    const fileBuffer = await readFile(filePath);
    const fileDecrypted: PersistedFile = JSON.parse(fileBuffer.toString('utf8'));
    const key = crypto.pbkdf2Sync(
      password,
      Buffer.from(fileDecrypted.salt, 'base64'),
      100000,
      LONGITUD_KEY,
      'sha256',
    );
    const decipher = crypto.createDecipheriv(
      ALGORITMO,
      key,
      Buffer.from(fileDecrypted.iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(fileDecrypted.authTag, 'base64'));
    const decryptedBuffer = Buffer.concat([
      decipher.update(Buffer.from(fileDecrypted.data, 'base64')),
      decipher.final(),
    ]);

    return new NextResponse(new Uint8Array(decryptedBuffer), {
      headers: {
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(metadata.name)}`,
        'Content-Type': 'application/zip',
      },
    });
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    if (error instanceof Error && error.message.includes('Unsupported state')) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    throw error;
  }
}

export async function POST(req: Request) {
  let filePath: string | undefined;

  try {
    const url = new URL(req.url);
    if (url.searchParams.get('download') === 'true') {
      const password = (await req.formData()).get('password');
      if (typeof password !== 'string' || !password) {
        return NextResponse.json(
          { error: 'Se requiere una contraseña' },
          { status: 400 },
        );
      }

      return await downloadFile(url.searchParams.get('id') ?? '', password);
    }

    const formData = await req.formData();
    const fileValues = formData.getAll('files');
    const passwordValue = formData.get('password');
    const files = fileValues.filter((value): value is File => value instanceof File);

    if (
      files.length === 0 ||
      files.length !== fileValues.length ||
      typeof passwordValue !== 'string' ||
      !passwordValue
    ) {
      return NextResponse.json(
        { error: "Faltan archivos o contraseña" },
        { status: 400 }
      );
    }

    const password = passwordValue;
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.name, file.arrayBuffer());
    });
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(password, salt, 100000, LONGITUD_KEY, 'sha256');
    const iv = crypto.randomBytes(LONGITUD_IV);
    const cipher = crypto.createCipheriv(ALGORITMO, key, iv);
    const encryptedBuffer = Buffer.concat([cipher.update(zipBuffer), cipher.final()]);
    const id = crypto.randomUUID();
    const metadata: FileMetadata = {
      id,
      name: 'archivos.zip',
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

    return NextResponse.json(
      { message: 'Archivos comprimidos y guardados correctamente', metadata },
      { status: 201 },
    );
  } catch (error) {
    if (filePath) {
      await unlink(filePath).catch(() => undefined);
    }
    console.error('Error al persistir los archivos:', error);
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

      if (new URL(req.url).searchParams.get('download') === 'true') {
        return NextResponse.json(
          { error: 'La descarga requiere una solicitud POST con contraseña' },
          { status: 405 },
        );
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