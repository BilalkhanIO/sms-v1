import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const generateClassReport = (classData, type = 'general') => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Class Report', 105, 15, { align: 'center' });
  
  // Add class information
  doc.setFontSize(12);
  doc.text(`Class: ${classData.name} - ${classData.section}`, 15, 30);
  doc.text(`Grade: ${classData.grade}`, 15, 40);
  doc.text(`Academic Year: ${classData.academicYear}`, 15, 50);
  doc.text(`Class Teacher: ${classData.teacher.name}`, 15, 60);

  switch (type) {
    case 'attendance':
      generateAttendanceReport(doc, classData);
      break;
    case 'performance':
      generatePerformanceReport(doc, classData);
      break;
    case 'schedule':
      generateScheduleReport(doc, classData);
      break;
    default:
      generateGeneralReport(doc, classData);
  }

  return doc;
};

const generateAttendanceReport = (doc, classData) => {
  doc.setFontSize(16);
  doc.text('Attendance Report', 15, 80);

  const attendanceData = [
    ['Student Name', 'Present', 'Absent', 'Late', 'Attendance %'],
    ...classData.students.map(student => [
      `${student.firstName} ${student.lastName}`,
      student.attendance.present,
      student.attendance.absent,
      student.attendance.late,
      `${((student.attendance.present / (student.attendance.present + student.attendance.absent + student.attendance.late)) * 100).toFixed(1)}%`
    ])
  ];

  doc.autoTable({
    startY: 90,
    head: [attendanceData[0]],
    body: attendanceData.slice(1),
    theme: 'grid'
  });
};

const generatePerformanceReport = (doc, classData) => {
  doc.setFontSize(16);
  doc.text('Performance Report', 15, 80);

  // Subject-wise Performance
  const subjectData = [
    ['Subject', 'Average Score', 'Highest Score', 'Lowest Score', 'Pass Rate'],
    ...classData.subjects.map(subject => [
      subject.name,
      subject.averageScore.toFixed(1),
      subject.highestScore,
      subject.lowestScore,
      `${subject.passRate}%`
    ])
  ];

  doc.autoTable({
    startY: 90,
    head: [subjectData[0]],
    body: subjectData.slice(1),
    theme: 'grid'
  });

  // Student Performance
  doc.setFontSize(16);
  doc.text('Student Performance', 15, doc.lastAutoTable.finalY + 20);

  const studentData = [
    ['Student Name', 'Overall Grade', 'Average Score', 'Rank'],
    ...classData.students.map(student => [
      `${student.firstName} ${student.lastName}`,
      student.overallGrade,
      student.averageScore.toFixed(1),
      student.rank
    ])
  ];

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 30,
    head: [studentData[0]],
    body: studentData.slice(1),
    theme: 'grid'
  });
};

const generateScheduleReport = (doc, classData) => {
  doc.setFontSize(16);
  doc.text('Class Schedule', 15, 80);

  const scheduleData = [
    ['Day', 'Time', 'Subject', 'Teacher', 'Room'],
    ...classData.schedule.map(period => [
      period.day,
      `${period.startTime} - ${period.endTime}`,
      period.subject,
      period.teacher,
      period.room
    ])
  ];

  doc.autoTable({
    startY: 90,
    head: [scheduleData[0]],
    body: scheduleData.slice(1),
    theme: 'grid'
  });
};

const generateGeneralReport = (doc, classData) => {
  // Class Statistics
  doc.setFontSize(16);
  doc.text('Class Statistics', 15, 80);

  const statsData = [
    ['Total Students', classData.currentStrength],
    ['Class Capacity', classData.capacity],
    ['Number of Subjects', classData.subjects.length],
    ['Average Attendance', `${classData.averageAttendance}%`],
    ['Class Average', `${classData.classAverage}%`],
    ['Pass Rate', `${classData.passRate}%`]
  ];

  doc.autoTable({
    startY: 90,
    body: statsData,
    theme: 'plain'
  });

  // Subject List
  doc.setFontSize(16);
  doc.text('Subjects', 15, doc.lastAutoTable.finalY + 20);

  const subjectData = [
    ['Subject', 'Teacher', 'Weekly Hours'],
    ...classData.subjects.map(subject => [
      subject.name,
      subject.teacher.name,
      subject.weeklyHours
    ])
  ];

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 30,
    head: [subjectData[0]],
    body: subjectData.slice(1),
    theme: 'grid'
  });

  // Add footer
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy')}`, 15, 280);
};

export const generateClassTimeTable = (classData) => {
  const doc = new jsPDF('landscape');
  
  // Add header
  doc.setFontSize(20);
  doc.text('Class Time Table', 148, 15, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${classData.name} - ${classData.section}`, 148, 25, { align: 'center' });

  const timeTable = [
    ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    ...classData.schedule.reduce((acc, period) => {
      const timeSlot = `${period.startTime} - ${period.endTime}`;
      const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].indexOf(period.day);
      
      let row = acc.find(r => r[0] === timeSlot);
      if (!row) {
        row = [timeSlot, '', '', '', '', ''];
        acc.push(row);
      }
      
      row[dayIndex + 1] = `${period.subject}\n(${period.room})`;
      return acc;
    }, []).sort((a, b) => a[0].localeCompare(b[0]))
  ];

  doc.autoTable({
    startY: 35,
    head: [timeTable[0]],
    body: timeTable.slice(1),
    theme: 'grid',
    styles: {
      cellPadding: 5,
      fontSize: 10,
      valign: 'middle',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 30 }
    }
  });

  return doc;
};
