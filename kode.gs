function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('TA Parfume')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getProductData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0]; 
    const data = sheet.getDataRange().getDisplayValues(); 
    if (data.length <= 1) return "KOSONG";
    return data.slice(1).filter(row => row[0].trim() !== ""); 
  } catch (e) {
    return "ERROR: " + e.toString();
  }
}

function simpanPesanan(cust, items) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetPesanan = ss.getSheetByName("Pesanan");
    
    // Jika sheet "Pesanan" belum ada, buat baru dengan kolom yang sesuai
    if (!sheetPesanan) {
      sheetPesanan = ss.insertSheet("Pesanan");
      sheetPesanan.appendRow(["Tanggal", "Nama Pelanggan", "ID LINE", "Alamat", "Nama Produk", "Ukuran", "Jumlah", "Total IDR", "Total USD", "Total THB"]);
      sheetPesanan.getRange("A1:J1").setBackground("#4b0082").setFontColor("white").setFontWeight("bold");
    }
    
    const tanggal = new Date();
    items.forEach(item => {
      sheetPesanan.appendRow([
        tanggal, 
        cust.nama, 
        cust.line,    // Menangkap data ID LINE dari Web
        cust.alamat,
        item.name, 
        item.size, 
        item.qty, 
        item.totalIdr, 
        item.totalUsd, 
        item.totalThb
      ]);
    });
    return "SUKSES";
  } catch (e) {
    return "GAGAL: " + e.toString();
  }
}