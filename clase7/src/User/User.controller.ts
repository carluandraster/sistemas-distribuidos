import { Controller, Post, Get } from "@nestjs/common";

@Controller("users")
export class UserController {
    @Post(":user")
    public registrar(req: Request) {
        // Lógica para registrar un usuario
    }

    @Get(":user")
    public login(req: Request) {
        // Lógica para iniciar sesión de un usuario
    }
}