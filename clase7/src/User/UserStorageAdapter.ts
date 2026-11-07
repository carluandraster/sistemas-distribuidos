import { IStorageAdapter } from "../database/IStorageAdapter.js";
import { User } from "./entities/User.entity.js";
import { JsonDb } from "../database/json-db.js";

export class UserStorageAdapter implements IStorageAdapter<User> {
    private db: JsonDb;

    constructor(db: JsonDb) {
        this.db = db;
    }
    public async findById(id: string): Promise<User> {
        return await this.db.read().then(db => {
            const user = db.users.find(u => u.username === id);
            if (user) {
                return user;
            } else {
                throw new Error("User not found");
            }
        });
    }
    
    public async create(item: User): Promise<User> {
        return await this.db.update(db => {
            db.users.push(item);
            return item;
        });
    }

    public async update(id: string, data: Partial<User>): Promise<User | null> {
        return await this.findById(id)
            .then(user => {
                user.username = data.username ?? user.username;
                user.password = data.password ?? user.password;
                user.notes = data.notes ?? user.notes;
                return user;
            })
            .catch(err => {
                console.error(err);
                return null;
            });
    }

    public async delete(id: string): Promise<boolean> {
        return await this.db.update(db => {
            const index = db.users.findIndex(u => u.username === id);
            if (index !== -1) {
                db.users.splice(index, 1);
                return true;
            } else {
                return false;
            }
        });
    }
}