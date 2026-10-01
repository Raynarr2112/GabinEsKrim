import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { FLAVORS, TOPPINGS, SERVING_OPTIONS, SIZE_OPTIONS } from '../data/flavors';
import { formatRupiah } from '../utils/formatters';
import FlavorIllustration from './FlavorIllustration';
import ManualMenuModal from './ManualMenuModal';
import { Sparkles, RotateCcw, Check, ShoppingBag, Info, ChevronDown, ArrowRight, Utensils } from 'lucide-react';

export default function RecommendationView() {
  const {
    recommendedFlavor,
    setRecommendedFlavor,
    customization,
    setCustomization,
    calculateTotal,
    startQuiz,
    setIsOrderModalOpen,
  } = useOrder();

  const [showFlavorPicker, setShowFlavorPicker] = useState(false);
  const [isManualMenuOpen, setIsManualMenuOpen] = useState(false);
  const [isManualPick, setIsManualPick] = useState(false);

  const currentTotal = calculateTotal();

  // Serving option selection
  const handleSelectServing = (servingId) => {
    setCustomization(prev => ({ ...prev, serving: servingId }));
  };

  // Size option selection
  const handleSelectSize = (sizeId) => {
    setCustomization(prev => ({ ...prev, size: sizeId }));
  };

  // Topping checkbox toggle
  const handleToggleTopping = (toppingId) => {
    setCustomization(prev => {
      const exists = prev.toppings.includes(toppingId);
      const updated = exists
        ? prev.toppings.filter(id => id !== toppingId)
        : [...prev.toppings, toppingId];
      return { ...prev, toppings: updated };
    });
  };

  const handleManualFlavorSelect = (flavor) => {
    setRecommendedFlavor(flavor);
    setIsManualPick(true);
    setIsManualMenuOpen(false);

    // Smart default toppings
    if (flavor.id === 'berry-blast') {
      setCustomization(prev => ({ ...prev, serving: 'cup', toppings: ['boba'] }));
    } else if (flavor.id === 'choco-therapy') {
      setCustomization(prev => ({ ...prev, serving: 'cone', toppings: ['oreo', 'choco-chips'] }));
    }
  };

  return (
    <div className="w-full pb-28 pt-1 space-y-4 animate-fade-in">
      {/* Top Banner Result Announcement */}
      <div className="text-center space-y-1.5 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200">
          <Sparkles className="w-3.5 h-3.5 fill-rose-500" />
          {isManualPick ? 'Pilihan Menu Favoritmu' : 'Rekomendasi Spesial Mood Kamu'}
        </div>
        <h1 className="font-fredoka text-2xl sm:text-3xl font-extrabold text-icechoco-900 leading-tight">
          {isManualPick ? (
            <>
              Menu Pilihanmu Sendiri: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-500 to-pink-600">
                {recommendedFlavor.name}! 🍨
              </span>
            </>
          ) : (
            <>
              Mood Kamu Cocok Banget Sama: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-600 to-amber-600">
                {recommendedFlavor.name}! ✨
              </span>
            </>
          )}
        </h1>
        <p className="text-xs text-icechoco-600 font-medium">
          {isManualPick
            ? 'Varian rasa es krim yang kamu tentukan sendiri. Lanjutkan custom wadah & topping!'
            : 'Disesuaikan dari pilihan mood & sensasi rasa yang kamu inginkan hari ini.'}
        </p>
      </div>

      {/* Prominent Callout: Choose Menu Yourself if Not Feeling Matched */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl shrink-0 shadow-inner">
            {isManualPick ? '🍦' : '🤔'}
          </div>
          <div>
            <h3 className="font-fredoka font-bold text-xs sm:text-sm text-icechoco-900">
              {isManualPick ? 'Ingin Coba Menu Lainnya?' : 'Merasa Kurang Cocok Sama Hasil Kuis?'}
            </h3>
            <p className="text-[11px] text-icechoco-600 font-medium">
              {isManualPick
                ? 'Klik di sini kapan saja jika ingin memilih menu lain dari katalog booth.'
                : 'Tenang! Kamu bebas memilih menu rasa lain sendiri sesuai seleramu.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsManualMenuOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-fredoka font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>Pilih Menu Sendiri</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Flavor Result Card */}
      <div className="relative rounded-4xl bg-white/95 border-2 border-white shadow-soft p-5 space-y-4 overflow-hidden">
        {/* Mood Match Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold px-3 py-1 rounded-2xl bg-cream-100 text-icechoco-800 border border-cream-300">
            {isManualPick ? 'Pilihan Menu Sendiri' : recommendedFlavor.moodMatch}
          </span>

          {/* Quick flavor switcher toggle */}
          <button
            onClick={() => setIsManualMenuOpen(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200 flex items-center gap-1"
          >
            <span>Katalog Menu</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dropdown to pick different flavor if desired */}
        {showFlavorPicker && (
          <div className="p-2.5 rounded-2xl bg-cream-50 border border-cream-200 space-y-1.5 animate-fade-in">
            <p className="text-[11px] font-bold text-icechoco-600 px-1">
              Pilih varian rasa lainnya:
            </p>
            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {FLAVORS.map(flavor => (
                <button
                  key={flavor.id}
                  onClick={() => {
                    setRecommendedFlavor(flavor);
                    setShowFlavorPicker(false);
                  }}
                  className={`p-2 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                    flavor.id === recommendedFlavor.id
                      ? 'bg-rose-500 text-white'
                      : 'bg-white hover:bg-rose-50 text-icechoco-900 border border-cream-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{flavor.emoji}</span>
                    <span>{flavor.name}</span>
                  </span>
                  <span className="text-[10px] opacity-80">{flavor.basePrice ? formatRupiah(flavor.basePrice) : ''}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Interactive Illustration */}
        <div className="flex flex-col items-center justify-center py-2">
          <FlavorIllustration
            flavorId={recommendedFlavor.id}
            serving={customization.serving}
            size={customization.size}
            toppings={customization.toppings}
            className="w-48 h-56"
          />
          <span className="text-[11px] font-semibold text-icechoco-600 -mt-2">
            Preview: {customization.size === 'single' ? 'Single Scoop' : 'Double Scoop'} &bull; {customization.serving === 'cone' ? 'Cone' : 'Cup'}
          </span>
        </div>

        {/* Description & Taste Notes */}
        <div className="space-y-2 border-t border-cream-200/80 pt-3">
          <p className="text-xs sm:text-sm text-icechoco-700 leading-relaxed font-normal">
            {recommendedFlavor.description}
          </p>

          {/* Flavor Notes Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {recommendedFlavor.notes.map((note, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200"
              >
                ✨ {note}
              </span>
            ))}
          </div>

          {/* Barista Recommendation Notice */}
          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 flex items-start gap-2">
            <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900">
              <span className="font-bold">Saran Barista Booth: </span>
              {recommendedFlavor.recommendedTopping}
            </div>
          </div>
        </div>
      </div>

      {/* Customization Options Section */}
      <div className="space-y-4">
        {/* 1. Serving Option (Cone vs Cup) */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 border border-cream-200 shadow-sm space-y-2.5">
          <label className="text-xs font-bold text-icechoco-900 uppercase tracking-wider block">
            1. Pilihan Wadah Penyajian
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {SERVING_OPTIONS.map(option => {
              const isSelected = customization.serving === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectServing(option.id)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-200/60 shadow-sm'
                      : 'bg-white border-cream-200 hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      Gratis
                    </span>
                  </div>
                  <h4 className="font-fredoka font-bold text-xs sm:text-sm text-icechoco-900">
                    {option.name}
                  </h4>
                  <p className="text-[10px] text-icechoco-600 font-medium">
                    {option.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Scoop Size (Single vs Double) */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 border border-cream-200 shadow-sm space-y-2.5">
          <label className="text-xs font-bold text-icechoco-900 uppercase tracking-wider block">
            2. Porsi / Ukuran Scoop
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {SIZE_OPTIONS.map(option => {
              const isSelected = customization.size === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectSize(option.id)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-200/60 shadow-sm'
                      : 'bg-white border-cream-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-fredoka font-bold text-xs sm:text-sm text-amber-900">
                      {option.name}
                    </span>
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                      {formatRupiah(option.price)}
                    </span>
                  </div>
                  <p className="text-[10px] text-icechoco-600 font-medium">
                    {option.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Extra Toppings Checkboxes */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 border border-cream-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-icechoco-900 uppercase tracking-wider">
              3. Tambahan Topping (Opsional)
            </label>
            <span className="text-[10px] text-icechoco-600 font-medium">Bisa pilih lebih dari 1</span>
          </div>

          <div className="space-y-2">
            {TOPPINGS.map(topping => {
              const isChecked = customization.toppings.includes(topping.id);
              return (
                <div
                  key={topping.id}
                  onClick={() => handleToggleTopping(topping.id)}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                    isChecked
                      ? 'bg-rose-50/80 border-rose-400 shadow-xs'
                      : 'bg-white border-cream-200 hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{topping.icon}</span>
                    <div>
                      <h4 className="font-fredoka font-bold text-xs sm:text-sm text-icechoco-900">
                        {topping.name}
                      </h4>
                      <span className="text-[10px] font-bold text-amber-700">
                        +{formatRupiah(topping.price)}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all ${
                      isChecked
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'border-cream-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary Action: Repeat Quiz */}
      <div className="text-center pt-2">
        <button
          onClick={startQuiz}
          className="inline-flex items-center gap-2 text-xs font-bold text-icechoco-600 hover:text-icechoco-900 py-2 px-4 rounded-2xl bg-white/60 hover:bg-white border border-cream-300 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ulangi Quiz dari Awal</span>
        </button>
      </div>

      {/* Sticky Bottom Order Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-lg border-t border-cream-300/80 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold text-icechoco-600 block">Total Pesanan:</span>
            <span className="font-fredoka text-xl font-bold text-amber-700">
              {formatRupiah(currentTotal)}
            </span>
          </div>

          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-fredoka font-bold text-base shadow-md shadow-rose-300/50 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pesan Varian Ini</span>
          </button>
        </div>
      </div>

      {/* Full Catalog Modal for choosing flavor manually */}
      <ManualMenuModal
        isOpen={isManualMenuOpen}
        onClose={() => setIsManualMenuOpen(false)}
        selectedFlavorId={recommendedFlavor.id}
        onSelectFlavor={handleManualFlavorSelect}
      />
    </div>
  );
}
