import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { TOPPINGS, SIZE_OPTIONS, SERVING_OPTIONS } from '../data/flavors';
import { formatRupiah } from '../utils/formatters';
import { X, User, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OrderModal() {
  const {
    isOrderModalOpen,
    setIsOrderModalOpen,
    recommendedFlavor,
    customization,
    calculateTotal,
    placeOrder,
  } = useOrder();

  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOrderModalOpen) return null;

  const sizeObj = SIZE_OPTIONS.find(s => s.id === customization.size) || SIZE_OPTIONS[0];
  const servingObj = SERVING_OPTIONS.find(s => s.id === customization.serving) || SERVING_OPTIONS[0];
  const selectedToppingObjs = customization.toppings
    .map(topId => TOPPINGS.find(t => t.id === topId))
    .filter(Boolean);

  const grandTotal = calculateTotal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Mohon masukkan nama pembuat pesanan ya!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        customerName,
        notes,
      });
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-icechoco-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-4xl sm:rounded-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border-2 border-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50">
          <div>
            <h3 className="font-fredoka text-lg sm:text-xl font-bold text-icechoco-900 flex items-center gap-1.5">
              <span>Konfirmasi Pesanan</span>
              <span>🍦</span>
            </h3>
            <p className="text-xs text-icechoco-600">
              Lengkapi detail pesanan untuk barista booth
            </p>
          </div>
          <button
            onClick={() => setIsOrderModalOpen(false)}
            className="p-2 rounded-2xl bg-white border border-cream-300 text-icechoco-600 hover:text-icechoco-900 active:scale-90 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Order Itemized Summary Card */}
          <div className="p-4 rounded-3xl bg-cream-100/70 border border-cream-300/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
                {recommendedFlavor.emoji}
              </div>
              <div className="flex-1">
                <h4 className="font-fredoka font-bold text-sm text-icechoco-900">
                  {recommendedFlavor.name}
                </h4>
                <p className="text-xs text-icechoco-600">
                  {sizeObj.name} &bull; {servingObj.name}
                </p>
              </div>
              <span className="font-fredoka font-bold text-sm text-amber-800">
                {formatRupiah(sizeObj.price)}
              </span>
            </div>

            {/* Toppings list */}
            {selectedToppingObjs.length > 0 && (
              <div className="pt-2 border-t border-cream-300/60 space-y-1.5">
                <span className="text-[11px] font-bold text-icechoco-600 block">
                  Topping Tambahan:
                </span>
                {selectedToppingObjs.map(t => (
                  <div key={t.id} className="flex items-center justify-between text-xs text-icechoco-700 pl-2">
                    <span className="flex items-center gap-1.5">
                      <span>{t.icon}</span>
                      <span>{t.name}</span>
                    </span>
                    <span className="font-semibold text-amber-700">+{formatRupiah(t.price)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total Price Row */}
            <div className="pt-2 border-t border-cream-300 flex items-center justify-between font-fredoka font-bold text-base text-icechoco-900">
              <span>Total Pembayaran:</span>
              <span className="text-rose-600 text-lg">{formatRupiah(grandTotal)}</span>
            </div>
          </div>

          {/* Customer Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Customer Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-icechoco-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-500" />
                <span>Nama Pemesan <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={e => {
                  setCustomerName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Contoh: Rian / Siska"
                className={`w-full px-4 py-3 rounded-2xl border-2 text-sm bg-white font-medium placeholder:text-gray-400 focus:outline-none transition-all ${
                  error ? 'border-rose-400 bg-rose-50/50' : 'border-cream-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200'
                }`}
                autoFocus
              />
              {error && (
                <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}
            </div>

            {/* Notes Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-icechoco-900 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                <span>Catatan Khusus Barista (Opsional)</span>
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Misal: Jangan pakai sendok plastik / topping dipisah..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-cream-300 text-sm bg-white font-medium placeholder:text-gray-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all resize-none"
              />
            </div>

            {/* Booth Payment Notice */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <span>💡</span> Pembayaran Dilakukan di Kasir Booth
              </p>
              <p className="text-[11px] text-amber-800">
                Setelah konfirmasi, kamu akan mendapat kode tiket pesanan untuk ditunjukkan ke barista kami.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-fredoka font-bold text-base shadow-lg shadow-rose-300/50 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Menyiapkan Tiket...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Konfirmasi Pesanan ({formatRupiah(grandTotal)})</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
