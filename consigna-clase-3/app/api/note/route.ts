import { getBackendUrl, jsonResponse, forwardResponse } from "./../user/route";

export async function GET(request: Request) {
    const user = request.headers.get("username") ?? "";
    return await fetch(`${getBackendUrl()}/notes?user=${encodeURIComponent(user)}`, {
        method: "GET",
    }).then((response) => forwardResponse(response)
    ).catch((error) => {
        console.error("No se pudo contactar al backend de notas", error);
        return jsonResponse({ error: "El backend no está disponible" }, 502);
    });
}

export async function POST(request: Request) {
    const user = request.headers.get("username") ?? "";
    const body = await request.json();
    return await fetch(`${getBackendUrl()}/notes?user=${encodeURIComponent(user)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then((response) => forwardResponse(response)
    ).catch((error) => {
        console.error("No se pudo contactar al backend de notas", error);
        return jsonResponse({ error: "El backend no está disponible" }, 502);
    });
}

export async function DELETE(request: Request) {
    const user = request.headers.get("username") ?? "";
    const body = await request.json();
    return await fetch(`${getBackendUrl()}/notes?user=${encodeURIComponent(user)}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then((response) => forwardResponse(response)
    ).catch((error) => {
        console.error("No se pudo contactar al backend de notas", error);
        return jsonResponse({ error: "El backend no está disponible" }, 502);
    });
}

export async function PUT(request: Request) {
    const user = request.headers.get("username") ?? "";
    const body = await request.json();
    return await fetch(`${getBackendUrl()}/notes?user=${encodeURIComponent(user)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then((response) => forwardResponse(response)
    ).catch((error) => {
        console.error("No se pudo contactar al backend de notas", error);
        return jsonResponse({ error: "El backend no está disponible" }, 502);
    });
}