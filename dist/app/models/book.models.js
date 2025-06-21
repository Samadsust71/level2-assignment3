"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const book_interface_1 = require("../interfaces/book.interface");
const borrow_models_1 = require("./borrow.models");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, "Book title is required"] },
    author: { type: String, required: [true, "Book author name is required"] },
    genre: {
        type: String,
        required: [true, "Genre is required, got {VALUE}"],
        enum: book_interface_1.genres,
    },
    isbn: { type: String, required: [true, "isbn is required"], unique: [true, "Duplication found in isbn, isbn must be unique"] },
    description: { type: String },
    copies: {
        type: Number,
        required: [true, "Number of book copies is required"],
        min: [0, "Copies must be a positive number"],
    },
    available: { type: Boolean, default: true },
}, {
    versionKey: false,
    timestamps: true,
});
bookSchema.statics.borrowCopies = function (bookId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findById(bookId);
        if (!book)
            throw new Error('Book not found, please provide a valid bookId');
        if (book.copies < quantity) {
            throw new Error(`Only ${book.copies} copies available`);
        }
        book.copies -= quantity;
        book.available = book.copies > 0;
        yield book.save();
        return book;
    });
};
bookSchema.post("findOneAndDelete", function (deletedDoc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (deletedDoc) {
            yield borrow_models_1.Borrow.deleteMany({ book: deletedDoc._id });
        }
    });
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
