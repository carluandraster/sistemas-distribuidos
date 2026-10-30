import { mkdir, readFile, writeFile } from 'fs/promises';
import { STORAGE_DIR } from '@/app/api/login/route';
import { Question } from '@/lib/Question';

async function insertQuiz(newQuiz: any): Promise<void> {
    const quizPath = `${STORAGE_DIR}/quiz.json`;
    await mkdir(STORAGE_DIR, { recursive: true });
    const existingData = await readFile(quizPath, 'utf8')
        .then((data) => JSON.parse(data))
        .catch(() => []);
    existingData.push(newQuiz);
    await writeFile(quizPath, JSON.stringify(existingData, null, 2), 'utf8');
}

// Lee y filtra los cuestionarios según cuenta o id
async function GET(req: Request): Promise<Response> {
    const account = req.headers.get('account');
    const id = req.headers.get('id');
    await mkdir(STORAGE_DIR, { recursive: true });
    const quizPath = `${STORAGE_DIR}/quiz.json`;
    return readFile(quizPath, 'utf8')
        .then((data) => {
            const quizData = JSON.parse(data);
            const myQuizData = quizData.filter((q: any) => q.account === account || q.id === id);
            return new Response(JSON.stringify(myQuizData), { status: 200 });
        })
        .catch(() => {
            return new Response(JSON.stringify({ error: 'Error al leer el archivo de quiz' }), { status: 500 });
        });
}

// Manda un cuestionario a la cuenta correspondiente
async function POST(req: Request): Promise<Response> {
    const formData = await req.formData();
    const id_survey = formData.get('id');
    const title = formData.get('title');
    const account = formData.get('author');
    const questionWithOptions: Question[] = formData.get('questions');
    const [question, options] = questionWithOptions.reduce(
        ([q, o], item) => {
            q.push(item.question);
            o.push(...item.options);
            return [q, o];
        }, [[], []]);
    const newQuiz = { id, account, question, options };
    return await insertQuiz(newQuiz).then(() => {
        return new Response(JSON.stringify(
            { message: 'Cuestionario agregado correctamente' }), { status: 200 });
    }).catch(() => {
        return new Response(JSON.stringify(
            { error: 'Error al agregar el cuestionario' }), { status: 500 });
    });
}