export type Note = {
  id: number;
  title: string;
  content: string;
  expirationDate: Date;
  author: string; // username of the author
};