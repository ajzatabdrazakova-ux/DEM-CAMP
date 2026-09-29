import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Lightbulb,
  FileCheck,
  Video,
  FlaskConical,
  Bot,
  ChevronRight,
  Sparkles,
  MessageSquarePlus,
  ExternalLink,
  Award,
  Microscope
} from 'lucide-react';
import { Language } from '../../types';

export type PracticeSectionId =
  | 'grades'
  | 'subjects'
  | 'methodology'
  | 'documents'
  | 'media'
  | 'virtual-lab'
  | 'ai-assistant'
  | 'student-feedback';

interface PracticeSidebarProps {
  lang: Language;
  activeSection: PracticeSectionId;
  onSelectSection: (section: PracticeSectionId) => void;
  selectedSubjectName?: string;
}

export const PracticeSidebar: React.FC<PracticeSidebarProps> = ({
  lang,
  activeSection,
  onSelectSection,
  selectedSubjectName
}) => {
  const menuItems = [
    {
      id: 'grades' as PracticeSectionId,
      labelKy: 'Жаш өзгөчөлүгү & Класстар',
      labelRu: 'Возрастные особенности',
      icon: GraduationCap,
      badge: '8 карточка',
      descKy: '1–11-класс жана садик'
    },
    {
      id: 'subjects' as PracticeSectionId,
      labelKy: 'Предметтер',
      labelRu: 'Предметы',
      icon: BookOpen,
      badge: '10 сабак',
      descKy: selectedSubjectName || '8 табдуу иштелмелер'
    },
    {
      id: 'methodology' as PracticeSectionId,
      labelKy: 'Методикалык жардам',
      labelRu: 'Методическая помощь',
      icon: Lightbulb,
      badge: 'STEAM/PISA',
      descKy: '7 алдыңкы технология'
    },
    {
      id: 'documents' as PracticeSectionId,
      labelKy: 'Практика документтери',
      labelRu: 'Документы практики',
      icon: FileCheck,
      badge: '5 шаблон',
      descKy: 'Күндөлүк, план, отчет'
    },
    {
      id: 'media' as PracticeSectionId,
      labelKy: 'Видео жана презентациялар',
      labelRu: 'Видео и презентации',
      icon: Video,
      badge: 'Слайддар',
      descKy: 'Дидактикалык медиа'
    },
    {
      id: 'virtual-lab' as PracticeSectionId,
      labelKy: 'Виртуалдык лаборатория',
      labelRu: 'Виртуальная лаборатория',
      icon: FlaskConical,
      badge: '3D Тажрыйба',
      descKy: 'Биология жана Химия'
    },
    {
      id: 'ai-assistant' as PracticeSectionId,
      labelKy: 'AI Сабак жардамчысы',
      labelRu: 'AI Помощник урока',
      icon: Bot,
      badge: 'AI Генератор',
      descKy: 'Даяр сабак түзүү',
      isHighlight: true
    },
    {
      id: 'student-feedback' as PracticeSectionId,
      labelKy: 'Студенттик отзыв & сунуш',
      labelRu: 'Отзывы и предложения',
      icon: MessageSquarePlus,
      badge: 'Ф.И.О & Группа',
      descKy: 'Пикир жана сунуш калтыруу'
    }
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white rounded-3xl p-4 border border-slate-200/80 shadow-md">
      {/* Sidebar Header */}
      <div className="px-3 py-2 mb-3 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-black tracking-wider uppercase text-emerald-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {lang === 'ky' ? 'Практика Менюсу' : 'Меню практики'}
        </span>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          DEM Hub
        </span>
      </div>

      {/* Menu List */}
      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`practice-sidebar-item-${item.id}`}
              onClick={() => onSelectSection(item.id)}
              className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20'
                  : item.isHighlight
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-900 border border-emerald-200/60 hover:border-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.isHighlight
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-emerald-700 group-hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs truncate">
                      {lang === 'ky' ? item.labelKy : item.labelRu}
                    </span>
                    {item.isHighlight && !isActive && (
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <span
                    className={`block text-[11px] truncate ${
                      isActive ? 'text-emerald-100' : 'text-slate-600'
                    }`}
                  >
                    {item.descKy}
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-white translate-x-0.5' : 'text-slate-600 group-hover:text-slate-600'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* STEM Education State Portal for Trainees */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 text-white shadow-md border border-cyan-500/40 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Microscope className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <span className="font-extrabold text-xs block text-white leading-tight">
                КР STEM Порталы
              </span>
              <span className="text-[10px] text-cyan-300">
                stem.edu.gov.kg
              </span>
            </div>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-200 uppercase tracking-wider">
            STEM
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-snug">
          Виртуалдык лабораториялар, эксперименттер жана STEM сабак иштелмелери.
        </p>

        <a
          id="link-sidebar-stem"
          href="https://stem.edu.gov.kg"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group"
        >
          <span>stem.edu.gov.kg</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* KAO PISA Functional Literacy Portal for Trainees */}
      <div className="mt-2.5 p-3.5 rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-stone-950 text-white shadow-md border border-amber-500/40 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <span className="font-extrabold text-xs block text-white leading-tight">
                КАО PISA Сабаттуулук
              </span>
              <span className="text-[10px] text-amber-300">
                kao.kg/pisa
              </span>
            </div>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 uppercase tracking-wider">
            PISA
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-snug">
          Окуучулардын функционалдык сабаттуулугун өстүрүүчү тесттер жана усулдук колдонмолор.
        </p>

        <a
          id="link-sidebar-kao-pisa"
          href="https://kao.kg/pisa/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group"
        >
          <span>kao.kg/pisa сайтына өтүү</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* RIPK.KG Professional Development Portal for Trainees */}
      <div className="mt-2.5 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-md border border-emerald-700/50 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <span className="font-extrabold text-xs block text-white leading-tight">
                РИПК жана КДПИ
              </span>
              <span className="text-[10px] text-emerald-300">
                ripk.kg • Квалификация
              </span>
            </div>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 uppercase tracking-wider">
            КР ББИМ
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-snug">
          Мамлекеттик стандарттар жана квалификация курстарынын расмий базасы.
        </p>

        <a
          id="link-sidebar-ripk"
          href="https://ripk.kg"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs group"
        >
          <span>ripk.kg сайтына өтүү</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* Mini Assistant Quick Callout */}
      <div className="mt-3.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-950 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
          <GraduationCap className="w-4 h-4 text-emerald-700" />
          <span>Методисттин эскертүүсү</span>
        </div>
        <p className="text-[11px] text-emerald-700 leading-relaxed">
          Сабактын конспектисин күн мурунтан мектептеги жетекчи мугалимге кол койдуруп бекитүүнү унутпаңыз.
        </p>
      </div>
    </aside>
  );
};
