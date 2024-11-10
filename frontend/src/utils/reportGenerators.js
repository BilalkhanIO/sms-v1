import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Generate PDF attendance report
export const generateAttendancePDF = (reportData, reportType = 'student') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Attendance Report', 14, 15);
  
  // Add report info
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
  
  if (reportType === 'student') {
    // Student specific report
    doc.text(`Student: ${reportData.studentName}`, 14, 35);
    doc.text(`Class: ${reportData.className}`, 14, 42);
    doc.text(`Period: ${reportData.startDate} to ${reportData.endDate}`, 14, 49);
    
    // Add statistics
    doc.text(`Present: ${reportData.presentCount} days`, 14, 59);
    doc.text(`Absent: ${reportData.absentCount} days`, 14, 66);
    doc.text(`Late: ${reportData.lateCount} days`, 14, 73);
    doc.text(`Attendance Rate: ${reportData.attendanceRate}%`, 14, 80);
    
    // Add daily attendance table
    const tableData = reportData.dailyAttendance.map(record => [
      record.date,
      record.status,
      record.remarks || '',
    ]);
    
    doc.autoTable({
      startY: 90,
      head: [['Date', 'Status', 'Remarks']],
      body: tableData,
    });
  } else {
    // Class report
    doc.text(`Class: ${reportData.className}`, 14, 35);
    doc.text(`Period: ${reportData.startDate} to ${reportData.endDate}`, 14, 42);
    doc.text(`Total Students: ${reportData.totalStudents}`, 14, 49);
    doc.text(`Average Attendance Rate: ${reportData.averageAttendanceRate}%`, 14, 56);
    
    // Add attendance summary table
    const tableData = reportData.attendanceDistribution.map(record => [
      record.date,
      record.present,
      record.absent,
      record.late,
      `${((record.present / reportData.totalStudents) * 100).toFixed(1)}%`,
    ]);
    
    doc.autoTable({
      startY: 66,
      head: [['Date', 'Present', 'Absent', 'Late', 'Attendance Rate']],
      body: tableData,
    });
  }
  
  // Save the PDF
  doc.save(`attendance_report_${new Date().getTime()}.pdf`);
};

// Generate Excel attendance report
export const generateAttendanceExcel = (reportData, reportType = 'student') => {
  const wb = XLSX.utils.book_new();
  
  if (reportType === 'student') {
    // Create summary worksheet
    const summaryData = [
      ['Student Attendance Report'],
      [''],
      ['Student Name', reportData.studentName],
      ['Class', reportData.className],
      ['Period', `${reportData.startDate} to ${reportData.endDate}`],
      [''],
      ['Statistics'],
      ['Present Days', reportData.presentCount],
      ['Absent Days', reportData.absentCount],
      ['Late Days', reportData.lateCount],
      ['Attendance Rate', `${reportData.attendanceRate}%`],
    ];
    
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
    
    // Create daily attendance worksheet
    const attendanceData = [
      ['Date', 'Status', 'Remarks'],
      ...reportData.dailyAttendance.map(record => [
        record.date,
        record.status,
        record.remarks || '',
      ]),
    ];
    
    const attendanceWS = XLSX.utils.aoa_to_sheet(attendanceData);
    XLSX.utils.book_append_sheet(wb, attendanceWS, 'Daily Attendance');
  } else {
    // Create class summary worksheet
    const summaryData = [
      ['Class Attendance Report'],
      [''],
      ['Class', reportData.className],
      ['Period', `${reportData.startDate} to ${reportData.endDate}`],
      ['Total Students', reportData.totalStudents],
      ['Average Attendance Rate', `${reportData.averageAttendanceRate}%`],
    ];
    
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
    
    // Create attendance distribution worksheet
    const distributionData = [
      ['Date', 'Present', 'Absent', 'Late', 'Attendance Rate'],
      ...reportData.attendanceDistribution.map(record => [
        record.date,
        record.present,
        record.absent,
        record.late,
        `${((record.present / reportData.totalStudents) * 100).toFixed(1)}%`,
      ]),
    ];
    
    const distributionWS = XLSX.utils.aoa_to_sheet(distributionData);
    XLSX.utils.book_append_sheet(wb, distributionWS, 'Daily Distribution');
  }
  
  // Save the Excel file
  XLSX.writeFile(wb, `attendance_report_${new Date().getTime()}.xlsx`);
}; 