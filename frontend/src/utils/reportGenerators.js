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