import * as XLSX from 'xlsx';
import { TOPPINGS, SIZE_OPTIONS, SERVING_OPTIONS } from '../data/flavors';

export function exportOrdersToExcel(orders) {
  if (!orders || orders.length === 0) {
    alert('Belum ada pesanan untuk diekspor!');
    return false;
  }

  // 1. Prepare Orders Sheet data
  const ordersData = orders.map((order, index) => {
    const sizeObj = SIZE_OPTIONS.find(s => s.id === order.size);
    const servingObj = SERVING_OPTIONS.find(s => s.id === order.serving);
    const toppingsFormatted = (order.toppings || [])
      .map(tid => {
        const t = TOPPINGS.find(item => item.id === tid);
        return t ? t.name : tid;
      })
      .join(', ') || '-';

    const statusLabel =
      order.status === 'selesai'
        ? 'Selesai'
        : order.status === 'diproses'
        ? 'Diproses'
        : 'Menunggu';

    const dateFormatted = order.timestamp
      ? new Date(order.timestamp).toLocaleString('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-';

    return {
      'No': index + 1,
      'Waktu Pesanan': dateFormatted,
      'No Antrean': order.orderId,
      'Nama Pelanggan': order.customerName || '-',
      'Varian Rasa': order.flavor?.name || '-',
      'Wadah': servingObj?.name || order.serving,
      'Ukuran': sizeObj?.name || order.size,
      'Topping': toppingsFormatted,
      'Catatan': order.notes || '-',
      'Status': statusLabel,
      'Total Harga (Rp)': order.totalPrice || 0,
    };
  });

  // Calculate totals
  const totalOmzet = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalCompleted = orders.filter(o => o.status === 'selesai').length;

  // Add Summary row to sheet 1
  ordersData.push({
    'No': '',
    'Waktu Pesanan': '',
    'No Antrean': '',
    'Nama Pelanggan': '',
    'Varian Rasa': '',
    'Wadah': '',
    'Ukuran': '',
    'Topping': '',
    'Catatan': '',
    'Status': 'TOTAL OMZET',
    'Total Harga (Rp)': totalOmzet,
  });

  // 2. Prepare Statistics & Summary Sheet data
  // Flavor breakdown
  const flavorCounts = {};
  orders.forEach(o => {
    const fName = o.flavor?.name || 'Lainnya';
    flavorCounts[fName] = (flavorCounts[fName] || 0) + 1;
  });

  const summaryData = [
    { 'Parameter': 'Tanggal Export', 'Nilai': new Date().toLocaleDateString('id-ID') },
    { 'Parameter': 'Total Pesanan', 'Nilai': orders.length },
    { 'Parameter': 'Pesanan Selesai', 'Nilai': totalCompleted },
    { 'Parameter': 'Pesanan Dalam Proses', 'Nilai': orders.filter(o => o.status === 'diproses').length },
    { 'Parameter': 'Pesanan Menunggu', 'Nilai': orders.filter(o => o.status === 'pending').length },
    { 'Parameter': 'Total Omzet (Rp)', 'Nilai': totalOmzet },
    { 'Parameter': 'Rata-rata Transaksi (Rp)', 'Nilai': orders.length ? Math.round(totalOmzet / orders.length) : 0 },
    { 'Parameter': '', 'Nilai': '' },
    { 'Parameter': '--- POPULARITAS RASA ---', 'Nilai': '--- JUMLAH DIPESAN ---' },
    ...Object.entries(flavorCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        'Parameter': name,
        'Nilai': `${count} pesanan`,
      })),
  ];

  // 3. Create Workbook & Sheets
  const wb = XLSX.utils.book_new();

  const wsOrders = XLSX.utils.json_to_sheet(ordersData);
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);

  // Set column widths for wsOrders
  wsOrders['!cols'] = [
    { wch: 5 },  // No
    { wch: 18 }, // Waktu
    { wch: 14 }, // No Antrean
    { wch: 18 }, // Nama
    { wch: 22 }, // Rasa
    { wch: 10 }, // Wadah
    { wch: 15 }, // Ukuran
    { wch: 25 }, // Topping
    { wch: 25 }, // Catatan
    { wch: 14 }, // Status
    { wch: 16 }, // Total Harga
  ];

  // Set column widths for wsSummary
  wsSummary['!cols'] = [
    { wch: 28 },
    { wch: 24 },
  ];

  XLSX.utils.book_append_sheet(wb, wsOrders, 'Daftar Pesanan');
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan & Statistik');

  // 4. Download file
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `Laporan_Penjualan_ScoopMatch_${dateStr}.xlsx`;
  XLSX.writeFile(wb, filename);

  return true;
}
