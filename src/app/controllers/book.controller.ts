import express, { Request, Response } from "express";
import { Book } from "../models/book.models";
export const bookRoutes = express.Router();

// create a book data
bookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const data = await Book.create(body);
    res.send({
      success: true,
      message: "Book created successfully",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

// get all books 
bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      search,
      genre,
      status,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
      page = "1",
    } = req.query;

    const parsedLimit = parseInt(limit as string);
    const parsedPage = parseInt(page as string);
    const skip = (parsedPage - 1) * parsedLimit;

    const query: any = {};

    // Search
    if (search) {
      const regex = new RegExp(search as string, "i");
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
    } else if (status === "unavailable") {
      query.copies = 0;
    }

    const sortOrder = sort === "asc" ? 1 : -1;

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(skip)
      .limit(parsedLimit);

    const total = await Book.countDocuments(query);

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
  } catch (error: any) {
    res.status(500).send({ success: false, message: error.message, error });
  }
});


// get a book by Id
bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId);

    res.json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error: any) {
    res.status(500).send({ success: false, message: error.message ,error});
  }
});

// update a book
bookRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const updatedBody = req.body;
     if (typeof updatedBody.copies === "number") {
      updatedBody.available = updatedBody.copies > 0;
    }
    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBody, {
      new: true,
      runValidators: true,
    });

    res.send({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error: any) {
    res.status(500).send({ success: false, message: error.message ,error});
  }
});
// update a book
bookRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;

    await Book.findByIdAndDelete(bookId);
    res.json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res.status(500).send({ success: false, message: error.message ,error});
  }
});
