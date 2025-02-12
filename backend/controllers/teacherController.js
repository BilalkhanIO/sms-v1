// controllers/teacherController.js
import Teacher from "../models/Teacher.js";
import asyncHandler from "express-async-handler";

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private/Admin
const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find()
    .populate("user", "firstName lastName email")
    .populate("assignedClasses", "name section")
    .populate("assignedSubjects", "name code");

  res.json(teachers);
});

// @desc    Update teacher status
// @route   PUT /api/teachers/:id/status
// @access  Private/Admin
const updateTeacherStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  teacher.status = status;
  await teacher.save();

  res.json(teacher);
});

// @desc    Get teacher's classes
// @route   GET /api/teachers/:id/classes
// @access  Private
const getTeacherClasses = asyncHandler(async (req, res) => {
  const classes = await ClassModel.find({
    $or: [
      { classTeacher: req.params.id },
      { "subjects.teacher": req.params.id },
    ],
  }).populate("subjects.subject", "name code");

  res.json(classes);
});

// @desc    Get teacher's schedule
// @route   GET /api/teachers/:id/schedule
// @access  Private
const getTeacherSchedule = asyncHandler(async (req, res) => {
  const classes = await ClassModel.find({
    "schedule.periods.teacher": req.params.id,
  }).select("name section schedule");

  const schedule = classes.flatMap((cls) =>
    cls.schedule.map((day) => ({
      day: day.day,
      periods: day.periods.filter(
        (p) => p.teacher.toString() === req.params.id
      ),
    }))
  );

  res.json(schedule);
});

export {
  getTeachers,
  updateTeacherStatus,
  getTeacherClasses,
  getTeacherSchedule,
};
