1. User Model:

Purpose: Represents any person in the school system. It's the base model for roles.
Roles (enum): SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT
Key Fields: firstName, lastName, email, password, role, status, profilePicture, lastLogin
Crucial Feature: Password hashing and matchPassword method for authentication.
Relationships:
One-to-one with Teacher: A User can be a Teacher (extended by the Teacher model).
One-to-one with Parent: A User can be a Parent (extended by the Parent model).
One-to-one with Student: A User can be a Student (extended by the Student model).
Creator/Updater for many models: Used in Fee, Exam, Event, Activity models to track creation and updates.
Recipient of Notifications: Linked to Notification model as the recipient.
Logged in Activities: Tracked in the Activity model.
2. Student Model:

Purpose: Extends the User model to include student-specific information.
Key Fields: user (ref to User), admissionNumber, class (ref to Class), rollNumber, dateOfBirth, gender, parentInfo, address, academicHistory, medicalInfo, documents, status
Relationships:
One-to-one with User: user: { ref: "User", required: true } - Every Student record is linked to a User record with the role "STUDENT".
Many-to-one with Class: class: { ref: "Class", required: true } - Each student belongs to one current class.
Many-to-one with Parent (Implicit): Parent information is embedded, and Parents are linked via the Parent model and children array.
One-to-many with Fee: Fee records are created for each student.
One-to-many with Exam (Results): Exam results are stored per student per exam.
One-to-many with Attendance: Attendance records are kept per student per class per date.
One-to-many with Assignment (Submissions): Assignment submissions are made by students.
3. Teacher Model:

Purpose: Extends the User model to include teacher-specific information.
Key Fields: user (ref to User), employeeId, qualification, specialization, assignedClasses (ref to Class), assignedSubjects (ref to Subject), status, address, contactInfo, dateOfBirth, salary, joiningDate, documents
Relationships:
One-to-one with User: user: { ref: "User", required: true } - Every Teacher record is linked to a User record with the role "TEACHER".
Many-to-many with Class (Assigned Classes): assignedClasses: [{ ref: "Class" }] - Teachers can be assigned to teach multiple classes. Also as classTeacher in Class Model.
Many-to-many with Subject (Assigned Subjects): assignedSubjects: [{ ref: "Subject" }] - Teachers can be assigned to teach multiple subjects.
One-to-many with Class (Class Teacher): Each Class has one classTeacher (ref to Teacher).
Assigner of Assignments: Teachers assignedBy assignments in the Assignment model.
Potentially Creator/Updater of Exams: While not directly linked by ref in Exam model, teachers likely play a role in exam management.
Scheduled in Classes: Teachers are linked to Class schedules defining teaching slots.
4. Parent Model:

Purpose: Extends the User model to include parent-specific information.
Key Fields: user (ref to User), children (ref to Student), contactNumber, address
Relationships:
One-to-one with User: user: { ref: "User", required: true } - Every Parent record is linked to a User record with the role "PARENT".
One-to-many with Student (Children): children: [{ ref: "Student" }] - Parents can have multiple children who are students.
5. Class Model:

Purpose: Represents a class or grade level within the school.
Key Fields: name, section, academicYear, classTeacher (ref to Teacher), subjects (array of { subject: { ref: "Subject" }}), students (ref to Student), schedule (array of days and periods)
Relationships:
Many-to-many with Subject: subjects: [...] and Subject.assignedClasses: [...] - Classes have multiple subjects and subjects are taught in multiple classes.
Many-to-many with Student: students: [{ ref: "Student" }] - Classes have multiple students.
Many-to-many with Teacher (via Schedule): schedule: [...] periods: [...] teacher: { ref: "Teacher" } - Classes are associated with multiple teachers through the schedule.
One-to-one with Teacher (Class Teacher): classTeacher: { ref: "Teacher", required: true } - Each class has one designated class teacher.
One-to-many with Exam: Exams are conducted for specific classes.
One-to-many with Attendance: Attendance records are kept for each class on different dates.
One-to-many with Assignment: Assignments are given to specific classes.
6. Subject Model:

Purpose: Represents a subject taught in the school.
Key Fields: name, code, description, credits, type (enum: MANDATORY, ELECTIVE), syllabus, assignedTeachers (ref to Teacher), assignedClasses (ref to Class)
Relationships:
Many-to-many with Class: assignedClasses: [{ ref: "Class" }] and Class.subjects: [...] - Subjects are taught in multiple classes, and classes have multiple subjects.
Many-to-many with Teacher: assignedTeachers: [{ ref: "Teacher" }] - Subjects can be taught by multiple teachers.
One-to-many with Exam: Exams are conducted for specific subjects.
One-to-many with Assignment: Assignments are given for specific subjects.
7. Fee Model:

