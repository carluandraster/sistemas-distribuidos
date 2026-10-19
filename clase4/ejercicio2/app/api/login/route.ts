import crypto from 'crypto';
import { mkdir, readFile, writeFile, unlink } from 'fs/promises';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'storage');
const ACCOUNTS_PATH = path.join(STORAGE_DIR, 'accounts.json');

type Account = {
    username: string;
    password: string; // Almacena la contraseña encriptada
};

async function readAccounts(): Promise<Account[]> {
    try {
        await mkdir(STORAGE_DIR, { recursive: true });
        await writeFile(ACCOUNTS_PATH, '{}', { flag: 'a' }); // Crea el archivo si no existe
        return readFile(ACCOUNTS_PATH, 'utf8')
            .then((data) => JSON.parse(data));
    } catch (error) {
        return [];
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const username = formData.get('username');
        const password = formData.get('password');
        const passwordCrypted = crypto.createHash('sha256').update(password as string).digest('hex');
        const accounts = await readAccounts();
        const account = accounts.find((a) => a.username === username);
        if (account && account.password === passwordCrypted) {
            return new Response(JSON.stringify({ message: 'Login exitoso' }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), { status: 401 });
        }
    }
    catch (error) {
        return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), { status: 500 });
    }
}