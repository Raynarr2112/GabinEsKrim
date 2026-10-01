import React from 'react';
import { useOrder } from '../context/OrderContext';
import { Sparkles, ClipboardList, Home, IceCream } from 'lucide-react';

export default function Navbar() {
  const { currentView, setCurrentView, orderQueue } = useOrder();

  const pendingCount = orderQueue.filter(o => o.status === 'pending' || o.status === 'diproses').length;

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 bg-cream-50/90 backdrop-blur-md border-b border-cream-300/60 shadow-sm transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2 group text-left transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-icepink-300 via-rose-300 to-iceyellow-300 flex items-center justify-center shadow-md shadow-rose-200/50 group-hover:rotate-6 transition-transform">
            <span className="text-xl">🍦</span>
          </div>
          <div>
            <div className="font-fredoka font-bold text-lg leading-tight text-icechoco-900 flex items-center gap-1">
              ScoopMatch
              <Sparkles className="w-3.5 h-3.5 text-icepink-400 fill-icepink-400 animate-pulse" />
            </div>
            <span className="text-[11px] font-medium text-icechoco-600 block -mt-0.5">
              Cari Es Krim Sesuai Mood
            </span>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {currentView !== 'landing' && (
            <button
              onClick={() => setCurrentView('landing')}
              className="p-2 rounded-2xl bg-white/80 border border-cream-300/80 text-icechoco-600 hover:text-icechoco-900 hover:bg-white active:scale-95 transition-all text-xs font-semibold flex items-center gap-1 shadow-sm"
              title="Kembali ke Beranda"
            >
              <Home className="w-4 h-4 text-icechoco-600" />
            </button>
          )}

          {/* Barista Queue Toggle */}
          <button
            onClick={() => setCurrentView(currentView === 'barista-queue' ? 'landing' : 'barista-queue')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              currentView === 'barista-queue'
                ? 'bg-icechoco-900 text-cream-50 ring-2 ring-icepink-300'
                : 'bg-white text-icechoco-800 border border-icepink-200 hover:bg-icepink-50'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-icepink-400" />
            <span>Antrean</span>
            {pendingCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white animate-bounce-subtle">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
