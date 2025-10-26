import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '@/components/ExpenseTable';

export const generatePDF = (
  transactions: Transaction[],
  month: string,
  totalExpenses: number,
  averageExpense: number
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(22, 163, 74); // Primary green
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FinanceTrack Pro', 14, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Monthly Financial Statement', 14, 30);
  
  // Month and Date
  const monthDate = new Date(month + '-01');
  const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Statement for ${monthName}`, 14, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })}`, 14, 62);
  
  // Summary Section
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(14, 70, 182, 35, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 20, 80);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  doc.text(`Total Expenses:`, 20, 90);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(totalExpenses), 70, 90);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Average Expense:`, 20, 97);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(averageExpense), 70, 97);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Transactions:`, 120, 90);
  doc.setFont('helvetica', 'bold');
  doc.text(transactions.length.toString(), 175, 90);
  
  // Transactions Table
  const tableData = transactions.map(t => [
    new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    t.description,
    t.category,
    t.group,
    formatCurrency(t.amount),
  ]);
  
  autoTable(doc, {
    startY: 115,
    head: [['Date', 'Description', 'Category', 'Group', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 50 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30, halign: 'right' },
    },
    foot: [[
      { content: 'TOTAL', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: formatCurrency(totalExpenses), styles: { halign: 'right', fontStyle: 'bold', fillColor: [240, 240, 240] } }
    ]],
    footStyles: {
      fillColor: [250, 250, 250],
      textColor: [0, 0, 0],
      fontSize: 10,
    },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      'FinanceTrack Pro - Professional Financial Management',
      14,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Save the PDF
  doc.save(`FinanceTrack_Statement_${monthName.replace(' ', '_')}.pdf`);
};
