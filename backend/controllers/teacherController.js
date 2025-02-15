import Teacher from "../models/Teacher.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import ClassModel from "../models/Class.js";

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

// @desc    Create a teacher
// @route   POST /api/teachers
// @access  Private/Admin
const createTeacher = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, employeeId, qualification, specialization, address, contactNumber, dateOfBirth, salary } = req.body;

  const teacherExists = await Teacher.findOne({ employeeId });

  if (teacherExists) {
    res.status(400);
    throw new Error("Teacher with this employee ID already exists");
  }

  // Create a new user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: generateRandomPassword(), // Generate a random password
    role: "TEACHER",
    status: "ACTIVE",
  });

  const teacher = await Teacher.create({
    user: user._id,
    employeeId,
    qualification,
    specialization,
    address,
    contactNumber,
    dateOfBirth,
    salary
  });

  if (teacher) {
    res.status(201).json({
      _id: teacher._id,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      employeeId: teacher.employeeId,
      qualification: teacher.qualification,
      specialization: teacher.specialization,
      status: teacher.status,
      address: teacher.address,
      contactNumber: teacher.contactNumber,
      dateOfBirth: teacher.dateOfBirth,
      salary: teacher.salary
    });
  } else {
    res.status(400);
    throw new Error("Invalid teacher data");
  }
});

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private/Admin
const updateTeacher = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, employeeId, qualification, specialization, status, address, contactNumber, dateOfBirth, salary } = req.body;

  const teacher = await Teacher.findById(req.params.id).populate('user', 'firstName lastName email');

  if (teacher) {
    // Update user information
    teacher.user.firstName = firstName || teacher.user.firstName;
    teacher.user.lastName = lastName || teacher.user.lastName;
    teacher.user.email = email || teacher.user.email;
    await teacher.user.save();

    // Update teacher information
    teacher.employeeId = employeeId || teacher.employeeId;
    teacher.qualification = qualification || teacher.qualification;
    teacher.specialization = specialization || teacher.specialization;
    teacher.status = status || teacher.status;
    teacher.address = address || teacher.address;
    teacher.contactNumber = contactNumber || teacher.contactNumber;
    teacher.dateOfBirth = dateOfBirth || teacher.dateOfBirth;
    teacher.salary = salary || teacher.salary;

    const updatedTeacher = await teacher.save();

    res.json({
      _id: updatedTeacher._id,
      user: {
        _id: teacher.user._id,
        firstName: teacher.user.firstName,
        lastName: teacher.user.lastName,
        email: teacher.user.email,
        role: teacher.user.role,
      },
      employeeId: updatedTeacher.employeeId,
      qualification: updatedTeacher.qualification,
      specialization: updatedTeacher.specialization,
      status: updatedTeacher.status,
      address: updatedTeacher.address,
      contactNumber: updatedTeacher.contactNumber,
      dateOfBirth: updatedTeacher.dateOfBirth,
      salary: updatedTeacher.salary
    });
  } else {
    res.status(404);
    throw new Error("Teacher not found");
  }
});

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate('user');

  if (teacher) {
    // Delete the associated user
    await User.findByIdAndDelete(teacher.user._id);

    // Delete the teacher
    await Teacher.findByIdAndDelete(req.params.id);

    res.json({ message: "Teacher and associated user removed" });
  } else {
    res.status(404);
    throw new Error("Teacher not found");
  }
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

// @desc    Assign teacher to class
// @route   PUT /api/teachers/:id/assign-class
// @access  Private/Admin
const assignTeacherToClass = asyncHandler(async (req, res) => {
  const { classId } = req.body;
  const teacher = await Teacher.findById(req.params.id);
  const classToAssign = await ClassModel.findById(classId);

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  if (!classToAssign) {
    res.status(404);
    throw new Error("Class not found");
  }

  // Add class to teacher's assignedClasses array
  teacher.assignedClasses.push(classId);
  await teacher.save();

  // Optionally, set the teacher as the class teacher
  classToAssign.classTeacher = req.params.id;
  await classToAssign.save();

  res.json({ message: "Teacher assigned to class successfully" });
});

// @desc    Assign subject to teacher
// @route   PUT /api/teachers/:id/assign-subject
// @access  Private/Admin
const assignSubjectToTeacher = asyncHandler(async (req, res) => {
  const { subjectId } = req.body;
  const teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  // Add subject to teacher's assignedSubjects array
  teacher.assignedSubjects.push(subjectId);
  await teacher.save();

  res.json({ message: "Subject assigned to teacher successfully" });
});

// Function to generate a random password
const generateRandomPassword = () => {
  const length = 12;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

export {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  updateTeacherStatus,
  getTeacherClasses,
  getTeacherSchedule,
  assignTeacherToClass,
  assignSubjectToTeacher
};
