import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import School from './models/School.js';
import Teacher from './models/Teacher.js';
import Parent from './models/Parent.js';
import Subject from './models/Subject.js';
import Class from './models/Class.js';
import Student from './models/Student.js';
import Attendance from './models/Attendance.js';
import Exam from './models/Exam.js';
import Result from './models/Result.js';
import Fee from './models/Fee.js';
import Assignment from './models/Assignment.js';
import SuperAdminPage from './models/SuperAdminPage.js';
import connectDB from './config/db.js';

const seedSuperAdminPages = async () => {
  console.log("Seeding super admin pages...");
  const pages = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "LayoutDashboard",
      component: "SuperAdminDashboard",
    },
    {
      name: "User Management",
      path: "/dashboard/admin/user-management",
      icon: "Users",
      component: "UserManagement",
    },
    {
      name: "System Settings",
      path: "/dashboard/admin/system-settings",
      icon: "Settings",
      component: "SystemSettings",
    },
    {
      name: "Reports",
      path: "/dashboard/admin/reports",
      icon: "BarChart",
      component: "Reports",
    },
    {
      name: "Audit Logs",
      path: "/dashboard/admin/audit-logs",
      icon: "FileText",
      component: "AuditLogs",
    },
    {
      name: "Backup Management",
      path: "/dashboard/admin/backup-management",
      icon: "DatabaseBackup",
      component: "BackupManagement",
    },
    {
        name: "Schools",
        path: "/dashboard/schools",
        icon: "School",
        component: "SchoolList",
    }
  ];

  await SuperAdminPage.insertMany(pages);
  console.log(`Created ${pages.length} super admin pages`);
};

