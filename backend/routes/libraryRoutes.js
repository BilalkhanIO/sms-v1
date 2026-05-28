// routes/libraryRoutes.js
import express from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
  getMyBorrowedBooks,
} from "../controllers/libraryController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// GET /api/library/my-books - Get books borrowed by logged-in user
router
  .route("/my-books")
  .get(protect, setSchoolId, getMyBorrowedBooks);

// GET /api/library/books - Get all books (paginated, search, category)
// POST /api/library/books - Create a new book (Admin only)
router
  .route("/books")
  .get(protect, setSchoolId, getBooks)
  .post(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    createBook
  );

// POST /api/library/books/:id/issue - Issue a book
router
  .route("/books/:id/issue")
  .post(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    issueBook
  );

// PUT /api/library/books/:id/return/:issueId - Return a book
router
  .route("/books/:id/return/:issueId")
  .put(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    returnBook
  );

// GET /api/library/books/:id - Get book by ID
// PUT /api/library/books/:id - Update book (Admin only)
// DELETE /api/library/books/:id - Delete book (Admin only)
router
  .route("/books/:id")
  .get(protect, setSchoolId, getBookById)
  .put(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    updateBook
  )
  .delete(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    deleteBook
  );

export default router;
