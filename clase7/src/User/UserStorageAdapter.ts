import { IStorageAdapter } from "../database/IStorageAdapter.js";
import { User } from "./entities/User.entity.js";
import { JsonDb } from "../database/json-db.js";

export class UserStorageAdapter implements IStorageAdapter<User> {
    public override async findById(id: string): Promise<User[]> { }
    
    public override async create(item: User): Promise<User> { }

    public override async update(id: string, data: Partial<User>): Promise<User | null> { }

    public override async delete(id: string): Promise<boolean> { }
}