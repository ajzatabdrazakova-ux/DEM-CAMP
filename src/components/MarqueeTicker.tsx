import React, { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Play, 
  Pause, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Calendar, 
  BookOpen, 
  Clock, 
  UserCheck, 
  MapPin 
} from 'lucide-react';
import { Language, ActiveTab } from '../types';

interface MarqueeTickerProps {
  lang: Language;
  setActiveTab: (tab: ActiveTab) => void;
}

interface TickerItem {
  id: string;
  tagKy: string;
  tagRu: string;
  tagEn: string;
  textKy: string;
  textRu: string;
  textEn: string;
  targetTab: ActiveTab;
  tagColor: string;
  icon: React.ElementType;
}

const TICKER_ITEMS: TickerItem[] = [
  {
    id: 'res-center',
    tagKy: 'РЕСУРСТАР БОРБОРУ',
    tagRu: 'ЦЕНТР РЕСУРСОВ',
    tagEn: 'RESOURCE CENTER',
    textKy: 'ЖАҢЫ: ЖРТ, PISA жана STEAM боюнча 150+ видеолекция, методика жана PDF колдонмолор ачылды!',
    textRu: 'НОВОЕ: Открыта цифровая база из 150+ видеолекций, методичек и PDF по ОРТ, PISA и STEAM!',
    textEn: 'NEW: 150+ video lectures, academic guides, and PDFs for ORT, PISA, and STEAM now live!',
    targetTab: 'resource-center',
    tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    icon: BookOpen,
  },
  {
    id: 'we-heard',
    tagKy: 'ЧЕЧИЛГЕН МАСЕЛЕ',
    tagRu: 'РЕШЕНО',
    tagEn: 'RESOLVED CASE',
    textKy: 'Тикет #KOP-4821: Студенттердин сунушу боюнча китепкана жана коворкинг 23:00гө чейин узартылды!',
    textRu: 'Тикет #KOP-4821: По предложению студентов график библиотеки и коворкинга продлен до 23:00!',
    textEn: 'Ticket #KOP-4821: Student coworking & study hall hours extended until 23:00 per student request!',
    targetTab: 'we-heard',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    icon: CheckCircle2,
  },
  {
    id: 'start-together',
    tagKy: 'АДАПТАЦИЯ',
    tagRu: 'АДАПТАЦИЯ',
    tagEn: 'ORIENTATION',
    textKy: '«Старт бирге» жумалыгы: Окутуучулар менен бейформал жолугушуулар жана күтүүлөр тактасы ачык!',
    textRu: 'Неделя «Старт вместе»: Неформальные встречи с преподавателями и доска ожиданий открыты!',
    textEn: '«Start Together» Week: Informal meetups with faculty and the expectations wall are open!',
    targetTab: 'start-together',
    tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    icon: Calendar,
  },
  {
    id: 'office-hours',
    tagKy: 'АЧЫК СААТТАР',
    tagRu: 'ОТКРЫТЫЕ ЧАСЫ',
    tagEn: 'OFFICE HOURS',
    textKy: 'Бүгүн 14:00дөн 17:00гө чейин окутуучулардын жеке консультациялык сааттары жүрөт — слот брондоңуз.',
    textRu: 'Сегодня с 14:00 до 17:00 открыты индивидуальные консультации преподавателей — забронируйте слот.',
    textEn: 'Faculty individual consultation slots are open today from 14:00 to 17:00 — reserve your slot.',
    targetTab: 'office-hours',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    icon: Clock,
  },
  {
    id: 'campus-map',
    tagKy: '3D НАВИГАЦИЯ',
    tagRu: '3D НАВИГАЦИЯ',
    tagEn: '3D NAVIGATION',
    textKy: 'Кампус картасы: Аудиторияларды, коворкингди жана Ишеним кутуларынын чекиттерин интерактивдүү көрүңүз!',
    textRu: 'Карта кампуса: Находите аудитории, коворкинг и точки Ящиков доверия на интерактивной 3D карте!',
    textEn: 'Campus Map: Explore lecture halls, student zones, and Trust Box drop points on the interactive 3D map!',
    targetTab: 'campus-map',
    tagColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    icon: MapPin,
  },
  {
    id: 'mentors',
    tagKy: 'НАСААТЧЫЛАР',
    tagRu: 'НАСТАВНИКИ',
    tagEn: 'PEER MENTORS',
    textKy: 'Биринчи курстарга жардам: 12 тажрыйбалуу жогорку курс студенти кеңеш берүүгө даяр!',
    textRu: 'Помощь первокурсникам: 12 опытных старшекурсников готовы стать личными менторами!',
    textEn: 'Freshman peer support: 12 experienced upperclassmen are ready to guide you academically!',
    targetTab: 'mentors',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    icon: UserCheck,
  },
];

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ lang, setActiveTab }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <div className="w-full bg-slate-900 border-b border-slate-800 text-right px-4 py-1">
        <button
          onClick={() => setIsDismissed(false)}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 font-medium cursor-pointer"
        >
          <Megaphone className="w-3 h-3" />
          <span>
            {lang === 'ky' 
              ? 'Жаңылыктар сабын көрсөтүү (Бегущая строка)' 
              : lang === 'ru' 
              ? 'Показать бегущую строку' 
              : 'Show live announcement ticker'}
          </span>
        </button>
      </div>
    );
  }

  const liveLabel = lang === 'ky' ? 'ТҮЗ ЭФИР' : lang === 'ru' ? 'АКТУАЛЬНО' : 'LIVE TICKER';

  return (
    <div 
      id="marquee-ticker-banner"
      className="relative w-full bg-slate-950 border-b border-slate-800/90 text-slate-200 overflow-hidden select-none z-30 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex items-center h-10 px-2 sm:px-4">
        {/* Left Sticky Badge */}
        <div className="relative z-10 flex items-center gap-2 bg-slate-950 pr-3 border-r border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/40 text-red-400 font-extrabold text-[10px] tracking-wider shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="hidden xs:inline">{liveLabel}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? (lang === 'ky' ? 'Жүргүзүү' : 'Запустить') : (lang === 'ky' ? 'Токтото туруу' : 'Приостановить')}
            className="p-1 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Marquee Track Container */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          {/* Subtle edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          {/* Running content (repeated twice for seamless loop) */}
          <div 
            className="animate-marquee flex items-center gap-8 pl-4"
            style={{ animationPlayState: isPaused ? 'paused' : undefined }}
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
              const Icon = item.icon;
              const tag = lang === 'ky' ? item.tagKy : lang === 'ru' ? item.tagRu : item.tagEn;
              const text = lang === 'ky' ? item.textKy : lang === 'ru' ? item.textRu : item.textEn;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => setActiveTab(item.targetTab)}
                  className="inline-flex items-center gap-2 cursor-pointer group hover:bg-slate-900/90 py-1 px-3 rounded-lg transition-all"
                >
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${item.tagColor} flex items-center gap-1 shrink-0`}>
                    <Icon className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>

                  <span className="text-xs text-slate-300 font-medium group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                    {text}
                  </span>

                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  <span className="text-slate-700 font-bold ml-2">•</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right close/hide control */}
        <div className="relative z-10 bg-slate-950 pl-2 shrink-0 flex items-center">
          <button
            onClick={() => setIsDismissed(true)}
            title={lang === 'ky' ? 'Жабуу' : lang === 'ru' ? 'Закрыть' : 'Dismiss'}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
