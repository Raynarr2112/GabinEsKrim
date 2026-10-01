/**
 * =====================================================================
 * ScoopMatch: Google Sheets Real-time Sync Script (Google Apps Script)
 * =====================================================================
 * 
 * CARA MENGGUNAKAN:
 * 1. Buka Google Sheets baru di browser (misal beri judul "Laporan Booth ScoopMatch").
 * 2. Klik menu "Extensions" (Ekstensi) > "Apps Script".
 * 3. Hapus kode yang ada, lalu Copy & Paste semua kode di bawah ini.
 * 4. Klik tombol "Deploy" (Terapkan) > "New deployment" (Penerapan baru).
 * 5. Pilih tipe: "Web app" (Aplikasi web).
 * 6. Set "Execute as": "Me" (Saya).
 * 7. Set "Who has access": "Anyone" (Siapa saja).
 * 8. Klik "Deploy", izinkan akses akun Google, lalu Copy "Web app URL" yang muncul.
 * 9. Paste Web app URL tersebut ke pengaturan di aplikasi ScoopMatch!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Inisialisasi Header Tabel jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Transaksi",
        "No Antrean",
        "Nama Pelanggan",
        "Varian Rasa",
        "Wadah",
        "Ukuran",
        "Topping",
        "Catatan",
        "Total Harga (Rp)",
        "Status"
      ]);
      
      // Styling header baris pertama
      var headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setBackground("#F43F5E");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Format tanggal lokal Indonesia
    var date = new Date(data.timestamp || new Date());
    var formattedDate = Utilities.formatDate(date, "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
    
    // Tambahkan baris transaksi baru
    sheet.appendRow([
      formattedDate,
      data.order_code,
      data.customer_name,
      data.flavor_name,
      data.serving,
      data.size,
      data.toppings,
      data.notes || "-",
      data.total_price,
      data.status
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
