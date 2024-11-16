import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { GRADE_SCALE } from '../../constants/student';

export const generateStudentReport = (student, performanceData) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Student Academic Report', 105, 15, { align: 'center' });
  
  // Add student information
  doc.setFontSize(12);
  doc.text(`Name: ${student.firstName} ${student.lastName}`, 15, 30);
  doc.text(`Roll Number: ${student.rollNumber}`, 15, 40);
  doc.text(`Class: ${student.class} - ${student.section}`, 15, 50);
  doc.text(`Academic Year: ${performanceData.academicYear}`, 15, 60);

  // Add performance summary
  doc.setFontSize(16);
  doc.text('Performance Summary', 15, 80);
  
  const performanceTable = [
    ['Subject', 'Marks Obtained', 'Total Marks', 'Grade', 'Remarks'],
    ...performanceData.subjects.map(subject => [
      subject.name,
      subject.marksObtained,
      subject.totalMarks,
      subject.grade,
      subject.remarks
    ])
  ];

  doc.autoTable({
    startY: 90,
    head: [performanceTable[0]],
    body: performanceTable.slice(1),
    theme: 'grid'
  });

  // Add attendance summary
  doc.setFontSize(16);
  doc.text('Attendance Summary', 15, doc.lastAutoTable.finalY + 20);

  const attendanceTable = [
    ['Total Days', 'Present', 'Absent', 'Late', 'Attendance %'],
    [
      performanceData.attendance.totalDays,
      performanceData.attendance.present,
      performanceData.attendance.absent,
      performanceData.attendance.late,
      `${performanceData.attendance.percentage}%`
    ]
  ];

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 30,
    head: [attendanceTable[0]],
    body: attendanceTable.slice(1),
    theme: 'grid'
  });

  // Add remarks
  doc.setFontSize(12);
  doc.text('Teacher\'s Remarks:', 15, doc.lastAutoTable.finalY + 20);
  doc.text(performanceData.remarks || 'No remarks available', 15, doc.lastAutoTable.finalY + 30);

  // Add signature fields
  doc.text('Class Teacher: _________________', 15, doc.lastAutoTable.finalY + 50);
  doc.text('Principal: _________________', 120, doc.lastAutoTable.finalY + 50);

  // Add footer
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy')}`, 15, 280);

  return doc;
};

export const generateStudentIDCard = (student, schoolInfo) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 54] // Standard ID card size
  });

  // Add school logo
  if (schoolInfo.logo) {
    doc.addImage(schoolInfo.logo, 'PNG', 5, 5, 15, 15);
  }

  // Add school name
  doc.setFontSize(12);
  doc.text(schoolInfo.name, 25, 12);

  // Add student photo
  if (student.photo) {
    doc.addImage(student.photo, 'PNG', 5, 20, 20, 25);
  }

  // Add student details
  doc.setFontSize(10);
  doc.text(`Name: ${student.firstName} ${student.lastName}`, 30, 25);
  doc.text(`Class: ${student.class} - ${student.section}`, 30, 30);
  doc.text(`Roll No: ${student.rollNumber}`, 30, 35);
  doc.text(`Blood Group: ${student.bloodGroup}`, 30, 40);

  // Add barcode or QR code
  if (student.qrCode) {
    doc.addImage(student.qrCode, 'PNG', 60, 30, 20, 20);
  }

  // Add validity
  doc.setFontSize(8);
  doc.text('Valid till: 31/03/2024', 30, 45);

  return doc;
};

export const generateAttendanceReport = (student, attendanceData) => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.text('Student Attendance Report', 105, 15, { align: 'center' });

  // Add student information
  doc.setFontSize(12);
  doc.text(`Name: ${student.firstName} ${student.lastName}`, 15, 30);
  doc.text(`Class: ${student.class} - ${student.section}`, 15, 40);
  doc.text(`Period: ${format(new Date(attendanceData.startDate), 'dd/MM/yyyy')} - ${format(new Date(attendanceData.endDate), 'dd/MM/yyyy')}`, 15, 50);

  // Add attendance summary
  const summaryTable = [
    ['Total Days', 'Present', 'Absent', 'Late', 'Attendance %'],
    [
      attendanceData.totalDays,
      attendanceData.presentDays,
      attendanceData.absentDays,
      attendanceData.lateDays,
      `${attendanceData.attendancePercentage}%`
    ]
  ];

  doc.autoTable({
    startY: 60,
    head: [summaryTable[0]],
    body: summaryTable.slice(1),
    theme: 'grid'
  });

  // Add detailed attendance
  const detailedTable = [
    ['Date', 'Status', 'Time In', 'Time Out', 'Remarks'],
    ...attendanceData.details.map(record => [
      format(new Date(record.date), 'dd/MM/yyyy'),
      record.status,
      record.timeIn,
      record.timeOut,
      record.remarks
    ])
  ];

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [detailedTable[0]],
    body: detailedTable.slice(1),
    theme: 'grid'
  });

  return doc;
};