Purpose: Manages fee payments for students.
Key Fields: student (ref to Student), amount, type (enum: TUITION, etc.), dueDate, status (enum: PENDING, etc.), paymentMethod, paidAmount, paidDate, academicYear, term, description, transactionId, receiptNumber, createdBy (ref to User), updatedBy (ref to User)
Relationships:
Many-to-one with Student: student: { ref: "Student", required: true } - Fees are associated with individual students.
Many-to-one with User (Creator/Updater): createdBy: { ref: "User", required: true }, updatedBy: { ref: "User" } - Tracks who created and updated the fee record.
8. Exam Model:

Purpose: Manages exams, including schedules, results, and grading.
Key Fields: title, type (enum: MIDTERM, etc.), class (ref to Class), subject (ref to Subject), date, duration, totalMarks, passingMarks, status (enum: SCHEDULED, etc.), results (array of { student (ref to Student), marksObtained, grade, remarks }), createdBy (ref to User), updatedBy (ref to User)
Relationships:
Many-to-one with Class: class: { ref: "Class", required: true } - Exams are conducted for specific classes.
Many-to-one with Subject: subject: { ref: "Subject", required: true } - Exams are conducted for specific subjects.
One-to-many with Student (Results): results: [...] student: { ref: "Student" } - Stores results for multiple students within each exam.
Many-to-one with User (Creator/Updater): createdBy: { ref: "User", required: true }, updatedBy: { ref: "User" } - Tracks who created and updated the exam record.
9. Notification Model:

Purpose: Sends notifications to users.
Key Fields: recipient (ref to User), message, type (enum: INFO, etc.), read, link
Relationships:
Many-to-one with User (Recipient): recipient: { ref: "User", required: true } - Each notification is directed to a specific user. (Role-based notifications are handled at the application logic level, targeting users by role and creating individual notifications per user).
10. Event Model:

Purpose: Manages school events and calendar.
Key Fields: title, description, start, end, type (enum: GENERAL, etc.), createdBy (ref to User), participants (ref to User), visibility, location, color, reminders
Relationships:
Many-to-one with User (Creator): createdBy: { ref: "User", required: true } - Tracks who created the event.
Many-to-many with User (Participants): participants: [{ ref: "User" }] - Events can have multiple participants from the User base.
11. Attendance Model:

Purpose: Tracks student attendance in classes.
Key Fields: student (ref to Student), class (ref to Class), date, status (enum: PRESENT, etc.), timeIn, timeOut
Relationships:
Many-to-one with Student: student: { ref: "Student", required: true } - Attendance is recorded for individual students.
Many-to-one with Class: class: { ref: "Class", required: true } - Attendance is recorded for specific classes.
One-to-many with Class (from Class to Attendance): A class can have multiple attendance records (for different dates and students).
12. Assignment Model:

Purpose: Manages assignments given to students.
Key Fields: title, description, subject (ref to Subject), class (ref to Class), assignedBy (ref to Teacher), dueDate, submissions (array of { student (ref to Student), fileUrl, submittedAt, grade, feedback }), status (enum: OPEN, CLOSED)
Relationships:
Many-to-one with Subject: subject: { ref: "Subject", required: true } - Assignments are for specific subjects.
Many-to-one with Class: class: { ref: "Class", required: true } - Assignments are given to specific classes.
Many-to-one with Teacher (Assigner): assignedBy: { ref: "Teacher", required: true } - Assignments are assigned by teachers.
One-to-many with Student (Submissions): submissions: [...] student: { ref: "Student" } - Stores submissions from multiple students for each assignment.
13. Activity Model:

Purpose: Logs user and system activities for auditing and monitoring.
Key Fields: user (ref to User), type (enum: LOGIN, etc.), description, metadata, severity (enum: INFO, etc.), ip, userAgent, expiredAT
Relationships:
Many-to-one with User: user: { ref: "User", index: true } - Activities are associated with users.
Summary of System Architecture (based on models):

Your School Management System is designed with a central User model that branches out to different roles (Teacher, Parent, Student). The Class and Subject models form the core academic structure, linking teachers and students.  Transaction and record-keeping models like Fee, Exam, Attendance, and Assignment manage key operational aspects.  Notification, Event, and Activity models provide communication, scheduling, and system monitoring features.