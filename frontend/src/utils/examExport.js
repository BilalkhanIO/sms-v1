import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { GRADE_SCALE } from '../constants/exam';

export const exportResultsToPDF = (examData) => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(16);
  doc.text(`${examData.title} - Results`, 14, 15);
  doc.setFontSize(12);
  doc.text(`Class: ${examData.className}`, 14, 25);
  doc.text(`Date: ${new Date(examData.endDate).toLocaleDateString()}`, 14, 35);

  // Add results table
  const tableData = examData.results.map(result => [
    result.studentName,
    ...result.subjects.map(s => s.obtainedMarks),
    result.obtainedMarks,
    result.percentage.toFixed(2) + '%',
    result.grade
  ]);

  const headers = [
    'Student Name',
    ...examData.subjects.map(s => s.subjectName),
    'Total',
    'Percentage',
    'Grade'
  ];

  doc.autoTable({
    startY: 45,
    head: [headers],
    body: tableData,
    theme: 'grid',
    styles: {
      cellPadding: 5,
      fontSize: 10,
      valign: 'middle',
      halign: 'center'
    },
    headStyles: {
      fillColor: [66, 66, 66]
    }
  });

  // Add summary
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total Students: ${examData.results.length}`, 14, finalY);
  doc.text(`Pass Rate: ${((examData.results.filter(r => r.grade !== 'F').length / 
    examData.results.length) * 100).toFixed(2)}%`, 14, finalY + 10);

  return doc;
};

export const exportResultsToExcel = (examData) => {
  // Prepare data for Excel
  const data = examData.results.map(result => ({
    'Student Name': result.studentName,
    ...result.subjects.reduce((acc, s) => ({
      ...acc,
      [examData.subjects.find(sub => sub.id === s.subjectId).subjectName]: s.obtainedMarks
    }), {}),
    'Total Marks': result.obtainedMarks,
    'Percentage': result.percentage.toFixed(2) + '%',
    'Grade': result.grade
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');

  // Add some styling
  const colWidths = Object.keys(data[0]).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key]).length))
  }));
  ws['!cols'] = colWidths;

  return wb;
};

export const generateResultCard = (studentResult, examData) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text('Result Card', 105, 15, { align: 'center' });
  
  // Student Info
  doc.setFontSize(12);
  doc.text(`Name: ${studentResult.studentName}`, 20, 30);
  doc.text(`Class: ${examData.className}`, 20, 40);
  doc.text(`Exam: ${examData.title}`, 20, 50);

  // Subject Results
  const subjectData = studentResult.subjects.map(subject => {
    const subjectInfo = examData.subjects.find(s => s.id === subject.subjectId);
    return [
      subjectInfo.subjectName,
      subject.obtainedMarks,
      subjectInfo.marks,
      ((subject.obtainedMarks / subjectInfo.marks) * 100).toFixed(2) + '%',
      calculateGrade(subject.obtainedMarks, subjectInfo.marks)
    ];
  });

  doc.autoTable({
    startY: 60,
    head: [['Subject', 'Marks Obtained', 'Total Marks', 'Percentage', 'Grade']],
    body: subjectData,
    theme: 'grid'
  });

  // Summary
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total Marks: ${studentResult.obtainedMarks}/${examData.totalMarks}`, 20, finalY);
  doc.text(`Percentage: ${studentResult.percentage.toFixed(2)}%`, 20, finalY + 10);
  doc.text(`Grade: ${studentResult.grade}`, 20, finalY + 20);

  return doc;
};

const calculateGrade = (obtained, total) => {
  const percentage = (obtained / total) * 100;
  for (const [grade, range] of Object.entries(GRADE_SCALE)) {
    if (percentage >= range.min && percentage <= range.max) {
      return grade;
    }
  }
  return 'F';
};
