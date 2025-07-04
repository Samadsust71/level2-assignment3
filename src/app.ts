import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/book.controller";
import { borrowRoutes } from "./app/controllers/borrow.controller";
import cors from "cors"
const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin:["http://localhost:5173", "https://library-management-system-frontend-bice.vercel.app"]
  })
);
app.use("/api/books", bookRoutes)
app.use("/api/borrow", borrowRoutes)


app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management App");
});

export default app;