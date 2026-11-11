import { Injectable } from "@nestjs/common";
import { User } from "./entities/User.entity.js";
import { UserStorageAdapter } from "./UserStorageAdapter.js";

@Injectable()
export class UserService {
    constructor(private readonly storage: UserStorageAdapter) {}

    private async buscarPorId(id: string): Promise<User> {
        return await this.storage.findById(id)
            .then(user => {
                if (user) {
                    return user;
                } else {
                    throw new Error("User not found");
                }
            });
    }

    public async verificarCredenciales(user: string, password: string): Promise<boolean> {
        return await this.buscarPorId(user)
            .then(user => {
                if (!user) {
                    return false;
                }
                return user.password === password;
            }).catch(() => {
                return false;
            });
        
    }

    public async registrarUsuario(user: User): Promise<User> {
        return await this.buscarPorId(user.username)
            .then(() => {throw new Error("User already exists");})
            .catch(() => this.storage.create(user));
    }
}