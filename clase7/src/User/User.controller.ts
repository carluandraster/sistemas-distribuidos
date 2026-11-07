import { Controller, Post, Get, Param } from "@nestjs/common";
import { UserService } from "./User.service.js";

@Controller("users")
export class UserController {
    private readonly userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
    }
    @Post(":user")
    public registrar(@Param("user") user: string, @Param("password") password: string) {
        return this.userService.registrarUsuario({ username: user, password, notes: [] });
    }

    @Get(":user")
    public login(@Param("user") user: string, @Param("password") password: string) {
        return this.userService.verificarCredenciales(user, password);
    }
}