const seedUsers = async () => {
  console.log("Seeding users...");
  const users = [
    {
      firstName: "Super",
      lastName: "Admin",
      email: "admin@school.com",
      password: await hashPassword("admin123"),
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
    {
      firstName: "School",
      lastName: "Admin",
      email: "schooladmin@school.com",
      password: await hashPassword("admin123"),
      role: "SCHOOL_ADMIN",
      status: "ACTIVE",
    },
    {
        firstName: "MultiSchool",
        lastName: "Admin",
        email: "multischooladmin@school.com",
        password: await hashPassword("admin123"),
        role: "MULTI_SCHOOL_ADMIN",
        status: "ACTIVE",
    },
  ];

  // Add 5 teachers
  for (let i = 1; i <= 5; i++) {
    users.push({
      firstName: `Teacher${i}`,
      lastName: "Smith",
      email: `teacher${i}@school.com`,
      password: await hashPassword("teacher123"),
      role: "TEACHER",
      status: "ACTIVE",
    });
  }

  // Add 5 parents
  for (let i = 1; i <= 5; i++) {
    users.push({
      firstName: `Parent${i}`,
      lastName: "Johnson",
      email: `parent${i}@gmail.com`,
      password: await hashPassword("parent123"),
      role: "PARENT",
      status: "ACTIVE",
    });
  }

  // Add 20 students
  for (let i = 1; i <= 20; i++) {
    users.push({
      firstName: `Student${i}`,
      lastName: "Doe",
      email: `student${i}@school.com`,
      password: await hashPassword("student123"),
      role: "STUDENT",
      status: "ACTIVE",
    });
  }

  const createdUsers = await User.insertMany(users);
  console.log(`Created ${createdUsers.length} users`);
  return createdUsers;
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const seedSchools = async () => {
    console.log("Seeding schools...");
    const schools = [
        {
            name: "School A",
            address: "123 Main St",
            contactInfo: {
                phone: "123-456-7890",
                email: "schoola@test.com",
            },
            status: "ACTIVE",
        },
        {
            name: "School B",
            address: "456 Oak Ave",
            contactInfo: {
                phone: "098-765-4321",
                email: "schoolb@test.com",
            },
            status: "ACTIVE",
        },
    ];

    const createdSchools = await School.insertMany(schools);
    console.log(`Created ${createdSchools.length} schools`);
    return createdSchools;
};

const clearAllCollections = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
    console.log("All collections cleared");
};

const seedTeachers = async (users, schools) => {
  console.log("Seeding teachers...");
  const teachers = [];
  const teacherUsers = users.filter(user => user.role === "TEACHER");

  for (let i = 0; i < teacherUsers.length; i++) {
    teachers.push({
      user: teacherUsers[i]._id,
      school: schools[i % schools.length]._id,
      employeeId: `EMP${2024}${i + 1}`,
      qualification: "Master's in Education",
      specialization: ["Mathematics", "Science", "English", "History", "Geography"][i],
      status: "ACTIVE",
      address: "123 Teacher Street, City, State, 12345",
      contactInfo: {
        phone: "1234567890",
        emergencyContact: {
          name: "Emergency Contact",
          relation: "Spouse",
          phone: "9876543210"
        }
      },
      dateOfBirth: new Date("1980-01-01"),
      salary: 50000,
      joiningDate: new Date(),
    });
  }

  const createdTeachers = await Teacher.insertMany(teachers);
  console.log(`Created ${createdTeachers.length} teachers`);
  return createdTeachers;
};

const seedParents = async (users) => {
  console.log("Seeding parents...");
  const parents = [];
  const parentUsers = users.filter(user => user.role === "PARENT");

  for (let i = 0; i < parentUsers.length; i++) {
    parents.push({
      user: parentUsers[i]._id,
      contactNumber: "1234567890",
      address: {
        street: "456 Parent Avenue",
        city: "Parentville",
        state: "State",
        postalCode: "12345",
        country: "USA"
      }
    });
  }

  const createdParents = await Parent.insertMany(parents);
  console.log(`Created ${createdParents.length} parents`);
  return createdParents;
};

const seedSubjects = async () => {
  console.log("Seeding subjects...");
  const subjects = [
    { name: "Mathematics", code: "MATH101", credits: 4, type: "MANDATORY" },
    { name: "Science", code: "SCI101", credits: 4, type: "MANDATORY" },
    { name: "English", code: "ENG101", credits: 4, type: "MANDATORY" },
    { name: "History", code: "HIS101", credits: 3, type: "MANDATORY" },
    { name: "Geography", code: "GEO101", credits: 3, type: "MANDATORY" }
  ];

  const createdSubjects = await Subject.insertMany(subjects);
  console.log(`Created ${createdSubjects.length} subjects`);
  return createdSubjects;
};

const seedClasses = async (teachers, subjects, schools) => {
  console.log("Seeding classes...");
  const classes = [
    { name: "Class 6", section: "A", academicYear: "2024-2025" },
    { name: "Class 7", section: "A", academicYear: "2024-2025" },
    { name: "Class 8", section: "A", academicYear: "2024-2025" },
    { name: "Class 9", section: "A", academicYear: "2024-2025" },
    { name: "Class 10", section: "A", academicYear: "2024-2025" }
  ];

  const createdClasses = [];
  for (let i = 0; i < classes.length; i++) {
    const classObj = {
      ...classes[i],
      school: schools[i % schools.length]._id,
      classTeacher: teachers[i]._id,
      subjects: subjects.map(subject => subject._id),
      schedule: generateClassSchedule(teachers, subjects)
    };
    createdClasses.push(await Class.create(classObj));
  }

  console.log(`Created ${createdClasses.length} classes`);
  return createdClasses;
};

const generateClassSchedule = (teachers, subjects) => {
  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
  const schedule = [];

  for (const day of days) {
    const periods = [];
    for (let i = 0; i < 6; i++) {
      const startHour = 8 + i;
      const endHour = 9 + i;
      periods.push({
        subject: subjects[i % subjects.length]._id,
        teacher: teachers[i % teachers.length]._id,
        startTime: `${startHour < 10 ? '0' : ''}${startHour}:00`,
        endTime: `${endHour < 10 ? '0' : ''}${endHour}:00`
      });
    }
    schedule.push({ day, periods });
  }

  return schedule;
};

const seedStudents = async (users, classes, parents, schools) => {
  console.log("Seeding students...");
  const students = [];
  const studentUsers = users.filter(user => user.role === "STUDENT");

  for (let i = 0; i < studentUsers.length; i++) {
    students.push({
      user: studentUsers[i]._id,
      school: schools[i % schools.length]._id,
      admissionNumber: `2024${String(i + 1).padStart(3, '0')}`,
      class: classes[i % classes.length]._id,
      rollNumber: String(i + 1).padStart(2, '0'),
      dateOfBirth: new Date(2010, 0, 1),
      gender: i % 2 === 0 ? "MALE" : "FEMALE",
      parentInfo: {
        father: {
          name: "John Doe",
          occupation: "Engineer",
          contact: "1234567890"
        },
        mother: {
          name: "Jane Doe",
          occupation: "Doctor",
          contact: "9876543210"
        },
        guardian: parents[i % parents.length]._id
      },
      address: {
        street: "789 Student Street",
        city: "Studentville",
        state: "State",
        postalCode: "12345",
        country: "USA"
      }
    });
  }

  const createdStudents = await Student.insertMany(students);
  console.log(`Created ${createdStudents.length} students`);

  // Update parents with their children
  for (let i = 0; i < parents.length; i++) {
    const childrenIds = createdStudents
      .filter((_, index) => index % parents.length === i)
      .map(student => student._id);
    await Parent.findByIdAndUpdate(parents[i]._id, { children: childrenIds });
  }

  // Update classes with their students
  for (const cls of classes) {
    const classStudents = createdStudents
      .filter(student => student.class.toString() === cls._id.toString())
      .map(student => student._id);
    await Class.findByIdAndUpdate(cls._id, { students: classStudents });
  }

  return createdStudents;
};

const seedAttendance = async (students) => {
  console.log("Seeding attendance...");
  const attendance = [];
  const today = new Date();
  const statuses = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];

  for (const student of students) {
    // Create attendance for last 5 days
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      attendance.push({
        student: student._id,
        school: student.school,
        class: student.class,
        date,
        status,
        timeIn: status === "PRESENT" || status === "LATE" ? new Date(date.setHours(8, 0)) : null,
        timeOut: status === "PRESENT" || status === "LATE" ? new Date(date.setHours(14, 0)) : null
      });
    }
  }

  const createdAttendance = await Attendance.insertMany(attendance);
  console.log(`Created ${createdAttendance.length} attendance records`);
};

