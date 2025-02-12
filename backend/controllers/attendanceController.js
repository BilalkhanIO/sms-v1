// controllers/attendanceController.js
import Attendance from "../models/Attendance.js";
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private/Teacher
const markAttendance = asyncHandler(async (req, res) => {
  const { classId, date, students } = req.body;

  // Validate input
  if (!Array.isArray(students)) {
    res.status(400);
    throw new Error("Invalid attendance data");
  }

  const attendanceRecords = await Promise.all(
    students.map(async (student) => {
      const record = await Attendance.create({
        student: student.id,
        class: classId,
        date: new Date(date),
        status: student.status,
        timeIn: student.timeIn,
        timeOut: student.timeOut,
      });

      // Log activity for each student
      await Activity.logActivity({
        userId: req.user.id,
        type: "ATTENDANCE_MARKED",
        description: `Marked ${student.status} for student ${student.id}`,
        metadata: {
          studentId: student.id,
          classId,
          date,
        },
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return record;
    })
  );

  res.status(201).json(attendanceRecords);
});

// @desc    Get attendance report
// @route   GET /api/attendance/report
// @access  Private/Admin
const getAttendanceReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, classId } = req.query;

  const match = {};
  if (startDate && endDate) {
    match.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  if (classId) match.class = classId;

  const report = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        students: { $addToSet: "$student" },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        uniqueStudents: { $size: "$students" },
        _id: 0,
      },
    },
  ]);

  res.json(report);
});

// @desc    Bulk update attendance
// @route   PUT /api/attendance/bulk
// @access  Private/Teacher
const bulkUpdateAttendance = asyncHandler(async (req, res) => {
  const { date, classId, attendanceData } = req.body;

  const bulkOps = attendanceData.map((record) => ({
    updateOne: {
      filter: {
        student: record.studentId,
        class: classId,
        date: new Date(date),
      },
      update: {
        $set: { status: record.status },
      },
      upsert: true,
    },
  }));

  await Attendance.bulkWrite(bulkOps);

  await Activity.logActivity({
    userId: req.user.id,
    type: "ATTENDANCE_MARKED",
    description: `Bulk updated attendance for ${attendanceData.length} students`,
    metadata: { classId, date },
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.json({ message: "Attendance updated successfully" });
});

export { markAttendance, getAttendanceReport, bulkUpdateAttendance };
