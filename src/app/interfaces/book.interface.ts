import mongoose, { Model } from "mongoose";

export const genres = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'] as const;
type Genre = typeof genres[number];

export interface IBook {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}
export interface BookModel extends Model<IBook>  {
  borrowCopies(bookId: mongoose.Types.ObjectId, quantity: number): Promise<IBook>;
}