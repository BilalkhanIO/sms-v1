import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DAYS_OF_WEEK } from '../constants/schedule';
import * as XLSX from 'xlsx';

export const exportScheduleToPDF = (schedule) => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(16);
  doc.text(`Class Schedule: ${schedule.className}`, 14, 15);
  doc.setFontSize(12);
  doc.text(`Academic Year: ${schedule.academicYear} - ${schedule.term}`, 14, 25);

  // Prepare data for table
  const tableData = DAYS_OF_WEEK.map(day => {
    const periods = schedule.periods
      .filter(p => p.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return [
      day,
      ...periods.map(p => `${p.startTime}-${p.endTime}\n${p.subject.name}\n${p.teacher.name}\nRoom: ${p.room}`)
    ];
  });

  // Add table
  doc.autoTable({
    startY: 35,
    head: [['Day', 'Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7']],
    body: tableData,
    theme: 'grid',
    styles: {
      cellPadding: 5,
      fontSize: 8,
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    columnStyles: {
      0: { cellWidth: 30 }
    }
  });

  // Add footer
  const date = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.text(`Generated on: ${date}`, 14, doc.internal.pageSize.height - 10);

  return doc;
};

export const exportScheduleToExcel = (schedule) => {
  // Prepare data for Excel
  const data = DAYS_OF_WEEK.map(day => {
    const periods = schedule.periods
      .filter(p => p.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return {
      Day: day,
      ...periods.reduce((acc, p, index) => ({
        ...acc,
        [`Period ${index + 1}`]: `${p.startTime}-${p.endTime}\n${p.subject.name}\n${p.teacher.name}\nRoom: ${p.room}`
      }), {})
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Schedule');

  return wb;
};

export const printSchedule = (schedule) => {
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Class Schedule - ${schedule.className}</title>
        <style>
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; }
          .period { margin-bottom: 5px; }
          .subject { font-weight: bold; }
          .teacher { color: #4b5563; }
          .room { color: #6b7280; font-size: 0.9em; }
          @media print {
            .no-print { display: none; }
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>Class Schedule: ${schedule.className}</h1>
        <h2>Academic Year: ${schedule.academicYear} - ${schedule.term}</h2>
        
        <table>
          <thead>
            <tr>
              <th>Time</th>
              ${DAYS_OF_WEEK.map(day => `<th>${day}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${generateScheduleTableRows(schedule)}
          </tbody>
        </table>
        
        <div class="no-print">
          <button onclick="window.print()">Print Schedule</button>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};

const generateScheduleTableRows = (schedule) => {
  const timeSlots = [...new Set(schedule.periods.map(p => p.startTime))].sort();
  
  return timeSlots.map(time => {
    const row = DAYS_OF_WEEK.map(day => {
      const period = schedule.periods.find(p => p.day === day && p.startTime === time);
      return period ? `
        <td>
          <div class="period">
            <div class="subject">${period.subject.name}</div>
            <div class="teacher">${period.teacher.name}</div>
            <div class="room">Room: ${period.room}</div>
          </div>
        </td>
      ` : '<td></td>';
    }).join('');

    return `
      <tr>
        <td>${time}</td>
        ${row}
      </tr>
    `;
  }).join('');
};
