import express, { Request, Response } from "express";
import { Book } from "../models/book.models";
import { Borrow } from "../models/borrow.models";
export const borrowRoutes = express.Router();

// create borrowed book data
borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { book, quantity, dueDate } = req.body;
    const borrowRecord = await Borrow.create({ book, quantity, dueDate });

    res.status(201).send({
      success: true,
      message: "Book borrowed successfully",
      data: borrowRecord,
    });
  } catch (error: any) {
    res.status(400).send({ success: false, message: error.message, error });
  }
});

// get borrowed book by bookId
borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      // stage-1
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
          dueDates: { $push: "$dueDate" }
        },
      },
      // stage-2
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },

      // stage-3
      { $unwind: "$book" },

      // stage-4
      {
        $project: {
          _id: 0,
          book: {
            title: "$book.title",
            isbn: "$book.isbn",
          
          },
          totalQuantity: 1,
          dueDates:1
        },
      },
    ]);

    res.send({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: error.message,
      error,
    });
  }
});
