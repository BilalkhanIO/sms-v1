// controllers/examController.js
import Exam from "../models/Exam.js";
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private/Teacher
const createExam = asyncHandler(async (req, res) => {
  const exam = await Exam.create({
    ...req.body,
    createdBy: req.user.id,
    status: "SCHEDULED",
  });

  await Activity.logActivity({
    userId: req.user.id,
    type: "EXAM_CREATED",
    description: `Created exam: ${exam.title}`,
    metadata: { examId: exam._id },
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.status(201).json(exam);
});

// @desc    Add exam result
// @route   POST /api/exams/:id/results
// @access  Private/Teacher
const addExamResult = asyncHandler(async (req, res) => {
  const { student, marksObtained } = req.body;
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  const result = {
    student,
    marksObtained,
    grade: calculateGrade(marksObtained, exam.totalMarks),
  };

  exam.results.push(result);
  await exam.save();

  res.json(exam);
});

// @desc    Update exam status
// @route   PUT /api/exams/:id/status
// @access  Private/Teacher
const updateExamStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  exam.status = status;
  await exam.save();

  await Activity.logActivity({
    userId: req.user.id,
    type: "SYSTEM",
    description: `Updated exam status to ${status}`,
    metadata: { examId: exam._id },
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.json(exam);
});

// @desc    Get exam results
// @route   GET /api/exams/:id/results
// @access  Private
const getExamResults = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id)
    .populate("results.student", "admissionNumber rollNumber")
    .select("results title date");

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.json({
    exam: exam.title,
    date: exam.date,
    results: exam.results,
  });
});

function calculateGrade(marks, total) {
  const percentage = (marks / total) * 100;
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

export { createExam, addExamResult, updateExamStatus, getExamResults };
