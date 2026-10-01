import React from 'react';
import { useOrder } from '../context/OrderContext';
import { FLAVORS } from '../data/flavors';
import FlavorIllustration from './FlavorIllustration';
import { Sparkles, ArrowRight, Zap, ShieldCheck, HeartHandshake, Smile } from 'lucide-react';

export default function LandingView() {
  const { startQuiz, setCurrentView, setRecommendedFlavor } = useOrder();

  const handleDirectSelect = (flavor) => {
    setRecommendedFlavor(flavor);
    setCurrentView('recommendation');
  };

  return (
    <div className="w-full pb-16 pt-2 space-y-6 animate-fade-in">
      {/* Hero Badge */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/80 border border-icepink-200 text-rose-600 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          Booth Interactive Experience &bull; Tanpa Antri Pusing
        </span>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-3 px-2">
        <h1 className="font-fredoka text-3xl sm:text-4xl font-extrabold text-icechoco-900 tracking-tight leading-tight">
          Cari Rasa Es Krim <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500">
            Sesuai Mood-mu! 🍦
          </span>
        </h1>
        <p className="text-sm sm:text-base text-icechoco-600 font-medium leading-relaxed max-w-sm mx-auto">
          Jawab 3 pertanyaan singkat & temukan varian es krim impianmu hari ini. Tanpa ribet login, langsung ambil di kasir!
        </p>
      </div>

      {/* Hero Visual Card */}
      <div className="relative mx-auto w-full max-w-sm rounded-4xl bg-gradient-to-b from-white/90 to-icepink-50/80 border-2 border-white p-6 shadow-float overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-iceyellow-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-icepink-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Central Illustration */}
        <div className="relative py-2 flex flex-col items-center">
          <FlavorIllustration
            flavorId="caramel-crunch"
            serving="cone"
            size="double"
            toppings={['oreo']}
            className="w-44 h-52 -my-2"
          />

          {/* Floating Mood Reactions */}
          <div className="absolute top-4 left-0 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-cream-200 shadow-md flex items-center gap-1.5 text-xs font-bold text-icechoco-800 animate-wiggle">
            <span>😴</span>
            <span>Butuh Booster?</span>
          </div>

          <div className="absolute bottom-6 right-0 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-cream-200 shadow-md flex items-center gap-1.5 text-xs font-bold text-rose-600 animate-wiggle" style={{ animationDelay: '1s' }}>
            <span>🥳</span>
            <span>Party Mode On!</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4 space-y-2.5">
          <button
            onClick={startQuiz}
            className="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-fredoka font-bold text-lg tracking-wide shadow-lg shadow-rose-300/50 hover:shadow-xl hover:from-rose-600 hover:to-pink-600 active:translate-y-1 active:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span>Mulai Quiz & Pesan</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
          <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-icechoco-600">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Kuis Cepat 45 Detik
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Bebas Ribet
            </span>
          </div>
        </div>
      </div>

      {/* How it works 3-step teaser */}
      <div className="grid grid-cols-3 gap-2.5 pt-2">
        <div className="p-3.5 rounded-3xl bg-white/70 border border-cream-200 text-center space-y-1 shadow-sm">
          <div className="w-9 h-9 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-base">
            🎯
          </div>
          <p className="text-xs font-bold text-icechoco-900 leading-tight">1. Jawab Kuis</p>
          <p className="text-[10px] text-icechoco-600">3 pertanyaan mood</p>
        </div>

        <div className="p-3.5 rounded-3xl bg-white/70 border border-cream-200 text-center space-y-1 shadow-sm">
          <div className="w-9 h-9 mx-auto rounded-2xl bg-pink-100 flex items-center justify-center text-base">
            ✨
          </div>
          <p className="text-xs font-bold text-icechoco-900 leading-tight">2. Rekomendasi</p>
          <p className="text-[10px] text-icechoco-600">Pilih topping suka-suka</p>
        </div>

        <div className="p-3.5 rounded-3xl bg-white/70 border border-cream-200 text-center space-y-1 shadow-sm">
          <div className="w-9 h-9 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-base">
            🎟️
          </div>
          <p className="text-xs font-bold text-icechoco-900 leading-tight">3. Ambil di Booth</p>
          <p className="text-[10px] text-icechoco-600">Tunjukkan tiket di kasir</p>
        </div>
      </div>

      {/* All Available Flavors Showcase */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-fredoka text-lg font-bold text-icechoco-900">
              Varian Rasa Booth Kami 🍧
            </h2>
            <p className="text-xs text-icechoco-600">
              Mainkan game kuis singkat dulu untuk membuka pemesanan!
            </p>
          </div>
          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
            5 Menu Spesial
          </span>
        </div>

        <div className="space-y-2.5">
          {FLAVORS.map(flavor => (
            <div
              key={flavor.id}
              onClick={startQuiz}
              className="group p-3.5 rounded-3xl bg-white/80 border border-cream-200 hover:border-rose-300 hover:bg-white cursor-pointer transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {flavor.emoji}
                </div>
                <div>
                  <h3 className="font-fredoka font-bold text-sm text-icechoco-900 flex items-center gap-1.5">
                    {flavor.name}
                  </h3>
                  <p className="text-[11px] text-icechoco-600 font-medium line-clamp-1">
                    {flavor.tagline}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                    {flavor.moodMatch.split('&')[0]}
                  </span>
                </div>
              </div>
              <div className="text-right pl-2">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-xl block mb-1">
                  Mulai Rp 15rb
                </span>
                <span className="text-[11px] font-bold text-rose-500 group-hover:underline flex items-center justify-end gap-1">
                  <span>Main Kuis</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
