import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Bot, 
  ShieldCheck, 
  CheckCircle2, 
  Users 
} from 'lucide-react';
import { Language } from '../../types';

interface PracticeHeroProps {
  lang: Language;
  onStartPractice: () => void;
  onOpenAiAssistant: () => void;
}

export const PracticeHero: React.FC<PracticeHeroProps> = ({
  lang,
  onStartPractice,
  onOpenAiAssistant
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-800 text-white shadow-xl mb-8 p-6 sm:p-10 border border-emerald-500/30">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-emerald-100 text-xs font-semibold backdrop-blur-md">
          <GraduationCap className="w-4 h-4 text-emerald-200" />
          <span>ОшМПУ • Педагогикалык практика борбору</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          <span className="text-[11px] text-emerald-200">1–11-класс & Садик</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
          Педагогикалык практика жардамчысы
        </h1>

        {/* Subtitle quote specified by user */}
        <p className="text-base sm:text-lg text-emerald-50 leading-relaxed max-w-2xl font-normal drop-shadow-xs">
          «1–11-класстар жана мектепке чейинки билим берүү үчүн даяр сабактар, методикалар, презентациялар жана AI жардамчы.»
        </p>

        {/* Two specified main buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
          <button
            id="hero-btn-start-practice"
            onClick={onStartPractice}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-sm shadow-lg shadow-black/10 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Практиканы баштоо</span>
            <ArrowRight className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            id="hero-btn-ai-assistant"
            onClick={onOpenAiAssistant}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-100 font-bold text-sm border border-emerald-400/40 backdrop-blur-md shadow-md hover:border-emerald-300 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-emerald-300" />
            <span>AI Сабак жардамчысы</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>

        {/* Quick features indicator */}
        <div className="pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-emerald-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>10 Негизги предмет</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Мамлекеттик стандарт</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>STEAM & PISA усулдары</span>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>AI Конспект генератору</span>
          </div>
        </div>
      </div>
    </div>
  );
};
