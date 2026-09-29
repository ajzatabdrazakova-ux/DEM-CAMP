import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ThumbsUp, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  Filter,
  PlusCircle,
  Building,
  ShieldCheck
} from 'lucide-react';
import { Language, WeHeardItem, UserRole } from '../types';
import { translations } from '../locales/translations';

interface WeHeardYouProps {
  lang: Language;
  role: UserRole;
  items: WeHeardItem[];
  onLikeItem: (id: string) => void;
  onAddNewResolution?: (item: Omit<WeHeardItem, 'id' | 'likes'>) => void;
}

export const WeHeardYou: React.FC<WeHeardYouProps> = ({
  lang,
  role,
  items,
  onLikeItem,
  onAddNewResolution
}) => {
  const t = translations[lang];
  const [statusFilter, setStatusFilter] = useState<'all' | 'implemented' | 'in_progress' | 'explained'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for teacher/admin
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [status, setStatus] = useState<WeHeardItem['status']>('implemented');
  const [dept, setDept] = useState('Окуу бөлүмү / Учебная часть');
  const [impact, setImpact] = useState('');

  const filteredItems = statusFilter === 'all'
    ? items
    : items.filter(i => i.status === statusFilter);

  const stats = {
    implemented: items.filter(i => i.status === 'implemented').length,
    inProgress: items.filter(i => i.status === 'in_progress').length,
    explained: items.filter(i => i.status === 'explained').length,
  };

  const handleCreateResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problem.trim() || !actionTaken.trim()) return;

    if (onAddNewResolution) {
      onAddNewResolution({
        titleKy: title,
        titleRu: title,
        problemKy: problem,
        problemRu: problem,
        actionTakenKy: actionTaken,
        actionTakenRu: actionTaken,
        status,
        departmentKy: dept,
        departmentRu: dept,
        dateResolved: new Date().toISOString().split('T')[0],
        impactKy: impact || 'Студенттик чөйрөнү жакшыртуу',
        impactRu: impact || 'Улучшение студенческой среды',
        category: 'Жалпы'
      });
    }

    setTitle('');
    setProblem('');
    setActionTaken('');
    setImpact('');
    setShowAddForm(false);
  };

  const getStatusBadge = (st: WeHeardItem['status']) => {
    switch (st) {
      case 'implemented':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.status.implemented}</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.status.inProgress}</span>
          </span>
        );
      case 'explained':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.status.clarification}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-rose-200" />
            {t.weHeard.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {t.weHeard.title}
          </h2>
          <p className="text-sm sm:text-base text-rose-100 font-normal leading-relaxed">
            {t.weHeard.subtitle}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setStatusFilter('implemented')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all ${
            statusFilter === 'implemented'
              ? 'bg-emerald-50 border-emerald-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
              {t.weHeard.statResolved}
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">{stats.implemented}</span>
          <p className="text-[11px] text-slate-500 mt-1">
            {lang === 'ky' ? 'Толук чечилген жана киргизилген' : 'Успешно решено и реализовано'}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('in_progress')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all ${
            statusFilter === 'in_progress'
              ? 'bg-amber-50 border-amber-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              {t.weHeard.statInProgress}
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">{stats.inProgress}</span>
          <p className="text-[11px] text-slate-500 mt-1">
            {lang === 'ky' ? 'Учурда тиешелүү бөлүмдөрдө каралууда' : 'В процессе исполнения службами'}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('explained')}
          className={`cursor-pointer rounded-2xl p-5 border transition-all ${
            statusFilter === 'explained'
              ? 'bg-blue-50 border-blue-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
              {t.weHeard.statExplained}
            </span>
            <HelpCircle className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">{stats.explained}</span>
          <p className="text-[11px] text-slate-500 mt-1">
            {lang === 'ky' ? 'Себеби негизделип түшүндүрүлгөн' : 'Открыто обоснована невозможность/сроки'}
          </p>
        </div>
      </div>

      {/* Filter and Teacher Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.weHeard.filterAll}
          </button>
          <button
            onClick={() => setStatusFilter('implemented')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'implemented'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.status.implemented}
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'in_progress'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.status.inProgress}
          </button>
          <button
            onClick={() => setStatusFilter('explained')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'explained'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.status.clarification}
          </button>
        </div>

        {role === 'teacher' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{lang === 'ky' ? '+ Жаңы чечим жарыялоо' : '+ Опубликовать отчет о решении'}</span>
          </button>
        )}
      </div>

      {/* Teacher Resolution Submission Form */}
      {showAddForm && (
        <form onSubmit={handleCreateResolution} className="bg-rose-50/60 border border-rose-200 rounded-3xl p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-rose-900 uppercase">
              {lang === 'ky' ? '«Биз уктык» тактасына жаңы отчет кошуу' : 'Добавить отчет в «Мы услышали»'}
            </h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'ky' ? 'Темасы' : 'Тема'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang === 'ky' ? 'Мисалы: Китепкананын иштөө мөөнөтү узартылды' : 'Например: Продлен режим библиотеки'}
                className="w-full text-xs px-3 py-2 rounded-lg border border-rose-200 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'ky' ? 'Статус' : 'Статус'}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WeHeardItem['status'])}
                className="w-full text-xs px-3 py-2 rounded-lg border border-rose-200 bg-white"
              >
                <option value="implemented">{t.status.implemented}</option>
                <option value="in_progress">{t.status.inProgress}</option>
                <option value="explained">{t.status.clarification}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.weHeard.problemCol}
            </label>
            <textarea
              rows={2}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder={lang === 'ky' ? 'Студенттер кандай көйгөйдү айтышкан?' : 'С какой проблемой обратились?'}
              className="w-full text-xs p-2.5 rounded-lg border border-rose-200 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.weHeard.solutionCol}
            </label>
            <textarea
              rows={2}
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              placeholder={lang === 'ky' ? 'Кандай чечим же чара көрүлдү? Эмне өзгөрдү?' : 'Что было сделано или почему отложено?'}
              className="w-full text-xs p-2.5 rounded-lg border border-rose-200 bg-white"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-500 px-3 py-1.5"
            >
              {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500"
            >
              {lang === 'ky' ? 'Сайтка чыгаруу' : 'Опубликовать'}
            </button>
          </div>
        </form>
      )}

      {/* Resolutions List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-rose-300 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                {getStatusBadge(item.status)}
                <span className="text-xs font-bold text-slate-500">
                  {item.dateResolved}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  {lang === 'ky' ? item.departmentKy : item.departmentRu}
                </span>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {item.category}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'ky' ? item.titleKy : item.titleRu}
            </h3>

            {/* Problem vs Solution 2-Column Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  {t.weHeard.problemCol}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {lang === 'ky' ? item.problemKy : item.problemRu}
                </p>
              </div>

              <div className={`rounded-2xl p-4 border ${
                item.status === 'implemented'
                  ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                  : item.status === 'in_progress'
                  ? 'bg-amber-50/50 border-amber-200/80 text-amber-950'
                  : 'bg-blue-50/50 border-blue-200/80 text-blue-950'
              }`}>
                <span className="text-[11px] font-bold uppercase tracking-wide block mb-1 opacity-80">
                  {t.weHeard.solutionCol}
                </span>
                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {lang === 'ky' ? item.actionTakenKy : item.actionTakenRu}
                </p>
              </div>
            </div>

            {/* Footer with Impact and Upvotes */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>
                  <strong className="text-slate-800 font-semibold">{t.weHeard.impactCol}:</strong>{' '}
                  {lang === 'ky' ? item.impactKy : item.impactRu}
                </span>
              </div>

              <button
                onClick={() => onLikeItem(item.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs transition-colors self-end sm:self-auto border border-slate-200"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{item.likes} {lang === 'ky' ? 'колдоо' : 'поддерживают'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
