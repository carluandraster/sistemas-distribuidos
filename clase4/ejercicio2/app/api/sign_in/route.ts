import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const username = req.headers.get("username");
        const password = req.headers.get("password");
        if (typeof username !== 'string' || typeof password !== 'string') {
            return new Response(JSON.stringify({ error: 'Datos de acceso inválidos' }), { status: 400 });
        }
        const passwordCrypted = crypto.createHash('sha256').update(password).digest('hex');
        const account = await prisma.account.findUnique({ where: { username } });
        if (account) {
            return new Response(JSON.stringify({ error: 'El usuario ya existe' }), { status: 400 });
        }
        await prisma.account.create({
            data: {
                username,
                password: passwordCrypted,
            },
        });
        return new Response(JSON.stringify({ message: 'Cuenta creada correctamente' }), { status: 201 });
    } catch (e) {
        const message = (e as Error).message;
        return new Response(JSON.stringify({ error: `Error al procesar la solicitud: ${message}` }), { status: 500 });
    }
}