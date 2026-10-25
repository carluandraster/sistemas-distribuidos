import crypto from 'crypto';
import { mkdir, writeFile, readFile} from 'fs/promises';
import { STORAGE_DIR, ACCOUNTS_PATH, Account, readAccounts } from '../login/route';

async function insertAccount(newAccount: Account) {
    const quizPath = `${STORAGE_DIR}/${ACCOUNTS_PATH}`;
    await mkdir(STORAGE_DIR, { recursive: true });
    const existingData = await readFile(quizPath, 'utf8')
        .then((data) => JSON.parse(data))
        .catch(() => []);
    existingData.push(newAccount);
    await writeFile(quizPath, JSON.stringify(existingData, null, 2), 'utf8');
}

export async function POST(req: Request) {
    try {
        const username = req.headers.get("username");
        const password = req.headers.get("password");
        if (typeof username !== 'string' || typeof password !== 'string') {
            return new Response(JSON.stringify({ error: 'Datos de acceso inválidos' }), { status: 400 });
        }
        const passwordCrypted = crypto.createHash('sha256').update(password).digest('hex');
        const accounts = await readAccounts();
        if (accounts.find((u) => u.username === username)) {
            return new Response(JSON.stringify({ error: 'El usuario ya existe' }), { status: 400 });
        }
        await insertAccount({
            username: username,
            password: passwordCrypted
        })
    } catch (e) {
        const message = (e as Error).message;
        return new Response(JSON.stringify({ error: `Error al procesar la solicitud: ${message}` }), { status: 500 });
    }
}