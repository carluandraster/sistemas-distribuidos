import { Quiz } from '@/lib/Quiz'; 
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { useState, useEffect } from 'react';

export const instant = false;

/**
 * This function is intended to read quiz data from a source (e.g., a database or an API).
 */
async function readQuiz(username: string): Promise<Quiz[] | []> {
  try {
    return await fetch('@/app/api/quiz/route', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'account': username,
      },
    }).then((res) => res.json());
  } catch {
    return [];
  }
}

export default async function Dashboard() {
  const [creating, setCreating] = useState(false);
  await connection();
  const sessionUsername = (await cookies()).get('session')?.value;
  if (!sessionUsername) {
    redirect('/');
  }

  const username = decodeURIComponent(sessionUsername);
  const quizData = await readQuiz(username);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>Sesión iniciada correctamente.</p>
      <dl>
        <dt>Usuario</dt>
        <dd>{username}</dd>
        <dt>Estado</dt>
        <dd>Autenticado</dd>
      </dl>
      {typeof quizData === "object" && quizData !== null && quizData.length > 0 ? (
        <ul>
          {quizData.map((question, index) => (
            <li key={index}>
              <a href={question.id}>{question.title}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No quiz data available.</p>
      )}
      <button onClick={() => setCreating(true)}>Crear nuevo formulario</button>
    </div>
  );
}