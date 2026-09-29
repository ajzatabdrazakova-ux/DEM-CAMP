import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  Heart, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Award,
  BookOpen,
  Coffee
} from 'lucide-react';
import { Language, AdaptationEvent, StudentExpectation, UserRole } from '../types';
import { translations } from '../locales/translations';

interface AdaptationWeekProps {
  lang: Language;
  role: UserRole;
  events: AdaptationEvent[];
  expectations: StudentExpectation[];
  onAddExpectation: (text: string, author: string, faculty: string) => void;
  onLikeExpectation: (id: string) => void;
  onRegisterEvent: (eventId: string) => void;
}

export const AdaptationWeek: React.FC<AdaptationWeekProps> = ({
  lang,
  role,
  events,
  expectations,
  onAddExpectation,
  onLikeExpectation,
  onRegisterEvent
}) => {
  const t = translations[lang];
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [newExpText, setNewExpText] = useState('');
  const [newExpAuthor, setNewExpAuthor] = useState('');
  const [newExpFaculty, setNewExpFaculty] = useState('Маалыматтык технологиялар');
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});

  const filteredEvents = selectedDay === 'all' 
    ? events 
    : events.filter(e => e.dayNumber === selectedDay);

  const handleRegister = (id: string) => {
    setRegisteredEvents(prev => ({ ...prev, [id]: true }));
    onRegisterEvent(id);
  };

  const handleSubmitExpectation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpText.trim()) return;
    onAddExpectation(
      newExpText.trim(),
      newExpAuthor.trim() || (lang === 'ky' ? '1-курс студенти' : 'Студент 1-го курса'),
      newExpFaculty
    );
    setNewExpText('');
    setNewExpAuthor('');
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-cyan-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            {t.adaptation.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {t.adaptation.title}
          </h2>
          <p className="text-sm sm:text-base text-cyan-100 font-normal leading-relaxed">
            {t.adaptation.subtitle}
          </p>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      </div>

      {/* Program Schedule & Day Filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              <span>{lang === 'ky' ? 'Адаптация жумалыгынын күн тартиби' : 'Программа адаптационной недели'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'ky' ? 'Иш-чараларга алдын ала катталып, эскертүү алыңыз' : 'Записывайтесь на мероприятия заранее для бронирования мест'}
            </p>
          </div>

          {/* Day Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedDay === 'all'
                  ? 'bg-white text-cyan-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.adaptation.allDays}
            </button>
            {[1, 2, 3, 4, 5].map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedDay === d
                    ? 'bg-white text-cyan-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.adaptation.day} {d}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.map((evt) => {
            const isRegistered = registeredEvents[evt.id];
            return (
              <div 
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-cyan-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 font-bold text-xs flex items-center justify-center">
                        #{evt.dayNumber}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-cyan-700 block">{evt.day}</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{evt.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      evt.format === 'hybrid'
                        ? 'bg-purple-100 text-purple-700'
                        : evt.format === 'online'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {evt.format.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {lang === 'ky' ? evt.titleKy : evt.titleRu}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                    {lang === 'ky' ? evt.descKy : evt.descRu}
                  </p>

                  <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{evt.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-700 mr-1">{t.adaptation.speakers}:</span>
                        <span>{evt.speakers.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {evt.tags.map((tg, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        #{tg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    <strong className="text-slate-800">{evt.attendeesCount + (isRegistered ? 1 : 0)}</strong> {t.adaptation.registered}
                  </span>

                  <button
                    id={`btn-register-evt-${evt.id}`}
                    onClick={() => handleRegister(evt.id)}
                    disabled={isRegistered}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isRegistered
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.adaptation.alreadyRegistered}</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{t.adaptation.registerBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expectation Board Section: "Менин күтүүлөрүм" */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
              {lang === 'ky' ? 'Ачык пикир алмашуу' : 'Взаимные ожидания'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {t.adaptation.expectationsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
              {t.adaptation.expectationsDesc}
            </p>
          </div>
        </div>

        {/* Input Form for Expectations */}
        <form onSubmit={handleSubmitExpectation} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'ky' ? 'Аты-жөнүңүз (же каймана ат)' : 'Ваше имя или псевдоним'}
              </label>
              <input
                type="text"
                value={newExpAuthor}
                onChange={(e) => setNewExpAuthor(e.target.value)}
                placeholder={lang === 'ky' ? 'Мисалы: Азамат (1-курс)' : 'Например: Азамат (1-й курс)'}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'ky' ? 'Факультет' : 'Факультет'}
              </label>
              <select
                value={newExpFaculty}
                onChange={(e) => setNewExpFaculty(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
              >
                <option value="Маалыматтык технологиялар">{lang === 'ky' ? 'Маалыматтык технологиялар' : 'Информационные технологии'}</option>
                <option value="Экономика жана Башкаруу">{lang === 'ky' ? 'Экономика жана Башкаруу' : 'Экономика и Менеджмент'}</option>
                <option value="Гуманитардык факультет">{lang === 'ky' ? 'Гуманитардык факультет' : 'Гуманитарный факультет'}</option>
                <option value="Инженерия">{lang === 'ky' ? 'Инженерия' : 'Инженерия'}</option>
                <option value="Медицина">{lang === 'ky' ? 'Медицина' : 'Медицина'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.adaptation.expectationsTitle}
            </label>
            <textarea
              rows={3}
              value={newExpText}
              onChange={(e) => setNewExpText(e.target.value)}
              placeholder={t.adaptation.placeholder}
              className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-none"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.adaptation.submitExpectation}</span>
            </button>
          </div>
        </form>

        {/* Expectation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expectations.map((exp) => (
            <div 
              key={exp.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-900">{exp.author}</span>
                  <span className="text-[10px] text-slate-400">{exp.date}</span>
                </div>
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 mb-2">
                  {exp.faculty}
                </span>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-3">
                  «{lang === 'ky' ? exp.textKy : exp.textRu}»
                </p>

                {exp.responseFromTeacher && (
                  <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-2.5 mt-2 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-1 font-bold text-[11px] text-amber-800">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>{lang === 'ky' ? 'Окутуучунун жообу:' : 'Ответ преподавателя:'}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{exp.responseFromTeacher}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onLikeExpectation(exp.id)}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-rose-600 font-medium transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{exp.likes}</span>
                </button>
                <span className="text-[10px] text-slate-400">
                  {exp.role === 'teacher' 
                    ? (lang === 'ky' ? 'Окутуучу' : 'Преподаватель')
                    : (lang === 'ky' ? 'Студент' : 'Студент')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
