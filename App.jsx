import React from 'react';
import { OrderProvider, useOrder } from './context/OrderContext';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import QuizView from './components/QuizView';
import RecommendationView from './components/RecommendationView';
import TicketView from './components/TicketView';
import BaristaQueueView from './components/BaristaQueueView';
import OrderModal from './components/OrderModal';
import { Heart, Sparkles } from 'lucide-react';

function AppContent() {
  const { currentView } = useOrder();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-cream-100 to-icepink-50/40 flex flex-col items-center">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Mobile-First Application Container (max-w-md centered on desktop) */}
      <main className="w-full max-w-md px-4 flex-1 flex flex-col justify-start">
        {currentView === 'landing' && <LandingView />}
        {currentView === 'quiz' && <QuizView />}
        {currentView === 'recommendation' && <RecommendationView />}
        {currentView === 'ticket' && <TicketView />}
        {currentView === 'barista-queue' && <BaristaQueueView />}
      </main>

      {/* Order Summary & Customer Name Modal */}
      <OrderModal />

      {/* Playful Footer */}
      <footer className="w-full py-6 text-center text-xs text-icechoco-600 border-t border-cream-200/80 bg-white/40 mt-auto">
        <div className="max-w-md mx-auto px-4 space-y-1">
          <p className="font-fredoka font-semibold text-icechoco-800 flex items-center justify-center gap-1.5">
            <span>ScoopMatch Booth Experience</span>
            <span className="text-rose-500">🍦</span>
          </p>
          <p className="text-[11px] text-icechoco-500">
            Dibuat untuk menghilangkan bingung pilih rasa di booth festival & mall.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <AppContent />
    </OrderProvider>
  );
}
