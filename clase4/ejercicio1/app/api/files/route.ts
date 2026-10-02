export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("files") as File;
  console.log(file);
}

export async function GET(req: Request) {
  return await fetch('http://localhost:3000/api/files').then((res) => res.json());
}