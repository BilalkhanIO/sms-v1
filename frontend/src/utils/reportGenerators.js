import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const generatePDF = (title, headers, data) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  doc.autoTable({
    head: [headers],
    body: data,
    startY: 30,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      overflow: 'linebreak'
    }
  });

  doc.save(`${title.toLowerCase().replace(/ /g, '_')}.pdf`);
};

export const generateExcel = (title, headers, data) => {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);
  XLSX.writeFile(workbook, `${title.toLowerCase().replace(/ /g, '_')}.xlsx`);
};

export const generateAttendancePDF = (reportData, reportType) => {
  const doc = new jsPDF();
  
  // Set up title based on report type
  const title = `Attendance Report - ${reportType}`;
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Configure headers based on report type
  let headers = ['Date', 'Status', 'Remarks'];
  if (reportType === 'class') {
    headers = ['Student Name', 'Present Count', 'Absent Count', 'Attendance Rate'];
  }
  
  // Format data for the table
  const formattedData = reportData.map(record => {
    if (reportType === 'class') {
      return [
        record.studentName,
        record.presentCount,
        record.absentCount,
        `${record.attendanceRate}%`
      ];
    }
    return [
      new Date(record.date).toLocaleDateString(),
      record.status,
      record.remarks || ''
    ];
  });

  // Generate table
  doc.autoTable({
    head: [headers],
    body: formattedData,
    startY: 30,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [63, 81, 181]
    }
  });

  doc.save(`attendance_report_${reportType.toLowerCase()}.pdf`);
};

export const generateAttendanceExcel = (reportData, reportType) => {
  // Configure headers based on report type
  let headers = ['Date', 'Status', 'Remarks'];
  if (reportType === 'class') {
    headers = ['Student Name', 'Present Count', 'Absent Count', 'Attendance Rate'];
  }
  
  // Format data for the worksheet
  const formattedData = reportData.map(record => {
    if (reportType === 'class') {
      return [
        record.studentName,
        record.presentCount,
        record.absentCount,
        `${record.attendanceRate}%`
      ];
    }
    return [
      new Date(record.date).toLocaleDateString(),
      record.status,
      record.remarks || ''
    ];
  });

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...formattedData]);
  
  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Attendance - ${reportType}`);
  
  // Save file
  XLSX.writeFile(workbook, `attendance_report_${reportType.toLowerCase()}.xlsx`);
}; 