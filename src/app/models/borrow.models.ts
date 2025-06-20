import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./book.models";

const borrowSchema = new Schema<IBorrow>({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true,"References the borrowed book’s ID is required"]
  },
  quantity: {
    type: Number,
    required: [true,"Quantity is required"],
    min: [1, 'Must borrow at least 1 copy']
  },
  dueDate: {
    type: Date,
    required: [true, "The date by which the book must be returned is required"]
  }
},{ timestamps: true ,versionKey:false});

borrowSchema.pre("save", async function(){
  await Book.borrowCopies(this.book, this.quantity);
})

export const Borrow = model<IBorrow>('Borrow', borrowSchema);