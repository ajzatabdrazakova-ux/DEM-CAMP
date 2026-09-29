import React, { useState } from 'react';
import { 
  Compass, 
  MapPin,
  BookOpen,
  Calendar, 
  Clock, 
  MessageSquarePlus, 
  Users, 
  CheckCircle2, 
  UserCheck, 
  Globe, 
  Menu, 
  X, 
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { Language, UserRole, ActiveTab } from '../types';
import { translations } from '../locales/translations';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickFeedback: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  role,
  setRole,
  activeTab,
  setActiveTab,
  onOpenQuickFeedback
}) => {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      id: 'overview' as ActiveTab, 
      label: t.tabs.overview, 
      icon: Compass, 
      badge: null 
    },
    { 
      id: 'campus-map' as ActiveTab, 
      label: lang === 'ky' ? 'Кампус Картасы' : lang === 'ru' ? 'Карта кампуса' : 'Campus Map', 
      icon: MapPin, 
      badge: '3D' 
    },
    { 
      id: 'practice' as ActiveTab, 
      label: lang === 'ky' ? 'Практика (Мектеп/Садик)' : lang === 'ru' ? 'Пед. практика (Школа/Сад)' : 'Pedagogical Practice', 
      icon: GraduationCap, 
      badge: lang === 'ky' ? '1-11 кл' : '1-11 кл'
    },
    { 
      id: 'resource-center' as ActiveTab, 
      label: lang === 'ky' ? 'Ресурстар борбору' : lang === 'ru' ? 'Центр ресурсов' : 'Resource Center', 
      icon: BookOpen, 
      badge: lang === 'ky' ? 'ЖАҢЫ' : lang === 'ru' ? 'НОВОЕ' : 'NEW'
    },
    { 
      id: 'start-together' as ActiveTab, 
      label: lang === 'ky' ? 'Старт бирге' : lang === 'ru' ? 'Старт вместе' : 'Start Together', 
      icon: Calendar, 
      badge: '1' 
    },
    { 
      id: 'office-hours' as ActiveTab, 
      label: lang === 'ky' ? 'Ачык сааттар' : lang === 'ru' ? 'Открытые часы' : 'Office Hours', 
      icon: Clock, 
      badge: '2' 
    },
    { 
      id: 'your-voice' as ActiveTab, 
      label: lang === 'ky' ? 'Ишеним кутусу' : lang === 'ru' ? 'Ящик доверия' : 'Trust Box', 
      icon: MessageSquarePlus, 
      badge: '3' 
    },
    { 
      id: 'dialogue' as ActiveTab, 
      label: lang === 'ky' ? 'Ачык диалог' : lang === 'ru' ? 'Открытый диалог' : 'Dialogue', 
      icon: Users, 
      badge: '4' 
    },
    { 
      id: 'we-heard' as ActiveTab, 
      label: lang === 'ky' ? 'Биз уктык!' : lang === 'ru' ? 'Мы услышали' : 'We Heard!', 
      icon: CheckCircle2, 
      badge: '5' 
    },
    { 
      id: 'mentors' as ActiveTab, 
      label: lang === 'ky' ? 'Насаатчылар' : lang === 'ru' ? 'Наставники' : 'Mentors', 
      icon: UserCheck, 
      badge: '6' 
    },
    { 
      id: 'online' as ActiveTab, 
      label: lang === 'ky' ? 'Онлайн Q&A' : lang === 'ru' ? 'Онлайн Q&A' : 'Online Q&A', 
      icon: Globe, 
      badge: '7' 
    },
    { 
      id: 'admin' as ActiveTab, 
      label: lang === 'ky' ? 'Админ панель' : lang === 'ru' ? 'Админ-панель' : 'Admin Panel', 
      icon: ShieldCheck, 
      badge: 'ADM' 
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs select-none">
      {/* 1. Slim Top Utility Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6 border-b border-slate-850">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Mission tag with live status indicator */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[11px] font-bold text-cyan-400 tracking-wide uppercase shrink-0">
              {lang === 'ky' ? 'ОшМПУ • DEM-CAMP' : lang === 'ru' ? 'ОшГПУ • DEM-CAMP' : 'OshSPU • DEM-CAMP'}
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-300 truncate hidden sm:inline">
              {t.demCampTag}
            </span>
          </div>

          {/* Right: Language Selector + Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Segmented Toggle (KG / RU / EN) */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
              <button
                id="btn-lang-ky"
                onClick={() => setLang('ky')}
                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  lang === 'ky' 
                    ? 'bg-cyan-500 text-slate-950 shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Кыргыз тили"
              >
                KG
              </button>
              <button
                id="btn-lang-ru"
                onClick={() => setLang('ru')}
                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  lang === 'ru' 
                    ? 'bg-cyan-500 text-slate-950 shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Русский язык"
              >
                RU
              </button>
              <button
                id="btn-lang-en"
                onClick={() => setLang('en')}
                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-cyan-500 text-slate-950 shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English language"
              >
                EN
              </button>
            </div>

            {/* Direct Admin Panel Quick Button */}
            <button
              id="btn-nav-admin-direct"
              onClick={() => {
                setRole('admin');
                setActiveTab('admin');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-slate-900 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
              title="Администратордун башкаруу панели"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ky' ? 'Админ панель' : lang === 'ru' ? 'Админ-панель' : 'Admin Panel'}</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center">
              <button
                id="btn-role-toggle"
                onClick={() => {
                  const nextRole: UserRole = role === 'student' ? 'teacher' : role === 'teacher' ? 'admin' : 'student';
                  setRole(nextRole);
                  if (nextRole === 'admin') {
                    setActiveTab('admin');
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                  role === 'admin'
                    ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-xs'
                    : role === 'teacher'
                    ? 'bg-sky-500/15 text-sky-300 border-sky-500/30 hover:bg-sky-500/25'
                    : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25'
                }`}
                title={t.roles.switchHint}
              >
                {role === 'student' ? (
                  <>
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.roles.student}</span>
                  </>
                ) : role === 'teacher' ? (
                  <>
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t.roles.teacher}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.roles.admin}</span>
                  </>
                )}
                <span className="text-[10px] text-slate-400 font-normal">
                  ({lang === 'ky' ? 'алмаштыруу' : 'сменить'})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Identity */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-600 to-indigo-700 flex flex-col items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform text-white">
              <span className="text-[9px] font-black tracking-widest text-cyan-200 uppercase leading-none">ОшМПУ</span>
              <span className="font-black text-sm tracking-tight leading-none mt-0.5">DC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors">
                  DEM-CAMP
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-cyan-50 text-cyan-800 border border-cyan-300/80 rounded-full uppercase tracking-wider">
                  {lang === 'ky' ? 'ОшМПУ' : lang === 'ru' ? 'ОшГПУ' : 'OshSPU'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-none hidden md:block max-w-sm truncate">
                {lang === 'ky' 
                  ? 'А. Мырсабеков атындагы Ош мамлекеттик педагогикалык университети' 
                  : lang === 'ru' 
                  ? 'Ошский государственный педагогический университет им. А. Мырсабекова' 
                  : 'Osh State Pedagogical University named after A. Myrsabekov'}
              </p>
            </div>
          </div>

          {/* Right Action: Call to Action + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="btn-quick-voice"
              onClick={onOpenQuickFeedback}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-md shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-slate-950" />
              <span>{t.quickActionTrust}</span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Sleek Horizontal Navigation Tabs Strip (Never clips, smooth scroll, clear active state) */}
      <div className="border-t border-slate-100 bg-slate-50/80 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-2 scroll-smooth">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white text-cyan-700 shadow-sm border border-slate-200/90 font-bold ring-2 ring-cyan-500/20'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold ${
                      isActive 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-slate-200/80 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. Mobile Menu Dropdown (Full accessibility on smaller screens) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {/* Quick mobile role/lang bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700">
              {lang === 'ky' ? 'Тил / Тизме:' : lang === 'ru' ? 'Язык / Разделы:' : 'Language / Nav:'}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  onClick={() => setLang('ky')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    lang === 'ky' ? 'bg-cyan-500 text-white' : 'text-slate-600'
                  }`}
                >
                  KG
                </button>
                <button
                  onClick={() => setLang('ru')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    lang === 'ru' ? 'bg-cyan-500 text-white' : 'text-slate-600'
                  }`}
                >
                  RU
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    lang === 'en' ? 'bg-cyan-500 text-white' : 'text-slate-600'
                  }`}
                >
                  EN
                </button>
              </div>
              <button
                onClick={() => {
                  const nextRole: UserRole = role === 'student' ? 'teacher' : role === 'teacher' ? 'admin' : 'student';
                  setRole(nextRole);
                  if (nextRole === 'admin') {
                    setActiveTab('admin');
                  }
                }}
                className="px-2 py-1 rounded bg-cyan-50 text-cyan-700 text-[11px] font-bold border border-cyan-200"
              >
                {role === 'student' ? t.roles.student : role === 'teacher' ? t.roles.teacher : t.roles.admin}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700 font-bold border border-cyan-200/80 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-bold">
                      #{item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2">
            <button
              onClick={() => {
                onOpenQuickFeedback();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
            >
              <MessageSquarePlus className="w-4 h-4 text-slate-950" />
              <span>{t.quickActionTrust}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
