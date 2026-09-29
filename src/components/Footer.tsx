import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  GraduationCap,
  ExternalLink,
  Award,
  BookOpen
} from 'lucide-react';
import { Language, ActiveTab } from '../types';
import { translations } from '../locales/translations';

interface FooterProps {
  lang: Language;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  setActiveTab,
  onOpenQuickFeedback
}) => {
  const t = translations[lang];

  return (
    <footer className="mt-16 bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top action stripe */}
      <div className="bg-gradient-to-r from-cyan-900/60 via-indigo-950 to-slate-900 py-8 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider block mb-1">
              DEM-CAMP • {lang === 'ky' ? 'Студенттик платформа' : lang === 'ru' ? 'Студенческая платформа' : 'Student Platform'}
            </span>
            <h4 className="text-white text-lg sm:text-xl font-bold">
              {lang === 'ky' 
                ? 'Студенттерди угуп, бириктирип, колдоп жана өзгөрүүгө катыштырган платформа' 
                : lang === 'ru'
                ? 'Студенческая платформа, которая слышит, объединяет, поддерживает и вовлекает в изменения'
                : 'A student platform that listens, connects, supports, and empowers meaningful change'}
            </h4>
          </div>

          <button
            onClick={onOpenQuickFeedback}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
          >
            {t.quickActionTrust}
          </button>
        </div>
      </div>

      {/* Main footer contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        {/* Brand & Philosophy */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-black text-xs tracking-tight">
              DC
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight">
              {t.appName}
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            {lang === 'ky' 
              ? 'DEM-CAMP — студенттерди угуп, бириктирип, колдоп жана өзгөрүүгө катыштырган студенттик ачык платформа.' 
              : lang === 'ru'
              ? 'DEM-CAMP — открытая студенческая платформа, которая слышит каждого, объединяет, поддерживает и вовлекает в реальные изменения.'
              : 'DEM-CAMP is an open student platform that listens to every voice, unites the community, and empowers university-wide progress.'}
          </p>
          <div className="text-[11px] text-cyan-400 font-semibold">
            {t.demCampTag}
          </div>
        </div>

        {/* 7 Directions navigation */}
        <div className="space-y-2 md:col-span-2">
          <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">
            {lang === 'ky' ? 'Платформанын багыттары' : lang === 'ru' ? 'Направления платформы' : 'Platform Pillars'}
          </h5>
          <div className="grid grid-cols-2 gap-2 text-slate-400">
            <button onClick={() => setActiveTab('start-together')} className="text-left hover:text-white transition-colors">
              1. {t.tabs.startTogether}
            </button>
            <button onClick={() => setActiveTab('office-hours')} className="text-left hover:text-white transition-colors">
              2. {t.tabs.officeHours}
            </button>
            <button onClick={() => setActiveTab('your-voice')} className="text-left hover:text-white transition-colors">
              3. {t.tabs.yourVoice}
            </button>
            <button onClick={() => setActiveTab('dialogue')} className="text-left hover:text-white transition-colors">
              4. {t.tabs.dialogue}
            </button>
            <button onClick={() => setActiveTab('we-heard')} className="text-left hover:text-white transition-colors">
              5. {t.tabs.weHeard}
            </button>
            <button onClick={() => setActiveTab('mentors')} className="text-left hover:text-white transition-colors">
              6. {t.tabs.mentors}
            </button>
            <button onClick={() => setActiveTab('online')} className="text-left hover:text-white transition-colors">
              7. {t.tabs.online}
            </button>
            <button onClick={() => setActiveTab('admin')} className="text-left text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5">
              <span>★ {lang === 'ky' ? 'Админ панель' : lang === 'ru' ? 'Админ-панель' : 'Admin Panel'}</span>
            </button>
          </div>
        </div>

        {/* Contacts & Support */}
        <div className="space-y-3">
          <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">
            {lang === 'ky' ? 'Түз байланыш жана колдоо' : lang === 'ru' ? 'Контакты и горячая линия' : 'Contacts & Hotline'}
          </h5>
          <div className="flex items-center gap-2 text-slate-400">
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>+996 (312) 54-20-40 ({lang === 'ky' ? 'Ишеним телефону' : lang === 'ru' ? 'Горячая линия' : 'Trust Hotline'})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>demcamp@university.edu.kg</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ky' ? 'Башкы корпус, Студенттик борбор 102-каб.' : lang === 'ru' ? 'Главный корпус, Студенческий центр, каб. 102' : 'Main Campus, Student Center Room 102'}</span>
          </div>

          {/* Official Qualification & STEM Portals */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
            <a
              id="footer-link-ripk"
              href="https://ripk.kg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-[11px] font-bold transition-colors group"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>РИПК (ripk.kg)</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              id="footer-link-stem"
              href="https://stem.edu.gov.kg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-[11px] font-bold transition-colors group"
            >
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>STEM (stem.edu.gov.kg)</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              id="footer-link-kao-pisa"
              href="https://kao.kg/pisa/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-[11px] font-bold transition-colors group"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>КАО PISA (kao.kg/pisa)</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-slate-800/80 py-4 px-4 text-center text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} DEM-CAMP. {lang === 'ky' ? 'Бардык укуктар корголгон.' : lang === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}</span>
        <span className="mt-2 sm:mt-0 flex items-center gap-1 text-slate-400">
          <span>{lang === 'ky' ? 'Студенттердин үнү жана демилгеси менен' : lang === 'ru' ? 'Создано для и вместе со студентами' : 'Built for and inspired by students'}</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
        </span>
      </div>
    </footer>
  );
};