const seedExamsAndResults = async (classes, subjects, students, users) => {
  console.log("Seeding exams and results...");
  const examTypes = ["MIDTERM", "QUIZ", "ASSIGNMENT"];
  const exams = [];
  const results = [];

  const adminUser = users.find(user => user.role === "SUPER_ADMIN");

  for (const cls of classes) {
    for (const subject of subjects) {
      // Create one exam of each type for each subject in each class
      for (const type of examTypes) {
        const exam = await Exam.create({
          title: `${type} - ${subject.name}`,
          type,
          school: cls.school,
          class: cls._id,
          subject: subject._id,
          date: new Date(),
          duration: 60,
          totalMarks: 100,
          passingMarks: 40,
          status: "COMPLETED",
          createdBy: adminUser._id
        });

        exams.push(exam);

        // Create results for all students in the class
        const classStudents = students.filter(student => 
          student.class.toString() === cls._id.toString()
        );

        for (const student of classStudents) {
          results.push({
            student: student._id,
            exam: exam._id,
            marksObtained: Math.floor(Math.random() * 60) + 40, // Random marks between 40-100
            grade: "A",
            remarks: "Good performance"
          });
        }
      }
    }
  }

  const createdResults = await Result.insertMany(results);
  console.log(`Created ${exams.length} exams and ${createdResults.length} results`);
};

const seedFees = async (students) => {
  console.log("Seeding fees...");
  const fees = [];
  const feeTypes = ["TUITION", "TRANSPORT", "LIBRARY", "LABORATORY"];

  for (const student of students) {
    for (const type of feeTypes) {
      fees.push({
        student: student._id,
        school: student.school,
        amount: type === "TUITION" ? 5000 : 1000,
        type,
        dueDate: new Date(2024, 8, 30), // September 30, 2024
        status: "PENDING",
        academicYear: "2024-2025",
        term: "FALL",
        description: `${type} fee for Fall 2024`,
        createdBy: student.user
      });
    }
  }

  const createdFees = await Fee.insertMany(fees);
  console.log(`Created ${createdFees.length} fee records`);
};

const seedAssignments = async (classes, subjects, teachers) => {
  console.log("Seeding assignments...");
  const assignments = [];

  for (const cls of classes) {
    for (const subject of subjects) {
      assignments.push({
        title: `${subject.name} Assignment 1`,
        description: `Complete the ${subject.name} assignment`,
        subject: subject._id,
        class: cls._id,
        assignedBy: teachers[0]._id,
        dueDate: new Date(2024, 8, 30),
        pointsPossible: 100,
        status: "OPEN"
      });
    }
  }

  const createdAssignments = await Assignment.insertMany(assignments);
  console.log(`Created ${createdAssignments.length} assignments`);
};

const seedDatabase = async () => {
    try {
        await connectDB();
        await clearAllCollections();

        await seedSuperAdminPages();
        const schools = await seedSchools();
        const users = await seedUsers();
        const multiSchoolAdmin = users.find(user => user.role === "MULTI_SCHOOL_ADMIN");
        multiSchoolAdmin.managedSchools = schools.map(school => school._id);
        await multiSchoolAdmin.save();

        const teachers = await seedTeachers(users, schools);
        const parents = await seedParents(users);
        const subjects = await seedSubjects();
        const classes = await seedClasses(teachers, subjects, schools);
        const students = await seedStudents(users, classes, parents, schools);

        await Promise.all([
            seedAttendance(students),
            seedExamsAndResults(classes, subjects, students, users),
            seedFees(students),
            seedAssignments(classes, subjects, teachers)
        ]);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();