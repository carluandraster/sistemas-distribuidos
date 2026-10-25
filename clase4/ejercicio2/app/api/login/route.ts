import crypto from 'crypto';
import { mkdir, readFile, writeFile} from 'fs/promises';
import path from 'path';

export const STORAGE_DIR = path.join(process.cwd(), 'storage');
export const ACCOUNTS_PATH = path.join(STORAGE_DIR, 'accounts.json');

/**
 * Tipo cuenta de usuario que contiene el nombre de usuario y la contraseña encriptada.
 */
export type Account = {
    username: string;
    password: string; // Almacena la contraseña encriptada
};

/**
 * Lee el archivo de cuentas y devuelve un array de cuentas. Si el archivo no existe, lo crea y devuelve un array vacío.
 * @returns Un array de cuentas.
 */
export async function readAccounts(): Promise<Account[]> {
    try {
        await mkdir(STORAGE_DIR, { recursive: true });
        await writeFile(ACCOUNTS_PATH, '[]', { flag: 'a' }); // Crea el archivo si no existe
        const data = JSON.parse(await readFile(ACCOUNTS_PATH, 'utf8'));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

export async function POST(req: Request) {
    try {
        const formData = req.headers;
        const username = formData.get('name');
        const password = formData.get('password');
        if (typeof username !== 'string' || typeof password !== 'string') {
            return new Response(JSON.stringify({ error: 'Datos de acceso inválidos' }), { status: 400 });
        }
        const passwordCrypted = crypto.createHash('sha256').update(password).digest('hex');
        const accounts = await readAccounts();
        const account = accounts.find((a) => a.username === username);
        if (account && account.password === passwordCrypted) {
            return new Response(JSON.stringify({ message: 'Login exitoso', username }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `session=${encodeURIComponent(username)}; Path=/; HttpOnly; SameSite=Lax`,
                },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), { status: 401 });
        }
    }
    catch (error) {
        return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), { status: 500 });
    }
}