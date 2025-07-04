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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_models_1 = require("../models/book.models");
exports.bookRoutes = express_1.default.Router();
// create a book data
exports.bookRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const data = yield book_models_1.Book.create(body);
        res.send({
            success: true,
            message: "Book created successfully",
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error,
        });
    }
}));
// get all books 
exports.bookRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, genre, status, sortBy = "createdAt", sort = "desc", limit = "10", page = "1", } = req.query;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const skip = (parsedPage - 1) * parsedLimit;
        const query = {};
        // Search
        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [
                { title: regex },
                { author: regex },
                { isbn: regex },
            ];
        }
        // Genre filter
        if (genre && genre !== "all") {
            query.genre = genre;
        }
        // Availability status
        if (status === "available") {
            query.copies = { $gt: 0 };
        }
        else if (status === "unavailable") {
            query.copies = 0;
        }
        const sortOrder = sort === "asc" ? 1 : -1;
        const books = yield book_models_1.Book.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(parsedLimit);
        const total = yield book_models_1.Book.countDocuments(query);
        res.send({
            success: true,
            message: "Books retrieved successfully",
            meta: {
                totalItems: total,
                totalPages: Math.ceil(total / parsedLimit),
                currentPage: parsedPage,
            },
            data: books,
        });
    }
    catch (error) {
        res.status(500).send({ success: false, message: error.message, error });
    }
}));
// get a book by Id
exports.bookRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_models_1.Book.findById(bookId);
        res.json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(500).send({ success: false, message: error.message, error });
    }
}));
// update a book
exports.bookRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatedBody = req.body;
        if (typeof updatedBody.copies === "number") {
            updatedBody.available = updatedBody.copies > 0;
        }
        const updatedBook = yield book_models_1.Book.findByIdAndUpdate(bookId, updatedBody, {
            new: true,
            runValidators: true,
        });
        res.send({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        res.status(500).send({ success: false, message: error.message, error });
    }
}));
// update a book
exports.bookRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        yield book_models_1.Book.findByIdAndDelete(bookId);
        res.json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        res.status(500).send({ success: false, message: error.message, error });
    }
}));
