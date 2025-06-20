import { model, ObjectId, Schema } from "mongoose";
import { BookModel, genres, IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      required: true,
      enum: genres,
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: {
      type: Number,
      required: true,
      min: [0, "Copies must be a positive number"],
    },
    available: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
bookSchema.statics.borrowCopies = async function (
  bookId: ObjectId,
  quantity: number
) {
  const book = await this.findById(bookId);
  if (!book) throw new Error('Book not found');

  if (book.copies < quantity) {
    throw new Error(`Only ${book.copies} copies available`);
  }

  book.copies -= quantity;
  book.available = book.copies > 0;
  await book.save();

  return book;
};
export const Book = model<IBook,BookModel>("Book", bookSchema);
