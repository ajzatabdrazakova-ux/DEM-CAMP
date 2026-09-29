import React, { useState } from 'react';
import {
  FileCheck,
  Download,
  Copy,
  Check,
  Printer,
  FileText,
  Calendar,
  Eye,
  CheckCircle2,
  FileSpreadsheet,
  ExternalLink,
  Award,
  BookOpen,
  GraduationCap,
  Sparkles,
  Microscope,
  Cpu
} from 'lucide-react';
import { Language } from '../../types';
import { PRACTICE_DOCUMENTS, PracticeDocumentTemplate } from '../../data/practiceHubData';

interface DocumentsViewProps {
  lang: Language;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ lang }) => {
  const [selectedDoc, setSelectedDoc] = useState<PracticeDocumentTemplate | null>(PRACTICE_DOCUMENTS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyDoc = (doc: PracticeDocumentTemplate) => {
    navigator.clipboard.writeText(doc.sampleContentKy);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Расмий шаблондор жана бланктар</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Практика документтеринин жыйнагы
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            ОшМПУнун Педагогикалык практика жобосуна жана КР Билим берүү стандартына ылайык бекитилген 5 расмий документтин даяр шаблондору.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <a
            id="quick-link-header-stem"
            href="https://stem.edu.gov.kg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-900 to-indigo-950 text-cyan-200 border border-cyan-500/40 px-3.5 py-2.5 rounded-2xl text-xs hover:border-cyan-400 hover:text-white transition-all shadow-xs group cursor-pointer"
          >
            <Microscope className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="font-bold block text-white text-xs leading-tight">stem.edu.gov.kg</span>
              <span className="text-[10px] text-cyan-300/80">КР STEM</span>
            </div>
            <ExternalLink className="w-3 h-3 ml-1 text-cyan-400" />
          </a>

          <a
            id="quick-link-header-kao-pisa"
            href="https://kao.kg/pisa/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-900 to-stone-950 text-amber-200 border border-amber-500/40 px-3.5 py-2.5 rounded-2xl text-xs hover:border-amber-400 hover:text-white transition-all shadow-xs group cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="font-bold block text-white text-xs leading-tight">kao.kg/pisa</span>
              <span className="text-[10px] text-amber-300/80">КАО PISA Сабаттуулук</span>
            </div>
            <ExternalLink className="w-3 h-3 ml-1 text-amber-400" />
          </a>

          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200/60 p-2.5 px-3 rounded-2xl">
            <FileSpreadsheet className="w-6 h-6 text-emerald-700 shrink-0" />
            <div className="text-xs text-emerald-950">
              <span className="font-bold block">5 Негизги бланк</span>
              <span className="text-emerald-700 text-[10px]">DOCX & PDF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of the 5 Document Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PRACTICE_DOCUMENTS.map((doc) => {
          const isSelected = selectedDoc?.id === doc.id;

          return (
            <div
              key={doc.id}
              id={`doc-card-${doc.id}`}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-emerald-300 hover:shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {doc.format} • {doc.pages} бет
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  {lang === 'ky' ? doc.titleKy : doc.titleRu}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal mb-4">
                  {lang === 'ky' ? doc.descriptionKy : doc.descriptionRu}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  id={`btn-view-doc-${doc.id}`}
                  onClick={() => setSelectedDoc(doc)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Бланкты көрүү жана толтуруу</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Document Interactive Preview & Actions */}
      {selectedDoc && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Тандалган документ
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {lang === 'ky' ? selectedDoc.titleKy : selectedDoc.titleRu}
              </h3>
              <p className="text-xs text-slate-500">
                ОшМПУ Стандарты • {selectedDoc.format}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-copy-document-text"
                onClick={() => handleCopyDoc(selectedDoc)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                {copiedId === selectedDoc.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === selectedDoc.id ? 'Көчүрүлдү!' : 'Шаблонду көчүрүү'}</span>
              </button>

              <button
                id="btn-print-document"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Басып чыгаруу (Print)</span>
              </button>
            </div>
          </div>

          {/* Document Content Sheet */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/90 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap shadow-inner overflow-x-auto">
            {selectedDoc.sampleContentKy}
          </div>
        </div>
      )}

      {/* Official State STEM Education Portal: https://stem.edu.gov.kg */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 rounded-3xl p-6 sm:p-8 text-white border border-cyan-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold">
                <Microscope className="w-3.5 h-3.5 text-cyan-400" />
                <span>КР Билим берүү жана илим министрлиги • STEM порталы</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Инновациялык билим берүү
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>КР Мамлекеттик STEM Билим берүү порталы</span>
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Педагогикалык практикадагы практиканттардын илим, технология, инженерия жана математика (STEM) багытындагы заманбап окутуу ресурстары, санариптик лабораториялар, интерактивдүү симуляциялар жана методикалык колдонмолор менен таанышуусу үчүн расмий мамлекеттик ресурс.
            </p>

            {/* STEM Components Grid */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-colors">
                <span className="font-bold text-cyan-300 block mb-1 flex items-center gap-1.5">
                  <Microscope className="w-4 h-4 text-cyan-400" />
                  <span>Илим & Табият (Science)</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Физика, химия, биология боюнча виртуалдык тажрыйбалар жана лабораториялык иштер
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-colors">
                <span className="font-bold text-cyan-300 block mb-1 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Технология & IT (Technology)</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Информатика, робототехника, санариптик көндүмдөр жана программалоо сабактары
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-colors">
                <span className="font-bold text-cyan-300 block mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Инженерия & Математика</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Интеграцияланган сабактардын пландары, долбоордук иштер жана STEM колдонмолору
                </span>
              </div>
            </div>
          </div>

          {/* Direct Link CTA */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3">
            <a
              id="btn-open-stem-portal"
              href="https://stem.edu.gov.kg"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 group cursor-pointer"
            >
              <span>stem.edu.gov.kg сайтына өтүү</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <span className="text-[11px] text-cyan-300/80 text-center font-mono">
              https://stem.edu.gov.kg
            </span>
          </div>
        </div>
      </div>

      {/* Official State PISA & Functional Literacy Portal: https://kao.kg/pisa/ */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-stone-950 rounded-3xl p-6 sm:p-8 text-white border border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>КР Билим берүү жана илим министрлиги • Кыргыз билим берүү академиясы (КАО)</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/30 uppercase tracking-wider">
                PISA 2025 / 2026
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>КАО — PISA Эл аралык изилдөөсү жана функционалдык сабаттуулук</span>
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Педагогикалык практикага чыккан студенттер үчүн окуучулардын функционалдык сабаттуулугун калыптандыруу боюнча үлгү тапшырмалар, баалоо критерийлери, тесттер жана методикалык басылмалардын расмий улуттук жыйнагы.
            </p>

            {/* PISA Literacy Components */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors">
                <span className="font-bold text-amber-300 block mb-1">📖 Окуу сабаттуулугу</span>
                <span className="text-[11px] text-slate-400">
                  Текстти түшүнүү, ой жүгүртүү, тексттин мазмунун жана формасын баалоо боюнча көнүгүүлөр
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors">
                <span className="font-bold text-amber-300 block mb-1">🔢 Математикалык сабаттуулук</span>
                <span className="text-[11px] text-slate-400">
                  Реалдуу турмуштук жагдайларды математикалык тилде моделдөө жана чечмелөө тапшырмалары
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors">
                <span className="font-bold text-amber-300 block mb-1">🔬 Табигый-илимий сабаттуулук</span>
                <span className="text-[11px] text-slate-400">
                  Кубулуштарды илимий негизде түшүндүрүү, далилдерди талдоо жана жыйынтык чыгаруу
                </span>
              </div>
            </div>
          </div>

          {/* Direct Link CTA */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3">
            <a
              id="btn-open-kao-pisa-portal"
              href="https://kao.kg/pisa/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 group cursor-pointer"
            >
              <span>kao.kg/pisa сайтына өтүү</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <span className="text-[11px] text-amber-300/80 text-center font-mono">
              https://kao.kg/pisa/
            </span>
          </div>
        </div>
      </div>

      {/* Official State Pedagogical Qualification Portal: RIPK.KG */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-700/40 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>КР Билим берүү жана илим министрлиги • Расмий өнөктөш</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              РИПК жана КДПИ — Мугалимдердин квалификациясын жогорулатуу институту
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Практикант-студенттер азыртан мамлекеттик деңгээлдеги педагогикалык стандарттар, жаңыланган окуу программалары, усулдук колдонмолор жана квалификацияны жогорулатуу курстары менен таанышып, билимин тереңдетүүсү үчүн сунушталат.
            </p>

            {/* 3 Trainee Benefit Pillars */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block mb-1">📚 Мамлекеттик стандарттар</span>
                <span className="text-[11px] text-slate-400">Жаңы билим берүү стандарттары жана компетенттүүлүк талаптары</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block mb-1">🎓 Квалификация курстары</span>
                <span className="text-[11px] text-slate-400">Мугалимдер үчүн расмий онлайн жана офлайн курстардын каталогу</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block mb-1">📖 Усулдук китепкана</span>
                <span className="text-[11px] text-slate-400">Республикалык мыкты мугалимдердин сабак иштелмелери</span>
              </div>
            </div>
          </div>

          {/* Direct CTA Link to ripk.kg */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3">
            <a
              id="btn-open-ripk-portal"
              href="https://ripk.kg"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 group cursor-pointer"
            >
              <span>ripk.kg сайтына өтүү</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <span className="text-[11px] text-slate-400 text-center font-mono">
              https://ripk.kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
