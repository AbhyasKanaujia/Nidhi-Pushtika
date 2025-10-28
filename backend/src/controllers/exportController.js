const Transaction = require('../models/Transaction');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const reportController = require('./reportController');

const allColumns = {
  date: { header: 'Date', width: 15 },
  income: { header: 'Income', width: 15 },
  expense: { header: 'Expense', width: 15 },
  note: { header: 'Note', width: 30 },
  createdByName: { header: 'CreatedByName', width: 20 },
  updatedByName: { header: 'UpdatedByName', width: 20 },
  deleted: { header: 'Deleted', width: 10 }
};

const buildQuery = (user, from, to, includeDeleted) => {
  const query = {};

  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  if (user.role === 'admin') {
    if (includeDeleted !== 'true') {
      query.deleted = false;
    }
  } else if (user.role === 'editor' || user.role === 'reader') {
    query.deleted = false;
  }

  return query;
};

const buildWorksheetColumns = (user, includeDeleted, columns) => {
  let selectedKeys = [];
  if (columns) {
    selectedKeys = columns.split(',').map(c => c.trim()).filter(c => c in allColumns);
  } else {
    selectedKeys = Object.keys(allColumns);
  }

  if (!(user.role === 'admin' && includeDeleted === 'true')) {
    selectedKeys = selectedKeys.filter(key => key !== 'deleted');
  }

  return selectedKeys.map(key => ({
    header: allColumns[key].header,
    key,
    width: allColumns[key].width
  }));
};

const addRowsToWorksheet = (worksheet, transactions, selectedKeys) => {
  transactions.forEach(txn => {
    const row = {};
    selectedKeys.forEach(key => {
      switch (key) {
        case 'date':
          row.date = txn.date ? txn.date.toISOString().split('T')[0] : '';
          break;
        case 'income':
          row.income = txn.type === 'income' ? txn.amount : '';
          break;
        case 'expense':
          row.expense = txn.type === 'expense' ? txn.amount : '';
          break;
        case 'note':
          row.note = txn.note || '';
          break;
        case 'createdByName':
          row.createdByName = txn.createdBy ? txn.createdBy.name : '';
          break;
        case 'updatedByName':
          row.updatedByName = txn.updatedBy ? txn.updatedBy.name : '';
          break;
        case 'deleted':
          row.deleted = txn.deleted ? 'Yes' : 'No';
          break;
        default:
          row[key] = '';
      }
    });
    worksheet.addRow(row);
  });
};

// GET /export/excel
// Returns an Excel file download of transactions filtered by date range and includeDeleted flag
// Supports optional columns selection and optional summary worksheet
const generateFileName = (from, to, includeDeleted) => {
  const parts = ['transactions'];

  if (from) {
    parts.push(`from_${from}`);
  }
  if (to) {
    parts.push(`to_${to}`);
  }
  if (includeDeleted === 'true') {
    parts.push('with_deleted');
  }

  if (parts.length === 1) {
    // No params provided, add timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    parts.push(`export_${timestamp}`);
  }

  return parts.join('_') + '.xlsx';
};

