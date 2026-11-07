import { Injectable } from "@nestjs/common";
import { User } from "./entities/User.entity.js";
import { IStorageAdapter } from "../database/IStorageAdapter.js";

@Injectable()
export class UserService {
    private storage: IStorageAdapter<User>;

    constructor(storage: IStorageAdapter<User>) {
        this.storage = storage;
    }

    public async buscarPorId(id: string): Promise<User | null> {
        return await this.storage.findById(id)
            .then(users => {
                if (users.length > 0) {
                    return users[0];
                } else {
                    return null;
                }
            });
    }

    public async verificarCredenciales(user: string, password: string): Promise<boolean> {
        return await this.storage.findById(user)
            .then(users => {
                if (users.length > 0) {
                    return users[0];
                } else {
                    throw new Error("Usuario no encontrado");
                }
            }).then(user => {
                return user.password === password;
            }).catch(err => {
                console.error(err);
                return false;
            });
        
    }
}