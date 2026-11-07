// 1. EL CONTRATO (Interfaz que espera NoteService)
export interface IStorageAdapter<T> {
  findById(id: string): Promise<T>;
  create(item: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}