const exportExcel = async (req, res) => {
  try {
    const user = req.user;
    const { from, to, includeDeleted, columns, includeSummarySheet, fileName } = req.query || {};

    const query = buildQuery(user, from, to, includeDeleted);

    const transactions = await Transaction.find(query)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .sort({ date: -1 })
      .lean();

    const worksheetColumns = buildWorksheetColumns(user, includeDeleted, columns);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    worksheet.columns = worksheetColumns;

    addRowsToWorksheet(worksheet, transactions, worksheetColumns.map(c => c.key));

    if (includeSummarySheet === 'true') {
      const summarySheet = workbook.addWorksheet('Summary');

      const { totalIncome, totalExpense, balance } = await getSummaryData(from, to);

      summarySheet.columns = [
        { header: 'Metric', key: 'metric', width: 20 },
        { header: 'Value', key: 'value', width: 20 }
      ];

      summarySheet.addRow({ metric: 'Total Income', value: totalIncome });
      summarySheet.addRow({ metric: 'Total Expense', value: totalExpense });
      summarySheet.addRow({ metric: 'Balance', value: balance });
    }

    const safeFileName = fileName && typeof fileName === 'string' && fileName.trim() !== ''
      ? fileName.trim()
      : generateFileName(from, to, includeDeleted);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${safeFileName}"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting Excel:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to get summary data for export
// Calls reportController.getSummaryReport internally and returns data
const getSummaryData = async (from, to) => {
  const req = { query: { from, to } };
  const res = {
    jsonData: null,
    json(data) {
      this.jsonData = data;
    }
  };
  await reportController.getSummaryReport(req, res);
  return res.jsonData || { totalIncome: 0, totalExpense: 0, balance: 0 };
};

// GET /export/pdf
// Returns a PDF file download of transactions filtered by date range and includeDeleted flag
// Supports mode=summary|full
const exportPdf = async (req, res) => {
  try {
    const user = req.user;
    const { from, to, includeDeleted, mode } = req.query || {};

    const query = buildQuery(user, from, to, includeDeleted);

    // Fetch transactions only if mode is full
    let transactions = [];
    if (mode === 'full') {
      transactions = await Transaction.find(query)
        .populate('createdBy', 'name')
        .populate('updatedBy', 'name')
        .sort({ date: -1 })
        .lean();
    }

    // Fetch summary data
    const { totalIncome, totalExpense, balance } = await getSummaryData(from, to);

    // Create PDF document
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    // Set response headers
    const fileName = `transactions_${mode || 'summary'}_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add title and date range
    doc.fontSize(18).text('Transaction Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Period: ${from || 'Start'} to ${to || 'End'}`, { align: 'center' });
    doc.moveDown();

    // Add summary section
    doc.fontSize(14).text('Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Total Income: ${totalIncome.toFixed(2)}`);
    doc.text(`Total Expense: ${totalExpense.toFixed(2)}`);
    doc.text(`Balance: ${balance.toFixed(2)}`);
    doc.moveDown();

    if (mode === 'full') {
      // Add transactions table header
      doc.fontSize(14).text('Transactions', { underline: true });
      doc.moveDown(0.5);

      // Table column headers
      const tableHeaders = ['Date', 'Type', 'Amount', 'Note', 'Created By', 'Updated By', 'Deleted'];
      const columnWidths = [70, 50, 70, 150, 100, 100, 50];
      let x = doc.x;
      let y = doc.y;

      // Draw headers
      tableHeaders.forEach((header, i) => {
        doc.font('Helvetica-Bold').text(header, x, y, { width: columnWidths[i], continued: i !== tableHeaders.length - 1 });
        x += columnWidths[i];
      });
      doc.moveDown();

      // Draw rows
      transactions.forEach(txn => {
        x = doc.x;
        y = doc.y;
        doc.font('Helvetica').text(txn.date ? new Date(txn.date).toISOString().split('T')[0] : '', x, y, { width: columnWidths[0], continued: true });
        x += columnWidths[0];
        doc.text(txn.type || '', x, y, { width: columnWidths[1], continued: true });
        x += columnWidths[1];
        doc.text(txn.amount != null ? txn.amount.toFixed(2) : '', x, y, { width: columnWidths[2], continued: true });
        x += columnWidths[2];
        doc.text(txn.note || '', x, y, { width: columnWidths[3], continued: true });
        x += columnWidths[3];
        doc.text(txn.createdBy ? txn.createdBy.name : '', x, y, { width: columnWidths[4], continued: true });
        x += columnWidths[4];
        doc.text(txn.updatedBy ? txn.updatedBy.name : '', x, y, { width: columnWidths[5], continued: true });
        x += columnWidths[5];
        doc.text(txn.deleted ? 'Yes' : 'No', x, y, { width: columnWidths[6] });
        doc.moveDown();
      });
    }

    doc.end();
  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  exportExcel,
  getSummaryData,
  exportPdf
};
