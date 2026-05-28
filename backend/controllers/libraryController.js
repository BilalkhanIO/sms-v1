// controllers/libraryController.js
import LibraryBook from "../models/LibraryBook.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const FINE_RATE = parseFloat(process.env.LIBRARY_FINE_RATE) || 0.5; // $ per day

// @desc    Get all books (paginated, school-scoped, optional search/category)
// @route   GET /api/library/books
// @access  Private
const getBooks = [
  protect,
  asyncHandler(async (req, res) => {
    const { search, category, page = 1, limit = 20 } = req.query;

    const query = { school: req.schoolId };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await LibraryBook.countDocuments(query);
    const books = await LibraryBook.find(query)
      .select("-issues")
      .sort({ title: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    return successResponse(
      res,
      { books, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
      "Books retrieved successfully"
    );
  }),
];

// @desc    Get a single book by ID
// @route   GET /api/library/books/:id
// @access  Private
const getBookById = [
  protect,
  asyncHandler(async (req, res) => {
    const book = await LibraryBook.findOne({
      _id: req.params.id,
      school: req.schoolId,
    }).lean();

    if (!book) {
      return errorResponse(res, "Book not found", 404);
    }

    return successResponse(res, book, "Book retrieved successfully");
  }),
];

// @desc    Create a new book
// @route   POST /api/library/books
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const createBook = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  body("title").notEmpty().withMessage("Title is required").trim(),
  body("author").notEmpty().withMessage("Author is required").trim(),
  body("totalCopies")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Total copies must be at least 1"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const {
      title,
      author,
      isbn,
      category,
      publisher,
      publishYear,
      totalCopies = 1,
      location,
      coverImage,
      description,
    } = req.body;

    const book = await LibraryBook.create({
      title,
      author,
      isbn,
      category,
      publisher,
      publishYear,
      totalCopies,
      availableCopies: totalCopies,
      location,
      coverImage,
      description,
      school: req.schoolId,
    });

    return successResponse(res, book, "Book created successfully", 201);
  }),
];

// @desc    Update a book
// @route   PUT /api/library/books/:id
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const updateBook = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  asyncHandler(async (req, res) => {
    const book = await LibraryBook.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

    if (!book) {
      return errorResponse(res, "Book not found", 404);
    }

    const {
      title,
      author,
      isbn,
      category,
      publisher,
      publishYear,
      totalCopies,
      location,
      coverImage,
      description,
      status,
    } = req.body;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (isbn !== undefined) book.isbn = isbn;
    if (category !== undefined) book.category = category;
    if (publisher !== undefined) book.publisher = publisher;
    if (publishYear !== undefined) book.publishYear = publishYear;
    if (location !== undefined) book.location = location;
    if (coverImage !== undefined) book.coverImage = coverImage;
    if (description !== undefined) book.description = description;
    if (status !== undefined) book.status = status;

    // Adjust availableCopies when totalCopies changes
    if (totalCopies !== undefined) {
      const diff = totalCopies - book.totalCopies;
      book.totalCopies = totalCopies;
      book.availableCopies = Math.max(0, book.availableCopies + diff);
    }

    const updated = await book.save();
    return successResponse(res, updated, "Book updated successfully");
  }),
];

// @desc    Delete a book (only if no active issues)
// @route   DELETE /api/library/books/:id
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const deleteBook = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  asyncHandler(async (req, res) => {
    const book = await LibraryBook.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

    if (!book) {
      return errorResponse(res, "Book not found", 404);
    }

    const activeIssues = book.issues.filter((i) => i.status === "ISSUED" || i.status === "OVERDUE");
    if (activeIssues.length > 0) {
      return errorResponse(
        res,
        "Cannot delete book with active issues. Please return all copies first.",
        400
      );
    }

    await LibraryBook.deleteOne({ _id: book._id });
    return successResponse(res, null, "Book deleted successfully");
  }),
];

// @desc    Issue a book to a borrower
// @route   POST /api/library/books/:id/issue
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const issueBook = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  body("borrowerId").notEmpty().withMessage("Borrower ID is required").isMongoId().withMessage("Invalid borrower ID"),
  body("dueDate").isISO8601().withMessage("Valid due date is required").toDate(),
  body("borrowerType")
    .optional()
    .isIn(["STUDENT", "TEACHER", "STAFF"])
    .withMessage("Invalid borrower type"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const book = await LibraryBook.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

    if (!book) {
      return errorResponse(res, "Book not found", 404);
    }

    if (book.availableCopies <= 0 || book.status === "OUT_OF_STOCK") {
      return errorResponse(res, "No copies available for issue", 400);
    }

    const { borrowerId, dueDate, borrowerType } = req.body;

    const issueRecord = {
      borrower: borrowerId,
      borrowerType,
      issuedDate: new Date(),
      dueDate: new Date(dueDate),
      status: "ISSUED",
    };

    book.issues.push(issueRecord);
    book.availableCopies -= 1;
    if (book.availableCopies === 0) {
      book.status = "OUT_OF_STOCK";
    }

    const saved = await book.save();
    const newIssue = saved.issues[saved.issues.length - 1];

    return successResponse(
      res,
      { book: { _id: saved._id, title: saved.title, availableCopies: saved.availableCopies }, issue: newIssue },
      "Book issued successfully",
      201
    );
  }),
];

// @desc    Return a book and calculate fine if overdue
// @route   PUT /api/library/books/:id/return/:issueId
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const returnBook = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  asyncHandler(async (req, res) => {
    const { id, issueId } = req.params;

    const book = await LibraryBook.findOne({ _id: id, school: req.schoolId });
    if (!book) {
      return errorResponse(res, "Book not found", 404);
    }

    const issue = book.issues.id(issueId);
    if (!issue) {
      return errorResponse(res, "Issue record not found", 404);
    }

    if (issue.status === "RETURNED") {
      return errorResponse(res, "Book already returned", 400);
    }

    const returnDate = new Date();
    issue.returnDate = returnDate;
    issue.status = "RETURNED";

    let fine = 0;
    if (returnDate > issue.dueDate) {
      const overdueDays = Math.ceil((returnDate - issue.dueDate) / (1000 * 60 * 60 * 24));
      fine = overdueDays * FINE_RATE;
    }
    issue.fine = fine;

    book.availableCopies += 1;
    if (book.status === "OUT_OF_STOCK" && book.availableCopies > 0) {
      book.status = "AVAILABLE";
    }

    await book.save();

    return successResponse(
      res,
      { issue, fine, availableCopies: book.availableCopies },
      fine > 0
        ? `Book returned with a fine of $${fine.toFixed(2)}`
        : "Book returned successfully"
    );
  }),
];

// @desc    Get books currently borrowed by the logged-in user
// @route   GET /api/library/my-books
// @access  Private
const getMyBorrowedBooks = [
  protect,
  asyncHandler(async (req, res) => {
    const books = await LibraryBook.find({
      school: req.schoolId,
      "issues.borrower": req.user._id,
      "issues.status": { $in: ["ISSUED", "OVERDUE"] },
    })
      .select("title author isbn category issues")
      .lean();

    // Filter issues to only those belonging to this user and still active
    const result = books.map((book) => ({
      _id: book._id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      issues: book.issues.filter(
        (i) =>
          i.borrower.toString() === req.user._id.toString() &&
          (i.status === "ISSUED" || i.status === "OVERDUE")
      ),
    }));

    return successResponse(res, result, "Borrowed books retrieved successfully");
  }),
];

export {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
  getMyBorrowedBooks,
};
