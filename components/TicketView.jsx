import React from 'react';
import { useOrder } from '../context/OrderContext';
import { formatRupiah, formatTime } from '../utils/formatters';
import { TOPPINGS, SIZE_OPTIONS, SERVING_OPTIONS } from '../data/flavors';
import { Sparkles, QrCode, ArrowRight, RotateCcw, ClipboardList, CheckCircle } from 'lucide-react';

export default function TicketView() {
  const { currentTicket, startQuiz, setCurrentView } = useOrder();

  if (!currentTicket) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-sm font-semibold text-icechoco-600">Belum ada pesanan aktif.</p>
        <button
          onClick={startQuiz}
          className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-fredoka font-bold text-sm"
        >
          Mulai Quiz Sekarang
        </button>
      </div>
    );
  }

  const sizeObj = SIZE_OPTIONS.find(s => s.id === currentTicket.size);
  const servingObj = SERVING_OPTIONS.find(s => s.id === currentTicket.serving);
  const toppingNames = currentTicket.toppings
    .map(topId => {
      const top = TOPPINGS.find(t => t.id === topId);
      return top ? `${top.icon} ${top.name}` : null;
    })
    .filter(Boolean);

  return (
    <div className="w-full pb-16 pt-2 space-y-5 animate-fade-in">
      {/* Success Badge */}
      <div className="text-center space-y-2 px-2">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-3xl shadow-md animate-bounce-subtle">
          🎉
        </div>
        <h1 className="font-fredoka text-2xl sm:text-3xl font-extrabold text-icechoco-900 leading-tight">
          Pesanan Berhasil Dibuat!
        </h1>
        <p className="text-xs sm:text-sm text-icechoco-600 font-medium max-w-xs mx-auto">
          Tunjukkan kode ini ke kasir/barista untuk pembayaran & pengambilan es krim! 🍦
        </p>
      </div>

      {/* Stylized Physical Booth Ticket Card */}
      <div className="relative mx-auto w-full max-w-sm bg-white rounded-4xl border-2 border-icepink-200 shadow-float overflow-hidden">
        {/* Ticket Header */}
        <div className="p-5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white text-center space-y-1 relative">
          <span className="text-[11px] font-bold tracking-widest uppercase opacity-90">
            Kupon Antrean Booth ScoopMatch
          </span>
          <div className="font-fredoka font-extrabold text-3xl sm:text-4xl tracking-wider py-1">
            {currentTicket.orderId}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            Status: Menunggu di Kasir
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex items-center justify-between my-0 bg-white">
          <div className="w-6 h-6 rounded-full bg-cream-100 -ml-3 border-r border-cream-300" />
          <div className="flex-1 border-t-2 border-dashed border-cream-300 mx-2" />
          <div className="w-6 h-6 rounded-full bg-cream-100 -mr-3 border-l border-cream-300" />
        </div>

        {/* Ticket Details Body */}
        <div className="p-5 space-y-4">
          {/* Customer & Timestamp Info */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-cream-200">
            <div>
              <span className="text-icechoco-600 block text-[10px]">Nama Pemesan:</span>
              <span className="font-bold text-icechoco-900 text-sm">{currentTicket.customerName}</span>
            </div>
            <div className="text-right">
              <span className="text-icechoco-600 block text-[10px]">Waktu Pemesanan:</span>
              <span className="font-bold text-icechoco-900">{formatTime(currentTicket.timestamp)}</span>
            </div>
          </div>

          {/* Ice Cream Flavor Highlight */}
          <div className="p-3.5 rounded-2xl bg-cream-100/70 border border-cream-300 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs">
              {currentTicket.flavor.emoji}
            </div>
            <div className="flex-1">
              <h3 className="font-fredoka font-bold text-sm text-icechoco-900">
                {currentTicket.flavor.name}
              </h3>
              <p className="text-xs text-icechoco-600 font-medium">
                {sizeObj?.name} &bull; {servingObj?.name}
              </p>
            </div>
          </div>

          {/* Selected Toppings */}
          {toppingNames.length > 0 && (
            <div className="text-xs space-y-1">
              <span className="font-bold text-icechoco-600 text-[11px] block">Topping:</span>
              <div className="flex flex-wrap gap-1.5">
                {toppingNames.map((name, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-[11px]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Notes if any */}
          {currentTicket.notes && (
            <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs text-rose-900">
              <span className="font-bold">Catatan: </span>
              <span className="italic">{currentTicket.notes}</span>
            </div>
          )}

          {/* QR Code Simulation Box */}
          <div className="pt-2 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-3 bg-white border-2 border-icechoco-900 rounded-2xl shadow-sm inline-block">
              {/* High contrast visual QR SVG */}
              <svg className="w-28 h-28" viewBox="0 0 100 100" fill="currentColor">
                {/* Simulated stylized scannable QR Code blocks */}
                <rect x="0" y="0" width="30" height="30" rx="4" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="9" y="9" width="12" height="12" />

                <rect x="70" y="0" width="30" height="30" rx="4" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="79" y="9" width="12" height="12" />

                <rect x="0" y="70" width="30" height="30" rx="4" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="9" y="79" width="12" height="12" />

                {/* QR Data Dots */}
                <rect x="36" y="8" width="6" height="6" />
                <rect x="48" y="14" width="8" height="6" />
                <rect x="36" y="24" width="8" height="6" />
                <rect x="56" y="22" width="6" height="6" />

                <rect x="10" y="40" width="6" height="12" />
                <rect x="22" y="44" width="8" height="6" />
                <rect x="36" y="38" width="8" height="8" />
                <rect x="50" y="42" width="10" height="6" />
                <rect x="66" y="38" width="8" height="8" />
                <rect x="80" y="44" width="10" height="6" />

                <rect x="38" y="60" width="6" height="14" />
                <rect x="52" y="58" width="10" height="8" />
                <rect x="70" y="60" width="6" height="8" />
                <rect x="84" y="62" width="8" height="6" />
                <rect x="42" y="80" width="8" height="8" />
                <rect x="58" y="76" width="6" height="14" />
                <rect x="74" y="80" width="12" height="6" />
              </svg>
            </div>
            <p className="text-[10px] font-bold text-icechoco-600 uppercase tracking-wider">
              Scan untuk Verifikasi Kasir
            </p>
          </div>

          {/* Grand Total Bar */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Total Tagihan:</span>
            <span className="font-fredoka text-lg font-bold text-amber-900">
              {formatRupiah(currentTicket.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="space-y-2.5 max-w-sm mx-auto pt-1">
        <button
          onClick={startQuiz}
          className="w-full py-3.5 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-fredoka font-bold text-base shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Buat Pesanan Baru</span>
        </button>

        <button
          onClick={() => setCurrentView('barista-queue')}
          className="w-full py-3 px-6 rounded-2xl bg-white border border-cream-300 text-icechoco-800 hover:bg-cream-50 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <ClipboardList className="w-4 h-4 text-rose-500" />
          <span>Lihat Antrean Barista Booth</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
