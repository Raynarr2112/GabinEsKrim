import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';

export default function QuizView() {
  const { handleFinishQuiz, setCurrentView } = useOrder();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const totalSteps = QUIZ_QUESTIONS.length;
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  const currentAnswer = selectedAnswers[currentQuestion.id];

  const handleSelectOption = (optionId) => {
    const updated = {
      ...selectedAnswers,
      [currentQuestion.id]: optionId,
    };
    setSelectedAnswers(updated);

    // Auto advance after slight tactile delay for delightful responsive feel
    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Complete Quiz!
        setIsSubmitting(true);
        setTimeout(() => {
          handleFinishQuiz(updated);
        }, 400);
      }
    }, 250);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      setCurrentView('landing');
    }
  };

  return (
    <div className="w-full pb-16 pt-2 space-y-5 animate-fade-in">
      {/* Top Header & Progress Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 -ml-1 rounded-2xl text-icechoco-600 hover:text-icechoco-900 hover:bg-white/80 active:scale-90 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <span className="text-xs font-extrabold text-rose-500 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full shadow-xs">
            Pertanyaan {currentStep + 1} dari {totalSteps}
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="relative w-full h-3 rounded-full bg-cream-300/60 overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 transition-all duration-400 ease-out shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card Box */}
      <div className="bg-white/90 backdrop-blur-md rounded-4xl p-6 border-2 border-white shadow-soft space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentQuestion.icon}</span>
            <span className="text-xs font-bold text-rose-500 tracking-wide uppercase">
              Pertanyaan #{currentStep + 1}
            </span>
          </div>
          <h2 className="font-fredoka text-xl sm:text-2xl font-bold text-icechoco-900 leading-snug">
            {currentQuestion.title}
          </h2>
          <p className="text-xs sm:text-sm text-icechoco-600 font-medium">
            {currentQuestion.subtitle}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map(option => {
            const isSelected = currentAnswer === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-4 rounded-3xl text-left transition-all duration-200 flex items-center justify-between border-2 active:scale-[0.98] ${
                  isSelected
                    ? 'bg-rose-50/90 border-rose-400 shadow-md ring-2 ring-rose-200/60'
                    : 'bg-white/80 border-cream-200 hover:border-rose-200 hover:bg-white shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-transform ${
                      isSelected ? 'scale-110 bg-white shadow-md' : 'bg-cream-100'
                    }`}
                  >
                    <span>{option.emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-fredoka font-bold text-sm sm:text-base text-icechoco-900">
                      {option.label}
                    </h3>
                    <p className="text-xs text-icechoco-600 font-normal leading-relaxed">
                      {option.desc}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    isSelected
                      ? 'bg-rose-500 border-rose-500 text-white scale-105'
                      : 'border-cream-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Helpful Hint or Loading State */}
      <div className="text-center pt-2">
        {isSubmitting ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse">
            <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500 animate-spin" />
            Menganalisis profil rasa & mood kamu...
          </div>
        ) : (
          <p className="text-[11px] text-icechoco-600 font-semibold flex items-center justify-center gap-1">
            <span>💡</span> Pilih jawaban dengan klik sekali, langsung lanjut otomatis!
          </p>
        )}
      </div>
    </div>
  );
}
