import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProductionData } from '../types';
import { 
  calculateEfficiency, 
  calculateDefectRate,
  calculateProductivity,
  calculateOutputPerWorker 
} from './calculationHelpers';

// CSVファイルとしてデータをエクスポート
export const exportToCSV = (data: ProductionData[]): void => {
  if (data.length === 0) return;

  // CSVヘッダー
  const headers = [
    '日付',
    '製品名',
    '計画数量',
    '実績数量',
    '不良数',
    '作業時間',
    '作業者数',
    '効率(%)',
    '不良率(%)',
    '生産性',
    '作業者あたり生産量',
    'メモ'
  ];

  // データ行の作成
  const rows = data.map(item => [
    item.date,
    item.productName,
    item.plannedQuantity,
    item.actualQuantity,
    item.defectCount,
    item.workHours,
    item.workers,
    calculateEfficiency(item).toFixed(2),
    calculateDefectRate(item).toFixed(2),
    calculateProductivity(item).toFixed(2),
    calculateOutputPerWorker(item).toFixed(2),
    item.notes
  ]);

  // CSVコンテンツの作成
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // CSVファイルのダウンロード
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `生産データ_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// PDFレポートとしてデータをエクスポート
export const exportToPDF = (data: ProductionData[]): void => {
  if (data.length === 0) return;

  const doc = new jsPDF();
  
  // タイトルの追加
  doc.setFontSize(18);
  doc.text('生産データレポート', 14, 22);
  
  // 日付範囲の追加
  doc.setFontSize(12);
  const dates = data.map(item => new Date(item.date));
  const minDate = new Date(Math.min(...dates.map(d => d.getTime()))).toLocaleDateString('ja-JP');
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime()))).toLocaleDateString('ja-JP');
  doc.text(`期間: ${minDate} 〜 ${maxDate}`, 14, 30);
  
  // テーブルデータの作成
  const tableData = data.map(item => [
    new Date(item.date).toLocaleDateString('ja-JP'),
    item.productName,
    item.plannedQuantity.toString(),
    item.actualQuantity.toString(),
    item.defectCount.toString(),
    item.workHours.toString(),
    item.workers.toString(),
    `${calculateEfficiency(item).toFixed(2)}%`,
    `${calculateDefectRate(item).toFixed(2)}%`,
    calculateProductivity(item).toFixed(2),
    calculateOutputPerWorker(item).toFixed(2),
    item.notes
  ]);
  
  // テーブルの追加
  autoTable(doc, {
    head: [['日付', '製品名', '計画', '実績', '不良', '時間', '人数', '効率', '不良率', '生産性', '人当生産', 'メモ']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8, cellPadding: 1 },
    headStyles: { fillColor: [66, 139, 202] }
  });
  
  // PDFの保存
  doc.save(`生産データレポート_${new Date().toISOString().split('T')[0]}.pdf`);
};