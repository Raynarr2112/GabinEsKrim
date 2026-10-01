import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { formatRupiah, formatTime } from '../utils/formatters';
import { TOPPINGS, SIZE_OPTIONS, SERVING_OPTIONS } from '../data/flavors';
import { exportOrdersToExcel } from '../utils/excelExporter';
import { isSupabaseConfigured } from '../services/supabase';
import { getGoogleSheetsWebhookUrl } from '../services/orderSync';
import SyncSettingsModal from './SyncSettingsModal';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  Trash2,
  ArrowLeft,
  User,
  ShoppingBag,
  Sparkles,
  FileSpreadsheet,
  TrendingUp,
  Check,
  Settings,
  Database,
} from 'lucide-react';

export default function BaristaQueueView() {
  const {
    orderQueue,
    updateOrderStatus,
    deleteOrder,
    resetToDemoOrders,
    clearQueue,
    setCurrentView,
  } = useOrder();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'diproses' | 'selesai'
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const counts = {
    all: orderQueue.length,
    pending: orderQueue.filter(o => o.status === 'pending').length,
    diproses: orderQueue.filter(o => o.status === 'diproses').length,
    selesai: orderQueue.filter(o => o.status === 'selesai').length,
  };

  const totalOmzet = orderQueue.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const isCloudOn = isSupabaseConfigured();
  const isSheetsOn = Boolean(getGoogleSheetsWebhookUrl());

  const filteredOrders = orderQueue.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const handleNextStatus = (order) => {
    if (order.status === 'pending') {
      updateOrderStatus(order.orderId, 'diproses');
    } else if (order.status === 'diproses') {
      updateOrderStatus(order.orderId, 'selesai');
    }
  };

  const handleExportExcel = () => {
    if (orderQueue.length === 0) {
      alert('Belum ada pesanan untuk diekspor!');
      return;
    }
    setIsExporting(true);
    try {
      const ok = exportOrdersToExcel(orderQueue);
      if (ok) {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal mengekspor laporan: ' + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full pb-16 pt-2 space-y-4 animate-fade-in">
      {/* View Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('landing')}
          className="p-2 -ml-1 rounded-2xl text-icechoco-600 hover:text-icechoco-900 hover:bg-white/80 active:scale-90 transition-all flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke App</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isCloudOn || isSheetsOn
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-cream-100 hover:bg-cream-200 border-cream-300 text-icechoco-700'
            }`}
            title="Konfigurasi Database Cloud & Google Sheets"
          >
            <Database className={`w-3.5 h-3.5 ${isCloudOn ? 'text-emerald-600' : 'text-icechoco-500'}`} />
            <span>{isCloudOn ? 'Cloud Aktif' : isSheetsOn ? 'Sheets Aktif' : 'Setup Cloud'}</span>
            <Settings className="w-3 h-3 text-icechoco-400" />
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-icechoco-900 text-cream-50 text-xs font-bold">
            <ClipboardList className="w-3.5 h-3.5 text-rose-300" />
            Panel Barista & Kasir
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="font-fredoka text-2xl font-bold text-icechoco-900">
          Antrean Pesanan Booth 🍧
        </h1>
        <p className="text-xs text-icechoco-600 font-medium">
          Kelola alur penyajian es krim, pantau omzet, dan unduh laporan penjualan.
        </p>
      </div>

      {/* Revenue & Excel Export Bar */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="text-[11px] text-emerald-100 font-medium">
              Total Omzet Tercatat ({counts.all} pesanan)
            </div>
            <div className="font-fredoka text-xl font-bold text-white tracking-wide">
              {formatRupiah(totalOmzet)}
            </div>
          </div>
        </div>

        <button
          onClick={handleExportExcel}
          disabled={isExporting}
          className={`px-4 py-2.5 rounded-2xl font-fredoka font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 ${
            exportSuccess
              ? 'bg-white text-emerald-800'
              : 'bg-cream-100 hover:bg-white text-emerald-900'
          }`}
          title="Download laporan pesanan dan ringkasan ke file Excel .xlsx"
        >
          {exportSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>Berhasil Diunduh!</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>{isExporting ? 'Membuat File...' : 'Export Laporan Excel (.xlsx)'}</span>
            </>
          )}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white/80 rounded-2xl border border-cream-200 shadow-xs overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'Semua' },
          { key: 'pending', label: 'Pending' },
          { key: 'diproses', label: 'Diproses' },
          { key: 'selesai', label: 'Selesai' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 active:scale-95 ${
              activeTab === tab.key
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-icechoco-600 hover:text-icechoco-900 hover:bg-cream-100'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.key ? 'bg-white/30 text-white' : 'bg-cream-200 text-icechoco-700'
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3 pt-1">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-white/70 border border-cream-200 space-y-2">
            <span className="text-3xl">🍦</span>
            <p className="font-fredoka font-bold text-sm text-icechoco-800">
              Tidak ada pesanan di kategori ini
            </p>
            <p className="text-xs text-icechoco-600">
              Pesanan baru yang dibuat pelanggan akan otomatis muncul di antrean ini.
            </p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const sizeObj = SIZE_OPTIONS.find(s => s.id === order.size);
            const servingObj = SERVING_OPTIONS.find(s => s.id === order.serving);
            const toppingsFormatted = order.toppings
              .map(tid => {
                const t = TOPPINGS.find(item => item.id === tid);
                return t ? `${t.icon} ${t.name}` : tid;
              })
              .join(', ');

            return (
              <div
                key={order.orderId}
                className="p-4 rounded-3xl bg-white border-2 border-cream-200 shadow-sm space-y-3 transition-all hover:border-rose-200"
              >
                {/* Header card: ID, Time, Status */}
                <div className="flex items-center justify-between border-b border-cream-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-fredoka font-extrabold text-base text-icechoco-900">
                      {order.orderId}
                    </span>
                    <span className="text-[11px] font-semibold text-icechoco-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(order.timestamp)}
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div>
                    {order.status === 'pending' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold border border-amber-300">
                        ⏳ Menunggu
                      </span>
                    )}
                    {order.status === 'diproses' && (
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold border border-blue-300 animate-pulse">
                        🍨 Sedang Dibuat
                      </span>
                    )}
                    {order.status === 'selesai' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                        ✅ Siap Diambil
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer name and ordered item */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-icechoco-800 font-bold">
                    <User className="w-3.5 h-3.5 text-rose-500" />
                    <span>Pemesan: <span className="text-rose-600">{order.customerName}</span></span>
                  </div>

                  <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 flex items-start gap-3">
                    <div className="text-2xl mt-0.5">{order.flavor.emoji}</div>
                    <div className="flex-1 text-xs">
                      <div className="font-fredoka font-bold text-sm text-icechoco-900">
                        {order.flavor.name}
                      </div>
                      <div className="text-icechoco-600 font-medium">
                        {sizeObj?.name} &bull; {servingObj?.name}
                      </div>
                      {toppingsFormatted && (
                        <div className="text-amber-800 text-[11px] font-semibold mt-1">
                          Topping: {toppingsFormatted}
                        </div>
                      )}
                      {order.notes && (
                        <div className="mt-1.5 p-1.5 rounded-lg bg-rose-50/80 text-[11px] text-rose-800 italic">
                          "{order.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer card: Total price & Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-icechoco-500 block">Total Bayar:</span>
                    <span className="font-fredoka font-bold text-sm text-amber-800">
                      {formatRupiah(order.totalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleNextStatus(order)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-fredoka font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Mulai Buat</span>
                      </button>
                    )}

                    {order.status === 'diproses' && (
                      <button
                        onClick={() => handleNextStatus(order)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-fredoka font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tandai Selesai</span>
                      </button>
                    )}

                    {order.status === 'selesai' && (
                      <button
                        onClick={() => updateOrderStatus(order.orderId, 'pending')}
                        className="px-2.5 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-icechoco-600 text-xs font-semibold"
                        title="Reset ke pending"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteOrder(order.orderId)}
                      className="p-2 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      title="Hapus Pesanan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Admin Quick Tools */}
      <div className="pt-4 border-t border-cream-200 flex items-center justify-between text-xs">
        <button
          onClick={resetToDemoOrders}
          className="text-icechoco-600 hover:text-icechoco-900 font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Muat Contoh Pesanan Demo</span>
        </button>

        {orderQueue.length > 0 && (
          <button
            onClick={clearQueue}
            className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Semua</span>
          </button>
        )}
      </div>

      {/* Sync Settings Modal */}
      <SyncSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
