import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

// Generate ID Card as PDF
export const generateIDCard = async (element, student, schoolInfo) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54], // Standard ID card size
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ID_Card_${student.rollNumber}_${format(new Date(), 'yyyyMMdd')}.pdf`);

    return true;
  } catch (error) {
    console.error('Error generating ID card:', error);
    throw error;
  }
};

// Generate Transfer Certificate
export const generateTransferCertificate = async (student, schoolInfo, certificateData) => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Add school header
    pdf.addImage(schoolInfo.logo, 'PNG', 15, yPosition, 30, 30);
    pdf.setFontSize(20);
    pdf.text(schoolInfo.name, pageWidth / 2, yPosition + 15, { align: 'center' });
    
    yPosition += 40;

    // Add certificate title
    pdf.setFontSize(16);
    pdf.text('TRANSFER CERTIFICATE', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // Add certificate content
    pdf.setFontSize(12);
    const content = [
      `Certificate No: ${certificateData.certificateNumber}`,
      `Date: ${format(new Date(), 'dd/MM/yyyy')}`,
      '',
      'This is to certify that:',
      '',
      `Name: ${student.firstName} ${student.lastName}`,
      `Roll Number: ${student.rollNumber}`,
      `Class: ${student.class}`,
      `Section: ${student.section}`,
      `Date of Birth: ${format(new Date(student.dateOfBirth), 'dd/MM/yyyy')}`,
      `Father's Name: ${student.parentInfo.fatherName}`,
      `Mother's Name: ${student.parentInfo.motherName}`,
      '',
      `was a student of ${schoolInfo.name} from ${format(new Date(student.admissionDate), 'dd/MM/yyyy')} ` +
      `to ${format(new Date(certificateData.lastAttendanceDate), 'dd/MM/yyyy')}.`,
      '',
      'During this period, his/her conduct and character were found to be GOOD.',
      '',
      `Reason for leaving: ${certificateData.reasonForLeaving}`,
      '',
      'We wish him/her all the best for future endeavors.',
    ];

    content.forEach(line => {
      pdf.text(line, 20, yPosition);
      yPosition += 10;
    });

    // Add signatures
    yPosition += 20;
    pdf.text('Class Teacher', 40, yPosition, { align: 'center' });
    pdf.text('Principal', pageWidth - 40, yPosition, { align: 'center' });

    pdf.save(`Transfer_Certificate_${student.rollNumber}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating transfer certificate:', error);
    throw error;
  }
};

// Generate Report Card
export const generateReportCard = async (student, academicData, schoolInfo) => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Add school header
    pdf.addImage(schoolInfo.logo, 'PNG', 15, yPosition, 30, 30);
    pdf.setFontSize(20);
    pdf.text(schoolInfo.name, pageWidth / 2, yPosition + 15, { align: 'center' });
    
    yPosition += 40;

    // Add report card title
    pdf.setFontSize(16);
    pdf.text('ACADEMIC REPORT CARD', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // Add student information
    pdf.setFontSize(12);
    const studentInfo = [
      `Name: ${student.firstName} ${student.lastName}`,
      `Roll Number: ${student.rollNumber}`,
      `Class: ${student.class}`,
      `Section: ${student.section}`,
      `Academic Year: ${academicData.academicYear}`,
      `Term: ${academicData.term}`,
    ];

    studentInfo.forEach(line => {
      pdf.text(line, 20, yPosition);
      yPosition += 10;
    });

    yPosition += 10;

    // Add grades table
    const headers = ['Subject', 'Marks Obtained', 'Maximum Marks', 'Grade', 'Remarks'];
    const columnWidths = [50, 30, 30, 20, 50];
    
    // Draw table headers
    let xPosition = 20;
    headers.forEach((header, index) => {
      pdf.setFillColor(240, 240, 240);
      pdf.rect(xPosition, yPosition - 5, columnWidths[index], 10, 'F');
      pdf.text(header, xPosition + 2, yPosition);
      xPosition += columnWidths[index];
    });

    yPosition += 10;

    // Draw grades
    academicData.grades.forEach(grade => {
      xPosition = 20;
      Object.values(grade).forEach((value, index) => {
        pdf.text(String(value), xPosition + 2, yPosition);
        xPosition += columnWidths[index];
      });
      yPosition += 10;
    });

    // Add summary
    yPosition += 20;
    const summary = [
      `Total Marks: ${academicData.totalMarks}`,
      `Percentage: ${academicData.percentage}%`,
      `Overall Grade: ${academicData.overallGrade}`,
      `Class Rank: ${academicData.rank}`,
      `Attendance: ${academicData.attendance}%`,
    ];

    summary.forEach(line => {
      pdf.text(line, 20, yPosition);
      yPosition += 10;
    });

    pdf.save(`Report_Card_${student.rollNumber}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating report card:', error);
    throw error;
  }
};