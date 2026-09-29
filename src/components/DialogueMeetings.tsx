import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  ThumbsUp, 
  PlusCircle, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  Vote,
  Mic
} from 'lucide-react';
import { Language, DialogueEvent, DialogueTopic, UserRole } from '../types';
import { translations } from '../locales/translations';

interface DialogueMeetingsProps {
  lang: Language;
  role: UserRole;
  dialogueEvent: DialogueEvent;
  topics: DialogueTopic[];
  onVoteTopic: (topicId: string) => void;
  onProposeTopic: (titleKy: string, titleRu: string, descKy: string, descRu: string, category: string) => void;
  onRegisterRsvp: (eventId: string, studentName: string) => void;
}

export const DialogueMeetings: React.FC<DialogueMeetingsProps> = ({
  lang,
  role,
  dialogueEvent,
  topics,
  onVoteTopic,
  onProposeTopic,
  onRegisterRsvp
}) => {
  const t = translations[lang];

  // RSVP state
  const [isRsvpRegistered, setIsRsvpRegistered] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  // New topic modal / form state
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [newTopicCat, setNewTopicCat] = useState('Окуу сапаты / Качество учебы');

  const handleConfirmRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    onRegisterRsvp(dialogueEvent.id, rsvpName.trim());
    setIsRsvpRegistered(true);
    setShowRsvpModal(false);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    onProposeTopic(
      newTopicTitle.trim(),
      newTopicTitle.trim(),
      newTopicDesc.trim() || 'Студенттик демилге',
      newTopicDesc.trim() || 'Студенческая инициатива',
      newTopicCat
    );
    setNewTopicTitle('');
    setNewTopicDesc('');
    setShowNewTopicForm(false);
  };

  // Sort topics by votes descending
  const sortedTopics = [...topics].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Users className="w-3.5 h-3.5 text-indigo-200" />
            {t.dialogue.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {t.dialogue.title}
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 font-normal leading-relaxed">
            {t.dialogue.subtitle}
          </p>
        </div>
      </div>

      {/* Featured Upcoming Dialogue Meeting Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Mic className="w-3 h-3 text-indigo-600" />
                {t.dialogue.upcomingMeeting}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {dialogueEvent.maxCapacity - dialogueEvent.registeredCount - (isRsvpRegistered ? 1 : 0)} {t.dialogue.placesLeft}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {lang === 'ky' ? dialogueEvent.titleKy : dialogueEvent.titleRu}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {lang === 'ky' ? dialogueEvent.descriptionKy : dialogueEvent.descriptionRu}
            </p>
          </div>

          <div className="shrink-0">
            {isRsvpRegistered ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'ky' ? 'Сиз катталдыңыз! Орун бекитилди' : 'Вы зарегистрированы! Место забронировано'}</span>
              </div>
            ) : (
              <button
                id="btn-rsvp-dialogue"
                onClick={() => setShowRsvpModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Users className="w-4 h-4" />
                <span>{t.dialogue.rsvpBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Date, Location, Agenda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Details */}
          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="text-[10px] text-slate-400 block">{lang === 'ky' ? 'Өтүүчү күнү' : 'Дата встречи'}</span>
                <span className="font-bold">{dialogueEvent.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Clock className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="text-[10px] text-slate-400 block">{lang === 'ky' ? 'Убактысы' : 'Время'}</span>
                <span className="font-bold">{dialogueEvent.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="text-[10px] text-slate-400 block">{lang === 'ky' ? 'Орду' : 'Место'}</span>
                <span className="font-bold">{dialogueEvent.location}</span>
              </div>
            </div>
          </div>

          {/* Agenda items (2 cols) */}
          <div className="md:col-span-2 bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <span className="text-xs font-bold text-slate-900 block mb-3">
              {t.dialogue.agenda}:
            </span>
            <ul className="space-y-2">
              {(lang === 'ky' ? dialogueEvent.agendaKy : dialogueEvent.agendaRu).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Voting Section for Next Round Table Topics */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {t.dialogue.voteTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.dialogue.voteSubtitle}
            </p>
          </div>

          <button
            onClick={() => setShowNewTopicForm(!showNewTopicForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors shadow-xs shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.dialogue.proposeTopicBtn}</span>
          </button>
        </div>

        {/* Propose Topic Form */}
        {showNewTopicForm && (
          <form onSubmit={handleCreateTopic} className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-5 space-y-3 animate-in fade-in">
            <h4 className="text-xs font-bold text-indigo-900 uppercase">
              {lang === 'ky' ? 'Диалогго жаңы тема сунуштоо' : 'Предложить тему для Диалога'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder={t.dialogue.topicPlaceholder}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={newTopicCat}
                  onChange={(e) => setNewTopicCat(e.target.value)}
                  placeholder={lang === 'ky' ? 'Категория (мисалы: Академиялык саясат)' : 'Категория'}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <div>
              <textarea
                rows={2}
                value={newTopicDesc}
                onChange={(e) => setNewTopicDesc(e.target.value)}
                placeholder={lang === 'ky' ? 'Эмне үчүн бул маанилүү жана кандай чечим сунуштайсыз?' : 'Почему эта тема важна?'}
                className="w-full text-xs p-2.5 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewTopicForm(false)}
                className="text-xs text-slate-500 px-3 py-1.5"
              >
                {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
              >
                {lang === 'ky' ? 'Сунушту жарыялоо' : 'Опубликовать тему'}
              </button>
            </div>
          </form>
        )}

        {/* Topic Voting Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedTopics.map((top, idx) => (
            <div 
              key={top.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-start justify-between gap-4 hover:border-indigo-300 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    {top.category}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {lang === 'ky' ? 'Сунуштаган:' : 'Автор:'} {top.proposedBy}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {lang === 'ky' ? top.titleKy : top.titleRu}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'ky' ? top.descriptionKy : top.descriptionRu}
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-center">
                <button
                  id={`btn-vote-topic-${top.id}`}
                  onClick={() => onVoteTopic(top.id)}
                  className={`w-14 h-16 rounded-xl flex flex-col items-center justify-center border transition-all ${
                    top.hasVoted
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-slate-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 mb-1 ${top.hasVoted ? 'fill-white' : ''}`} />
                  <span className="font-mono font-bold text-xs">{top.votes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP Modal */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {lang === 'ky' ? 'Тегерек столго катталуу' : 'Регистрация на круглый стол'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'ky' ? 'Аты-жөнүңүздү калтырыңыз, сизге катышуучу бейджиги даярдалат.' : 'Укажите ваши данные для подготовки бейджа участника.'}
            </p>

            <form onSubmit={handleConfirmRsvp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'ky' ? 'Аты-жөнүңүз' : 'Ваше имя и курс'}
                </label>
                <input
                  type="text"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder={lang === 'ky' ? 'Мисалы: Айдар Касымов, 2-курс' : 'Например: Айдар Касымов, 2 курс'}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRsvpModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500"
                >
                  {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shadow-xs"
                >
                  {lang === 'ky' ? 'Катталуу' : 'Зарегистрироваться'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
