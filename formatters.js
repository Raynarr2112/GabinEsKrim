// Format currency to Indonesian Rupiah
export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
}

// Generate unique order ID like #SCOOP-042
export function generateOrderId() {
  const randomNum = Math.floor(100 + Math.random() * 900); // 3 digits
  return `#SCOOP-${randomNum}`;
}

// Format timestamp to localized readable string
export function formatTime(timestamp) {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WIB';
}
