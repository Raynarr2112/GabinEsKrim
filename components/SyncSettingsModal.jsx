import React, { useState } from 'react';
import {
  X,
  Database,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  Save,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  getSupabaseCredentials,
  isSupabaseConfigured,
} from '../services/supabase';
import {
  getGoogleSheetsWebhookUrl,
  setGoogleSheetsWebhookUrl,
} from '../services/orderSync';

export default function SyncSettingsModal({ isOpen, onClose }) {
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseCredentials().url);
  const [supabaseKey, setSupabaseKey] = useState(() => getSupabaseCredentials().key);
  const [sheetsUrl, setSheetsUrl] = useState(() => getGoogleSheetsWebhookUrl());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null); // 'supabase' | 'sheets' | null

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    try {
      // Save Supabase config
      const supaConfig = { url: supabaseUrl.trim(), key: supabaseKey.trim() };
      localStorage.setItem('scoopmatch_supabase_config', JSON.stringify(supaConfig));

      // Save Sheets config
      setGoogleSheetsWebhookUrl(sheetsUrl.trim());

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
        window.location.reload(); // Reload to initialize new client & listeners
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan konfigurasi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-icechoco-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-4xl p-6 shadow-2xl border-2 border-cream-200 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-fredoka text-lg font-bold text-icechoco-900">
                Integrasi Database & Excel Cloud
              </h2>
              <p className="text-xs text-icechoco-600 font-medium">
                Hubungkan ke Supabase (Real-time) & Google Sheets (Auto-Sync)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-icechoco-500 hover:text-icechoco-900 hover:bg-cream-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* 1. Supabase Section */}
          <div className="p-4 rounded-3xl bg-cream-50/80 border border-cream-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-fredoka font-bold text-sm text-icechoco-900 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-600" />
                  1. Database Cloud (Supabase)
                </span>
                {isSupabaseConfigured() ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Aktif
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-cream-200 text-icechoco-600 text-[10px] font-semibold">
                    Belum Terhubung
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveGuide(activeGuide === 'supabase' ? null : 'supabase')}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Panduan</span>
              </button>
            </div>

            {activeGuide === 'supabase' && (
              <div className="p-3 rounded-2xl bg-white text-[11px] text-icechoco-700 border border-cream-200 space-y-1.5 leading-relaxed">
                <p className="font-bold text-rose-600">Langkah Cepat Setup Supabase (Gratis):</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline text-blue-600 font-semibold">supabase.com</a> dan buat project baru.</li>
                  <li>Buka menu <b>SQL Editor</b>, lalu copy-paste isi file <code>supabase_schema.sql</code> dari folder project ini, lalu Run.</li>
                  <li>Buka <b>Project Settings &gt; API</b>, copy <b>Project URL</b> dan <b>anon public key</b>, lalu paste di input bawah ini.</li>
                </ol>
              </div>
            )}

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-bold text-icechoco-700 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-medium focus:outline-rose-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-icechoco-700 mb-1">
                  Supabase Anon Public Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-medium focus:outline-rose-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Google Sheets Section */}
          <div className="p-4 rounded-3xl bg-cream-50/80 border border-cream-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-fredoka font-bold text-sm text-icechoco-900 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                  2. Auto-Sync Google Sheets (Excel Online)
                </span>
                {sheetsUrl ? (
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                    Aktif
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-cream-200 text-icechoco-600 text-[10px] font-semibold">
                    Belum Terhubung
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveGuide(activeGuide === 'sheets' ? null : 'sheets')}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Panduan</span>
              </button>
            </div>

            {activeGuide === 'sheets' && (
              <div className="p-3 rounded-2xl bg-white text-[11px] text-icechoco-700 border border-cream-200 space-y-1.5 leading-relaxed">
                <p className="font-bold text-teal-700">Langkah Auto-Sync ke Google Sheets:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Buat Google Sheet baru di browser Anda.</li>
                  <li>Pilih menu <b>Extensions &gt; Apps Script</b>.</li>
                  <li>Copy & Paste seluruh isi file <code>google_apps_script.js</code> dari project ini.</li>
                  <li>Klik <b>Deploy &gt; New deployment</b>, pilih <b>Web app</b>, access: <b>Anyone</b>.</li>
                  <li>Copy Web app URL yang dihasilkan dan tempel di bawah ini.</li>
                </ol>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-icechoco-700 mb-1">
                Google Apps Script Webhook URL
              </label>
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-medium focus:outline-rose-500 bg-white"
              />
              <p className="text-[10px] text-icechoco-500 mt-1">
                Setiap pelanggan memesan, data otomatis langsung menambah 1 baris baru di spreadsheet Google Sheets Anda.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-icechoco-600 hover:bg-cream-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-2xl font-fredoka font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-500 hover:bg-rose-600 text-white active:scale-95'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Pengaturan Disimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
