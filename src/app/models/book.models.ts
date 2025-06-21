import { model, ObjectId, Schema } from "mongoose";
import { BookModel, genres, IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: [true, "Book title is required"] },
    author: { type: String, required: [true, "Book author name is required"] },
    genre: {
      type: String,
      required: [true, "Genre is required, got {VALUE}"],
      enum: genres,
    },
    isbn: { type: String, required: [true, "isbn is required"], unique: [true, "Duplication found in isbn, isbn must be unique"] },
    description: { type: String },
    copies: {
      type: Number,
      required: [true, "Number of book copies is required"],
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
  if (!book) throw new Error('Book not found, please provide a valid bookId');

  if (book.copies < quantity) {
    throw new Error(`Only ${book.copies} copies available`);
  }

  book.copies -= quantity;
  book.available = book.copies > 0;
  await book.save();

  return book;
};
export const Book = model<IBook,BookModel>("Book", bookSchema);
