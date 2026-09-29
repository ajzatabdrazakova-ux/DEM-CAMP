import React, { useState } from 'react';
import {
  Brain,
  Eye,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Users,
  Award,
  Clock,
  Sparkles,
  Baby,
  GraduationCap,
  BookOpen,
  Volume2,
  Hourglass,
  Layers,
  ChevronRight,
  TrendingUp,
  Flame,
  ShieldAlert,
  ArrowRight,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { Language } from '../../types';
import { GRADE_PEDAGOGY_MAP, GradePedagogyAdvice } from '../../data/gradePedagogyData';
import { PRACTICE_GRADES } from '../../data/practiceData';

interface GradePedagogySectionProps {
  lang: Language;
  selectedGradeId?: string;
  onSelectGradeId?: (gradeId: string) => void;
  onExploreSubjects?: (gradeId: string) => void;
}

export const GradePedagogySection: React.FC<GradePedagogySectionProps> = ({
  lang,
  selectedGradeId = 'grade-1',
  onSelectGradeId,
  onExploreSubjects
}) => {
  const [currentGradeId, setCurrentGradeId] = useState<string>(selectedGradeId || 'grade-1');
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  // Sync with prop if it changes
  React.useEffect(() => {
    if (selectedGradeId && selectedGradeId !== currentGradeId) {
      setCurrentGradeId(selectedGradeId);
    }
  }, [selectedGradeId]);

  const handleSelectGrade = (id: string) => {
    setCurrentGradeId(id);
    if (onSelectGradeId) {
      onSelectGradeId(id);
    }
  };

  const advice: GradePedagogyAdvice =
    GRADE_PEDAGOGY_MAP[currentGradeId] || GRADE_PEDAGOGY_MAP['grade-1'];

  const handleCopySection = (cardKey: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedCardId(cardKey);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  // Age group specific SVG Illustration
  const renderIllustration = (theme: GradePedagogyAdvice['illustrationTheme']) => {
    switch (theme) {
      case 'kindergarten':
        return (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center bg-rose-50 border-2 border-rose-200/80 rounded-3xl p-3 shadow-inner">
            <svg viewBox="0 0 120 120" className="w-full h-full text-rose-500" fill="none">
              {/* Sun */}
              <circle cx="28" cy="28" r="14" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
              <path d="M28 8v4M28 44v4M8 28h4M44 28h4" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
              {/* Toy blocks */}
              <rect x="22" y="70" width="30" height="30" rx="6" fill="#10B981" />
              <text x="37" y="90" fontSize="16" fontWeight="bold" fill="#ffffff" textAnchor="middle" dominantBaseline="middle">A</text>
              <rect x="58" y="70" width="30" height="30" rx="6" fill="#3B82F6" />
              <text x="73" y="90" fontSize="16" fontWeight="bold" fill="#ffffff" textAnchor="middle" dominantBaseline="middle">1</text>
              <rect x="40" y="38" width="30" height="30" rx="6" fill="#F43F5E" />
              <text x="55" y="58" fontSize="16" fontWeight="bold" fill="#ffffff" textAnchor="middle" dominantBaseline="middle">★</text>
              {/* Little plant/flower */}
              <path d="M96 98c0-12-8-18-8-18s-8 6-8 18" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
              <circle cx="88" cy="74" r="6" fill="#FB7185" />
            </svg>
          </div>
        );

      case 'primary':
        return (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center bg-emerald-50 border-2 border-emerald-200/80 rounded-3xl p-3 shadow-inner">
            <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
              {/* Backpack & Books */}
              <rect x="32" y="44" width="56" height="54" rx="14" fill="#16A34A" stroke="#15803D" strokeWidth="2" />
              <rect x="44" y="60" width="32" height="24" rx="6" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
              <path d="M48 44V32a12 12 0 0 1 24 0v12" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
              {/* Pencil */}
              <path d="M88 24l12 12-44 44-12-12 44-44z" fill="#F59E0B" />
              <polygon points="44,80 40,92 52,88" fill="#1E293B" />
              {/* Apple */}
              <circle cx="28" cy="84" r="12" fill="#EF4444" />
              <path d="M28 72c2-4 6-4 6-4" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
              {/* Stars */}
              <path d="M20 32l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#FACC15" />
            </svg>
          </div>
        );

      case 'middle':
        return (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center bg-blue-50 border-2 border-blue-200/80 rounded-3xl p-3 shadow-inner">
            <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
              {/* Flask & Microscope / Science */}
              <path d="M48 30h24M60 30v26l22 36a6 6 0 0 1-5 9H43a6 6 0 0 1-5-9l22-36V30" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="#EFF6FF" />
              <path d="M45 84c8 3 22-3 30 0v9a4 4 0 0 1-4 4H49a4 4 0 0 1-4-4v-9z" fill="#3B82F6" />
              <circle cx="56" cy="74" r="2.5" fill="#93C5FD" />
              <circle cx="64" cy="80" r="3" fill="#93C5FD" />
              {/* Atom / Orbit */}
              <ellipse cx="60" cy="62" rx="46" ry="14" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 2" transform="rotate(-30 60 62)" />
              <circle cx="92" cy="46" r="4" fill="#10B981" />
              {/* Gear */}
              <circle cx="96" cy="88" r="8" stroke="#F59E0B" strokeWidth="2.5" />
            </svg>
          </div>
        );

      case 'high':
      default:
        return (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center bg-emerald-50 border-2 border-emerald-300/80 rounded-3xl p-3 shadow-inner">
            <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
              {/* Graduation Cap & University Scroll */}
              <polygon points="60,22 104,40 60,58 16,40" fill="#047857" stroke="#065F46" strokeWidth="2" />
              <path d="M34 50v22c0 14 26 18 26 18s26-4 26-18V50" stroke="#047857" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M96 44v32" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="96" cy="78" r="4" fill="#EAB308" />
              {/* Diploma Scroll */}
              <rect x="24" y="86" width="72" height="14" rx="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
              <rect x="55" y="84" width="10" height="18" rx="2" fill="#DC2626" />
              {/* Rocket or Target */}
              <path d="M88 20l4 8-8-4z" fill="#059669" />
            </svg>
          </div>
        );
    }
  };

  return (
    <section id="grade-pedagogy-module" className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/50 via-teal-50/20 to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wide">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Жаш өзгөчөлүгү жана методикалык жардам</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {advice.gradeLabelKy}: Педагогикалык жана методикалык колдонмо
            </h2>

            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              Ар бир класстын психо-физиологиялык портрети, мугалим үчүн практикалык кеңештер, көп кетирилүүчү каталар, классты башкаруу жана мотивация берүүнүн натыйжалуу инфографикасы.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {renderIllustration(advice.illustrationTheme)}
            <div className="space-y-1 text-xs">
              <span className="font-extrabold text-slate-900 block text-sm">{advice.stageTitleKy}</span>
              <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-200">
                Курагы: {advice.ageRangeKy}
              </span>
              <span className="text-slate-500 block pt-1">
                Фокус: 8 Негизги багыт
              </span>
            </div>
          </div>
        </div>

        {/* Grade Selector Pills Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Классты тандаңыз:
            </span>
            <span className="text-[11px] text-slate-500">
              Бала бакчадан 11-класска чейин (12 курактык топ)
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {PRACTICE_GRADES.map((g) => {
              const isSelected = g.id === currentGradeId;
              return (
                <button
                  key={g.id}
                  id={`pedagogy-grade-pill-${g.id}`}
                  onClick={() => handleSelectGrade(g.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105'
                      : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200/80'
                  }`}
                >
                  {g.id === 'kindergarten' ? (
                    <Baby className="w-3.5 h-3.5" />
                  ) : (
                    <span>{g.labelKy.split('-')[0]}</span>
                  )}
                  <span>{g.id === 'kindergarten' ? 'Садик' : `${g.labelKy.split('-')[0]}-кл`}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 8 PEDAGOGICAL CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: Жаш өзгөчөлүгү */}
        <div
          id="card-1-characteristics"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                    1-бөлүк • Портрет
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Жаш өзгөчөлүгү
                  </h3>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopySection(
                    'card1',
                    `Жаш өзгөчөлүгү (${advice.gradeLabelKy}):\n` +
                      advice.characteristics.psychological.join('\n')
                  )
                }
                title="Көчүрүп алуу"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              >
                {copiedCardId === 'card1' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Infographic 1: Attention Span & Energy Level */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {advice.characteristics.infographic.label}
                </span>
                <span className="text-emerald-800 font-extrabold">
                  {advice.characteristics.infographic.value}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${advice.characteristics.infographic.percentage}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 block font-medium">
                💡 {advice.characteristics.infographic.badgeText}
              </span>
            </div>

            {/* Content Lists */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                  Психологиялык өзгөчөлүгү:
                </span>
                <ul className="space-y-1 text-slate-600 pl-3">
                  {advice.characteristics.psychological.map((item, i) => (
                    <li key={i} className="list-disc leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                  Физиологиялык өзгөчөлүгү:
                </span>
                <ul className="space-y-1 text-slate-600 pl-3">
                  {advice.characteristics.physiological.map((item, i) => (
                    <li key={i} className="list-disc leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                  Окуу жана кабыл алуу өзгөчөлүгү:
                </span>
                <ul className="space-y-1 text-slate-600 pl-3">
                  {advice.characteristics.learning.map((item, i) => (
                    <li key={i} className="list-disc leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Мугалим эмнеге көңүл бурушу керек */}
        <div
          id="card-2-teacher-focus"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shadow-xs">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider">
                    2-бөлүк • Фокус
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Мугалим эмнеге көңүл бурушу керек
                  </h3>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopySection(
                    'card2',
                    advice.teacherFocus.keyPriorities.join('\n')
                  )
                }
                title="Көчүрүп алуу"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              >
                {copiedCardId === 'card2' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Infographic 2: Focus Ratio Indicator */}
            <div className="bg-teal-50/60 p-3.5 rounded-2xl border border-teal-100 mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-teal-950 mb-1">
                <span>{advice.teacherFocus.infographic.ruleTitle}</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-200/80 text-teal-900 text-[11px]">
                  {advice.teacherFocus.infographic.ratio}
                </span>
              </div>
              <p className="text-xs text-teal-900/80">
                {advice.teacherFocus.infographic.ruleDesc}
              </p>
            </div>

            {/* Priorities */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-800 block mb-1.5">
                  Башкы педагогикалык приоритеттер:
                </span>
                <div className="space-y-1.5">
                  {advice.teacherFocus.keyPriorities.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">
                  Кооптуу белгилер (Дароо көңүл буруңуз):
                </span>
                <div className="space-y-1">
                  {advice.teacherFocus.dangerSignals.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-600">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700">
                <span className="font-bold text-slate-800 block mb-0.5">Педагогикалык тон:</span>
                <p className="italic text-[11px] leading-relaxed">«{advice.teacherFocus.pedagogicalTuning}»</p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Натыйжалуу окутуу усулдары */}
        <div
          id="card-3-effective-methods"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-xs">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">
                    3-бөлүк • Методика
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Натыйжалуу окутуу усулдары
                  </h3>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopySection(
                    'card3',
                    advice.effectiveMethods.methods.map((m) => `${m.name}: ${m.desc}`).join('\n')
                  )
                }
                title="Көчүрүп алуу"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              >
                {copiedCardId === 'card3' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Infographic 3: Efficiency & Visual Type */}
            <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/60 mb-4 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-amber-800 font-bold block text-[11px]">Сунушталган формат:</span>
                <span className="font-extrabold text-amber-950 text-xs">{advice.effectiveMethods.infographic.visualType}</span>
              </div>
              <div className="text-right">
                <span className="text-amber-800 font-bold block text-[11px]">Эффективдүүлүк:</span>
                <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-sm">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {advice.effectiveMethods.infographic.efficiencyScore}
                </span>
              </div>
            </div>

            {/* Methods list */}
            <div className="space-y-2.5 text-xs mb-3">
              {advice.effectiveMethods.methods.map((method, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors">
                  <span className="font-extrabold text-slate-900 block mb-0.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {method.name}
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{method.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-600 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
              <span className="font-bold text-emerald-900">Методикалык кеңеш: </span>
              {advice.effectiveMethods.infographic.recommendation}
            </div>
          </div>
        </div>

        {/* CARD 4: Практикадагы кеңештер */}
        <div
          id="card-4-practice-tips"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                    4-бөлүк • Кеңештер
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Практикадагы кеңештер
                  </h3>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopySection(
                    'card4',
                    `Кылсаңыз болот:\n` + advice.practiceTips.dos.join('\n') + `\nКылбаңыз:\n` + advice.practiceTips.donts.join('\n')
                  )
                }
                title="Көчүрүп алуу"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              >
                {copiedCardId === 'card4' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Infographic 4: Readiness Checklist */}
            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/70 mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-2">
                <span>Сабакка даярдык чек-листи:</span>
                <span className="text-emerald-700">{advice.practiceTips.infographic.completionRate}</span>
              </div>
              <div className="grid grid-cols-1 gap-1 text-[11px]">
                {advice.practiceTips.infographic.checklistItems.map((chk, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-emerald-900">
                    <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>{chk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dos and Don'ts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-emerald-50/40 p-3 rounded-2xl border border-emerald-100">
                <span className="font-bold text-emerald-900 block mb-1.5 flex items-center gap-1">
                  <span className="text-emerald-600 font-extrabold">✓</span> Кылсаңыз болот (DO):
                </span>
                <ul className="space-y-1 text-slate-700 text-[11px]">
                  {advice.practiceTips.dos.map((item, i) => (
                    <li key={i} className="leading-relaxed">• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/40 p-3 rounded-2xl border border-rose-100">
                <span className="font-bold text-rose-900 block mb-1.5 flex items-center gap-1">
                  <span className="text-rose-600 font-extrabold">✕</span> Кылбаңыз (DON'T):
                </span>
                <ul className="space-y-1 text-slate-700 text-[11px]">
                  {advice.practiceTips.donts.map((item, i) => (
                    <li key={i} className="leading-relaxed">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs italic">
              {advice.practiceTips.mentorQuote}
            </div>
          </div>
        </div>

        {/* CARD 5: Көп кетирилген каталар */}
        <div
          id="card-5-common-mistakes"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-rose-300 hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-rose-800 uppercase tracking-wider">
                    5-бөлүк • Алдын алуу
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Көп кетирилген каталар
                  </h3>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopySection(
                    'card5',
                    advice.commonMistakes.mistakes.map((m) => `Ката: ${m.mistake}\nЧечим: ${m.solution}`).join('\n\n')
                  )
                }
                title="Көчүрүп алуу"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              >
                {copiedCardId === 'card5' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Infographic 5: Risk Indicator */}
            <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200 mb-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] font-bold text-rose-800 block">Башкы тобокелдик фактору:</span>
                <span className="font-extrabold text-rose-950 text-xs">{advice.commonMistakes.infographic.topRiskFactor}</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold text-[11px]">
                {advice.commonMistakes.infographic.frequencyMetric}
              </span>
            </div>

            {/* Mistakes with Solutions */}
            <div className="space-y-3 text-xs">
              {advice.commonMistakes.mistakes.map((m, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">!</span>
                    <span className="font-bold text-slate-900 leading-snug">{m.mistake}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">
                    <span className="font-semibold text-rose-700">Кесепети: </span>{m.consequence}
                  </p>
                  <p className="text-[11px] text-emerald-800 bg-emerald-50/60 p-2 rounded-lg pl-3 border border-emerald-100 font-medium">
                    <span className="font-bold text-emerald-900">Туура чечим: </span>{m.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 6: Классты башкаруу боюнча сунуштар */}
        <div
          id="card-6-classroom-management"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wider">
                    6-бөлүк • Дисциплина
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Классты башкаруу боюнча сунуштар
                  </h3>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopySection(
                    'card6',
                    advice.classroomManagement.rules.join('\n') + `\nШыбыроо: ` + advice.classroomManagement.noiseControlTechnique
                  )
                }
                title="Көчүрүп алуу"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              >
                {copiedCardId === 'card6' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Infographic 6: Decibel & Noise Control */}
            <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 mb-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[11px] font-bold text-blue-900 block">Үн режими:</span>
                  <span className="font-extrabold text-slate-800 text-xs">{advice.classroomManagement.infographic.noiseLevelMaxDb}</span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-blue-800 bg-blue-100 px-2 py-1 rounded-lg">
                {advice.classroomManagement.infographic.disciplineStrategy}
              </span>
            </div>

            {/* Rules & Seating */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-800 block mb-1.5">
                  Алтын эрежелер:
                </span>
                <div className="space-y-1.5">
                  {advice.classroomManagement.rules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-slate-700 leading-relaxed font-medium">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Отургузуу схемасы:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">{advice.classroomManagement.seatingPlanAdvice}</p>
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-900 block text-[11px]">Тынчтыкты орнотуу техникасы:</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">{advice.classroomManagement.noiseControlTechnique}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 7: Мотивация берүү ыкмалары */}
        <div
          id="card-7-motivation"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                    7-бөлүк • Дем берүү
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Мотивация берүү ыкмалары
                  </h3>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopySection(
                    'card7',
                    advice.motivationStrategies.techniques.join('\n') + `\nСыйлык: ` + advice.motivationStrategies.praiseFormula
                  )
                }
                title="Көчүрүп алуу"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              >
                {copiedCardId === 'card7' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Infographic 7: Intrinsic vs Extrinsic Motivation ratio */}
            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-900">{advice.motivationStrategies.infographic.intrinsicRatio}</span>
                <span className="text-slate-500">{advice.motivationStrategies.infographic.extrinsicRatio}</span>
              </div>
              {/* Dual Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
                <div className="bg-emerald-600 h-2.5 w-[75%]" />
                <div className="bg-amber-400 h-2.5 w-[25%]" />
              </div>
              <span className="text-[11px] text-slate-600 block">
                Башкы триггер: <strong className="text-slate-800">{advice.motivationStrategies.infographic.keyTrigger}</strong>
              </span>
            </div>

            {/* Motivation techniques */}
            <div className="space-y-3 text-xs mb-3">
              <div>
                <span className="font-bold text-slate-800 block mb-1.5">
                  Сунушталган ыкмалар:
                </span>
                <div className="space-y-1.5">
                  {advice.motivationStrategies.techniques.map((tech, i) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-relaxed">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1 text-[11px]">Сыйлоо системасы:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">{advice.motivationStrategies.rewardSystem}</p>
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                <span className="font-bold text-emerald-900 block mb-1 text-[11px]">Туура мактоо формуласы:</span>
                <p className="text-slate-800 text-[11px] italic leading-relaxed">«{advice.motivationStrategies.praiseFormula}»</p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 8: Сабакты баштоо жана аяктоо идеялары */}
        <div
          id="card-8-hooks-closures"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shadow-xs">
                  <Hourglass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider">
                    8-бөлүк • Этаптар
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Сабакты баштоо жана аяктоо идеялары
                  </h3>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopySection(
                    'card8',
                    advice.lessonHooksAndClosures.openings.map((o) => `Баштоо: ${o.name} - ${o.description}`).join('\n') +
                      `\n` +
                      advice.lessonHooksAndClosures.closings.map((c) => `Аяктоо: ${c.name} - ${c.description}`).join('\n')
                  )
                }
                title="Көчүрүп алуу"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              >
                {copiedCardId === 'card8' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Infographic 8: Golden minutes & Retention Boost */}
            <div className="bg-teal-50/60 p-3.5 rounded-2xl border border-teal-100 mb-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] font-bold text-teal-900 block">Алтын убакыт:</span>
                <span className="font-extrabold text-slate-800 text-xs">
                  Башы: {advice.lessonHooksAndClosures.infographic.goldenOpeningMin} | Аягы: {advice.lessonHooksAndClosures.infographic.goldenExitMin}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {advice.lessonHooksAndClosures.infographic.retentionBoost}
              </span>
            </div>

            {/* Openings (Hooks) */}
            <div className="space-y-3 text-xs mb-3">
              <div>
                <span className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  Сабакты баштоо идеялары (Hook):
                </span>
                <div className="space-y-1.5">
                  {advice.lessonHooksAndClosures.openings.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900">{item.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{item.duration}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Closures */}
              <div>
                <span className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Сабакты аяктоо жана рефлексия (Closure):
                </span>
                <div className="space-y-1.5">
                  {advice.lessonHooksAndClosures.closings.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900">{item.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{item.duration}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer to jump to subjects of this grade */}
      {onExploreSubjects && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-emerald-950">
            <BookOpen className="w-6 h-6 text-emerald-700 shrink-0" />
            <div>
              <span className="font-extrabold text-sm block">
                {advice.gradeLabelKy} боюнча сабактарды ачуу
              </span>
              <span className="text-emerald-800">
                Бул куракка ылайыкталган даяр поурочный пландарды жана 8 табдуу иштелмелерди көрүңүз.
              </span>
            </div>
          </div>

          <button
            onClick={() => onExploreSubjects(currentGradeId)}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <span>{advice.gradeLabelKy} сабактарына өтүү</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
