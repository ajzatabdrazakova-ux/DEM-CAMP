import React, { useState } from 'react';
import { 
  MessageSquarePlus, 
  ShieldCheck, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ThumbsUp, 
  Lock, 
  EyeOff, 
  FileText,
  Filter,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Language, FeedbackSubmission, UserRole } from '../types';
import { translations } from '../locales/translations';
import { StudentFeedbackTemplate } from './StudentFeedbackTemplate';
import { GraduationCap } from 'lucide-react';

interface TrustBoxFeedbackProps {
  lang: Language;
  role: UserRole;
  feedbacks: FeedbackSubmission[];
  onSubmitFeedback: (feedback: Omit<FeedbackSubmission, 'id' | 'trackingCode' | 'status' | 'submittedAt' | 'upvotes'>) => FeedbackSubmission;
  onUpvote: (id: string) => void;
  onAddTeacherResponse?: (feedbackId: string, responseText: string, responderName: string) => void;
}

export const TrustBoxFeedback: React.FC<TrustBoxFeedbackProps> = ({
  lang,
  role,
  feedbacks,
  onSubmitFeedback,
  onUpvote,
  onAddTeacherResponse
}) => {
  const t = translations[lang];

  // Submission Form State
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [faculty, setFaculty] = useState('Маалыматтык технологиялар факультети');
  const [category, setCategory] = useState<FeedbackSubmission['category']>('academic');
  const [urgency, setUrgency] = useState<FeedbackSubmission['urgency']>('medium');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submittedResult, setSubmittedResult] = useState<FeedbackSubmission | null>(null);

  // Tracker State
  const [searchTrackingCode, setSearchTrackingCode] = useState('');
  const [trackedItem, setTrackedItem] = useState<FeedbackSubmission | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Category filter for the public feed
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');

  // Teacher reply form state
  const [replyingFeedbackId, setReplyingFeedbackId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [responderName, setResponderName] = useState('Окутуучу / Деканат');

  // Mode: Student F.I.O and Group template vs Anonymous Trust Box
  const [subMode, setSubMode] = useState<'student-template' | 'trust-box'>('student-template');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const result = onSubmitFeedback({
      isAnonymous,
      studentName: isAnonymous ? undefined : (studentName.trim() || 'Студент'),
      faculty,
      category,
      urgency,
      title: title.trim(),
      message: message.trim()
    });

    setSubmittedResult(result);
    setTitle('');
    setMessage('');
    setStudentName('');
  };

  const handleTrackCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = searchTrackingCode.trim().toUpperCase();
    const found = feedbacks.find(f => f.trackingCode.toUpperCase() === cleanCode);
    setTrackedItem(found || null);
    setHasSearched(true);
  };

  const handleSendTeacherReply = (feedbackId: string) => {
    if (!replyText.trim() || !onAddTeacherResponse) return;
    onAddTeacherResponse(feedbackId, replyText.trim(), responderName.trim());
    setReplyingFeedbackId(null);
    setReplyText('');
  };

  const filteredFeedbacks = selectedCatFilter === 'all'
    ? feedbacks
    : feedbacks.filter(f => f.category === selectedCatFilter);

  const getStatusBadge = (status: FeedbackSubmission['status']) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            {t.status.resolved}
          </span>
        );
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            {t.status.reviewing}
          </span>
        );
      case 'clarification':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <HelpCircle className="w-3 h-3" />
            {t.status.clarification}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3 h-3" />
            {t.status.received}
          </span>
        );
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            {t.yourVoice.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {t.yourVoice.title}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
            {t.yourVoice.subtitle}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/20 flex flex-wrap items-center gap-2">
          <button
            id="tab-btn-student-template-mode"
            onClick={() => setSubMode('student-template')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              subMode === 'student-template'
                ? 'bg-white text-emerald-900 shadow-md font-extrabold'
                : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Студенттердин пикири & сунуш шаблону (Ф.И.О жана Группа)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              Шаблон
            </span>
          </button>

          <button
            id="tab-btn-trust-box-mode"
            onClick={() => setSubMode('trust-box')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              subMode === 'trust-box'
                ? 'bg-white text-emerald-900 shadow-md font-extrabold'
                : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Купуя «Ишеним кутусу» (Анонимдүү)</span>
          </button>
        </div>
      </div>

      {/* RENDER: STUDENT FEEDBACK TEMPLATE (WITH F.I.O AND GROUP) */}
      {subMode === 'student-template' && (
        <StudentFeedbackTemplate lang={lang} defaultCategory="Педагогикалык практика" />
      )}

      {/* RENDER: CLASSIC TRUST BOX */}
      {subMode === 'trust-box' && (
        <>
          {/* Grid: Trust Box Form & Code Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ky' ? 'Жаңы кайрылуу / Ишеним кутусу' : 'Новое обращение / «Ящик доверия»'}</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              100% Купуялуулук кепилдиги
            </span>
          </div>

          {submittedResult ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-emerald-900">
                {lang === 'ky' ? 'Кайрылууңуз ийгиликтүү кабыл алынды!' : 'Обращение успешно отправлено в Ящик доверия!'}
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                {t.yourVoice.keepCodeHint}
              </p>
              <div className="inline-block bg-white border border-emerald-300 rounded-xl px-4 py-2 font-mono font-bold text-base text-emerald-700 shadow-xs">
                {submittedResult.trackingCode}
              </div>
              <div>
                <button
                  onClick={() => setSubmittedResult(null)}
                  className="mt-2 text-xs font-semibold text-emerald-700 underline hover:text-emerald-800"
                >
                  {lang === 'ky' ? 'Дагы жаңы кайрылуу жазуу' : 'Отправить ещё одно обращение'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anonymous toggle card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isAnonymous ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {isAnonymous 
                        ? (lang === 'ky' ? 'Анонимдүү режим активдүү' : 'Анонимный режим активен')
                        : (lang === 'ky' ? 'Ачык режим (аты-жөнү көрсөтүлөт)' : 'Открытый режим (с указанием имени)')}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {t.yourVoice.anonymousToggle}
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                />
              </div>

              {!isAnonymous && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.yourVoice.studentName}
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={lang === 'ky' ? 'Аты-жөнүңүз' : 'Ваше имя'}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required={!isAnonymous}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.yourVoice.facultyLabel}
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  >
                    <option value="Маалыматтык технологиялар факультети">{lang === 'ky' ? 'Маалыматтык технологиялар' : 'ИТ факультет'}</option>
                    <option value="Экономика жана Башкаруу факультети">{lang === 'ky' ? 'Экономика жана Башкаруу' : 'Экономика и Менеджмент'}</option>
                    <option value="Гуманитардык факультет">{lang === 'ky' ? 'Гуманитардык факультет' : 'Гуманитарный факультет'}</option>
                    <option value="Инженерия">{lang === 'ky' ? 'Инженердик факультет' : 'Инженерный факультет'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.yourVoice.categoryLabel}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FeedbackSubmission['category'])}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  >
                    <option value="academic">{t.categories.academic}</option>
                    <option value="infrastructure">{t.categories.infrastructure}</option>
                    <option value="dormitory">{t.categories.dormitory}</option>
                    <option value="assessment">{t.categories.assessment}</option>
                    <option value="ethics">{t.categories.ethics}</option>
                    <option value="initiative">{t.categories.initiative}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.yourVoice.titleLabel}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={lang === 'ky' ? 'Мисалы: Аудиториядагы проектор иштебей жатат' : 'Например: В 204 аудитории сломан проектор'}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.yourVoice.messageLabel}
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={lang === 'ky' ? 'Көйгөйдү так сүрөттөп бериңиз, кааласаңыз кандай чечсе болоору боюнча сунушуңузду кошуңуз...' : 'Опишите ситуацию или ваше конструктивное предложение...'}
                  className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.yourVoice.urgencyLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'low', labelKy: 'Кадимки', labelRu: 'Обычная' },
                    { val: 'medium', labelKy: 'Орто', labelRu: 'Средняя' },
                    { val: 'high', labelKy: 'Шашылыш', labelRu: 'Срочная' },
                  ].map((u) => (
                    <button
                      key={u.val}
                      type="button"
                      onClick={() => setUrgency(u.val as FeedbackSubmission['urgency'])}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        urgency === u.val
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {lang === 'ky' ? u.labelKy : u.labelRu}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.yourVoice.submitBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Tracking Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tracking Search Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-600" />
              <span>{t.yourVoice.trackTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'ky' 
                ? 'Ар бир кайрылууга берилген код боюнча анын каралышын жана ректораттын же окутуучунун жообун текшериңиз.'
                : 'По уникальному коду отслеживайте судьбу обращения: кто рассматривает и какое решение принято.'}
            </p>

            <form onSubmit={handleTrackCode} className="flex gap-2">
              <input
                type="text"
                value={searchTrackingCode}
                onChange={(e) => setSearchTrackingCode(e.target.value)}
                placeholder={t.yourVoice.trackPlaceholder}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                {t.yourVoice.trackBtn}
              </button>
            </form>

            <div className="flex gap-1 text-[11px] text-slate-400">
              <span>{lang === 'ky' ? 'Тест үчүн коддор:' : 'Примеры кодов:'}</span>
              <button
                type="button"
                onClick={() => setSearchTrackingCode('#DEM-4821')}
                className="text-emerald-700 font-mono underline hover:text-emerald-800"
              >
                #DEM-4821
              </button>
              <span>,</span>
              <button
                type="button"
                onClick={() => setSearchTrackingCode('#DEM-5014')}
                className="text-emerald-700 font-mono underline hover:text-emerald-800"
              >
                #DEM-5014
              </button>
            </div>

            {/* Tracked Result Box */}
            {hasSearched && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                {trackedItem ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-emerald-800">{trackedItem.trackingCode}</span>
                      {getStatusBadge(trackedItem.status)}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{trackedItem.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{trackedItem.message}</p>
                    
                    {trackedItem.officialResponse && (
                      <div className="bg-white border border-emerald-200 rounded-lg p-3 text-xs space-y-1 mt-2">
                        <span className="font-bold text-emerald-800 block text-[11px]">
                          {t.yourVoice.officialResponseLabel}
                        </span>
                        <p className="text-slate-700 leading-relaxed text-[11px]">
                          {trackedItem.officialResponse.responseText}
                        </p>
                        <div className="text-[10px] text-slate-400 pt-1 flex justify-between">
                          <span>{trackedItem.officialResponse.responderName} ({trackedItem.officialResponse.responderRole})</span>
                          <span>{trackedItem.officialResponse.respondedAt}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
                    {lang === 'ky' ? 'Бул код боюнча кайрылуу табылган жок' : 'Обращение с таким кодом не найдено'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Teacher Action notice */}
          {role === 'teacher' && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 text-xs text-amber-900 space-y-2">
              <span className="font-bold block text-amber-800">
                🛡️ {lang === 'ky' ? 'Окутуучунун мүмкүнчүлүгү:' : 'Режим преподавателя:'}
              </span>
              <p className="leading-relaxed">
                {lang === 'ky'
                  ? 'Сиз төмөнкү кайрылууларга түз жооп берип, алардын статусун «Чечилди» же «Каралууда» деп өзгөртө аласыз.'
                  : 'Вы можете давать официальные ответы на обращения студентов и обновлять их статусы.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Public Feedback Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t.yourVoice.recentFeedbacks}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'ky' ? 'Ачык сунуштар жана көйгөйлөр' : 'Открытые предложения и решения'}
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-1">
            {['all', 'academic', 'infrastructure', 'assessment'].map(c => (
              <button
                key={c}
                onClick={() => setSelectedCatFilter(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCatFilter === c
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'all' ? t.yourVoice.filterAll : t.categories[c as keyof typeof t.categories]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFeedbacks.map((fb) => (
            <div 
              key={fb.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-slate-500">{fb.trackingCode}</span>
                  {getStatusBadge(fb.status)}
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                  {fb.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">
                  {fb.message}
                </p>

                {fb.officialResponse && (
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-950 space-y-1 mb-3">
                    <span className="font-bold text-[11px] text-emerald-800 block">
                      {lang === 'ky' ? 'Окутуучунун / Деканаттын жообу:' : 'Ответ деканата / кафедры:'}
                    </span>
                    <p className="text-[11px] leading-relaxed line-clamp-2">
                      {fb.officialResponse.responseText}
                    </p>
                  </div>
                )}
              </div>

              <div>
                {/* Teacher Reply trigger */}
                {role === 'teacher' && !fb.officialResponse && (
                  <div className="mb-2">
                    {replyingFeedbackId === fb.id ? (
                      <div className="space-y-2 p-2 bg-amber-50 rounded-xl border border-amber-200">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={lang === 'ky' ? 'Расмий жооп жазыңыз...' : 'Официальный ответ...'}
                          className="w-full text-xs p-2 rounded border border-amber-300 bg-white"
                        />
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setReplyingFeedbackId(null)}
                            className="text-[11px] px-2 py-1 text-slate-500"
                          >
                            {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
                          </button>
                          <button
                            onClick={() => handleSendTeacherReply(fb.id)}
                            className="text-[11px] px-3 py-1 bg-emerald-600 text-white font-bold rounded"
                          >
                            {lang === 'ky' ? 'Жооп жөнөтүү' : 'Ответить'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingFeedbackId(fb.id)}
                        className="text-[11px] text-amber-700 font-bold underline hover:text-amber-800"
                      >
                        {lang === 'ky' ? '+ Расмий жооп калтыруу' : '+ Оставить официальный ответ'}
                      </button>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onUpvote(fb.id)}
                    className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 font-semibold transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{fb.upvotes}</span>
                  </button>

                  <span className="text-[10px] text-slate-400">
                    {fb.isAnonymous ? (lang === 'ky' ? 'Анонимдүү' : 'Анонимно') : fb.studentName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
