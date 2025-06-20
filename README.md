# 📚 Library Management APP

A robust RESTful API for managing library books and borrowings, built with **Express**, **TypeScript**, and **MongoDB** using **Mongoose**.

---

## 🚀 Features

- Create, update, retrieve, and delete books
- Borrow books with quantity and due date logic
- Automatically handle availability status
- Get borrow summary using aggregation pipeline
- Schema validation, business rules, middleware, and Mongoose instance/static methods

---

## 🛠️ Tech Stack

- **Backend**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose

---

## 📦 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/library-management-api.git
cd library-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Create a `.env` file:

```

MONGODB_URI=mongodb://localhost:27017/library-management or connect with your mongodb driver
```

### 4. Start the Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## 📘 Book Model

| Field         | Type    | Required | Notes                                                              |
| ------------- | ------- | -------- | ------------------------------------------------------------------ |
| `title`       | string  | ✅       | Book title                                                         |
| `author`      | string  | ✅       | Book author                                                        |
| `genre`       | string  | ✅       | One of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY |
| `isbn`        | string  | ✅       | Unique identifier (ISBN)                                           |
| `description` | string  | ❌       | Optional description                                               |
| `copies`      | number  | ✅       | Non-negative integer                                               |
| `available`   | boolean | ❌       | Defaults to `true`. Automatically managed based on `copies`        |

---

## 📘 Borrow Model

| Field      | Type     | Required | Notes                           |
| ---------- | -------- | -------- | ------------------------------- |
| `book`     | ObjectId | ✅       | Reference to a Book ID          |
| `quantity` | number   | ✅       | Must be a positive integer      |
| `dueDate`  | ISO Date | ✅       | Due date for returning the book |

---

## ❌ Generic Error Response

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```

---

## 📖 API Endpoints

### 1. 📚 Create Book

**POST** `/api/books`

#### Request:

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": { ... }
}
```

---

### 2. 📚 Get All Books

**GET** `/api/books`

#### Query Parameters:

- `filter`: Filter by genre
- `sortBy`: Field to sort by (e.g., `createdAt`)
- `sort`: `asc` or `desc`
- `limit`: Number of results (default: 10)

#### Example:

```
GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5
```

#### Response:

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [ ... ]
}
```

---

### 3. 📘 Get Book by ID

**GET** `/api/books/:bookId`

#### Response:

```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": { ... }
}
```

---

### 4. 📝 Update Book

**PUT** `/api/books/:bookId`

#### Request:

```json
{
  "copies": 50
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": { ... }
}
```

---

### 5. 🗑️ Delete Book

**DELETE** `/api/books/:bookId`

#### Response:

```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

---

### 6. 📦 Borrow a Book

**POST** `/api/borrow`

#### Request:

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

✅ **Business Logic**:

- Book must exist and have enough copies
- Deducts quantity
- Sets `available` to false if copies reach 0

#### Response:

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": { ... }
}
```

---

### 7. 📊 Borrowed Books Summary

**GET** `/api/borrow`

Uses aggregation to return total borrowed quantity per book.

#### Response:

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

---

## 🧠 Mongoose Features Used

- **Validation**: Required fields, value checks (e.g., non-negative copies)
- **Static Methods**: `Book.borrowCopies()` used to encapsulate borrow logic
- **Middleware**:
  - `pre-save`: Recalculates availability
  - `post-save`: Logging or hooks

---

## 🧪 Testing

You can test the API using:

- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/)
- CURL or any HTTP client

---
