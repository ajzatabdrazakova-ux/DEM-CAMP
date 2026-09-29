import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  Mail, 
  GraduationCap, 
  Globe, 
  PlusCircle,
  Clock,
  Heart
} from 'lucide-react';
import { Language, MentorProfile, UserRole } from '../types';
import { translations } from '../locales/translations';

interface PeerMentorsProps {
  lang: Language;
  role: UserRole;
  mentors: MentorProfile[];
  onRequestMentor: (mentorId: string, studentName: string, contactInfo: string, message: string) => void;
  onApplyBecomeMentor: (newMentor: Omit<MentorProfile, 'id' | 'sessionsCompleted' | 'isAvailable'>) => void;
}

export const PeerMentors: React.FC<PeerMentorsProps> = ({
  lang,
  role,
  mentors,
  onRequestMentor,
  onApplyBecomeMentor
}) => {
  const t = translations[lang];
  const [facultyFilter, setFacultyFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Request modal state
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [requestStudentName, setRequestStudentName] = useState('');
  const [requestContact, setRequestContact] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestSentSuccess, setRequestSentSuccess] = useState(false);

  // Apply to become mentor state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantYear, setApplicantYear] = useState(3);
  const [applicantMajor, setApplicantMajor] = useState('');
  const [applicantTags, setApplicantTags] = useState('');
  const [applicantBio, setApplicantBio] = useState('');
  const [applicantTelegram, setApplicantTelegram] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applySentSuccess, setApplySentSuccess] = useState(false);

  const filteredMentors = mentors.filter(m => {
    const facultyMatch = facultyFilter === 'all' || 
                         (lang === 'ky' ? m.facultyKy : m.facultyRu).includes(facultyFilter);
    const searchMatch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (lang === 'ky' ? m.majorKy : m.majorRu).toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (lang === 'ky' ? m.helpTagsKy : m.helpTagsRu).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return facultyMatch && searchMatch;
  });

  const handleOpenRequest = (mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setRequestSentSuccess(false);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !requestStudentName.trim() || !requestContact.trim()) return;

    onRequestMentor(
      selectedMentor.id,
      requestStudentName.trim(),
      requestContact.trim(),
      requestMessage.trim()
    );

    setRequestSentSuccess(true);
  };

  const handleApplyMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantMajor.trim()) return;

    const tags = applicantTags.split(',').map(s => s.trim()).filter(Boolean);

    onApplyBecomeMentor({
      name: applicantName.trim(),
      year: applicantYear,
      facultyKy: 'Маалыматтык технологиялар факультети',
      facultyRu: 'Факультет информационных технологий',
      majorKy: applicantMajor.trim(),
      majorRu: applicantMajor.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      helpTagsKy: tags.length ? tags : ['Сабактар', 'Адаптация'],
      helpTagsRu: tags.length ? tags : ['Учеба', 'Адаптация'],
      bioKy: applicantBio.trim() || 'Жаңы студенттерге жардам берүүгө даярмын!',
      bioRu: applicantBio.trim() || 'Готов помогать первокурсникам!',
      languages: ['Кыргызча', 'Русский'],
      contactTelegram: applicantTelegram.trim(),
      contactEmail: applicantEmail.trim() || 'mentor@student.edu.kg'
    });

    setApplySentSuccess(true);
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <UserCheck className="w-3.5 h-3.5 text-purple-200" />
            {t.mentors.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {t.mentors.title}
          </h2>
          <p className="text-sm sm:text-base text-purple-100 font-normal leading-relaxed">
            {t.mentors.subtitle}
          </p>
        </div>
      </div>

      {/* Filter and Become Mentor Action */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'ky' ? 'Наставниктин аты же темасы боюнча издөө...' : 'Поиск по имени или темам помощи...'}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
          >
            <option value="all">{lang === 'ky' ? 'Бардык факультеттер' : 'Все факультеты'}</option>
            <option value="Маалыматтык">{lang === 'ky' ? 'ИТ факультети' : 'Факультет ИТ'}</option>
            <option value="Экономика">{lang === 'ky' ? 'Экономика факультети' : 'Факультет Экономики'}</option>
            <option value="Гуманитардык">{lang === 'ky' ? 'Гуманитардык факультет' : 'Гуманитарный факультет'}</option>
            <option value="Инженерия">{lang === 'ky' ? 'Инженерия' : 'Инженерия'}</option>
          </select>
        </div>

        <button
          onClick={() => {
            setShowApplyModal(true);
            setApplySentSuccess(false);
          }}
          className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.mentors.becomeMentorBtn}</span>
        </button>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-slate-900 truncate">
                      {mentor.name}
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {mentor.year}-{lang === 'ky' ? 'курс' : 'курс'}
                    </span>
                  </div>

                  <p className="text-xs text-purple-700 font-semibold truncate">
                    {lang === 'ky' ? mentor.majorKy : mentor.majorRu}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {lang === 'ky' ? mentor.facultyKy : mentor.facultyRu}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
                «{lang === 'ky' ? mentor.bioKy : mentor.bioRu}»
              </p>

              {/* Help Tags */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                  {lang === 'ky' ? 'Эмне боюнча жардам бере алат:' : 'Темы помощи и консультаций:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(lang === 'ky' ? mentor.helpTagsKy : mentor.helpTagsRu).map((tg, idx) => (
                    <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200/60 font-medium">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages & Experience */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mentor.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{mentor.sessionsCompleted} {t.mentors.sessionsCount}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`text-xs font-semibold flex items-center gap-1.5 ${
                mentor.isAvailable ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${mentor.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <span>{mentor.isAvailable ? (lang === 'ky' ? 'Кабыл алууга бош' : 'Доступен') : (lang === 'ky' ? 'Убактылуу бош эмес' : 'Занят')}</span>
              </span>

              <button
                onClick={() => handleOpenRequest(mentor)}
                disabled={!mentor.isAvailable}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{t.mentors.connectBtn}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Request Mentorship Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            {!requestSentSuccess ? (
              <form onSubmit={handleSendRequest} className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-purple-600 uppercase">
                      {t.mentors.modalTitle}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedMentor.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="text-slate-400 hover:text-slate-600 text-lg"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  {t.mentors.modalDesc}
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ky' ? 'Сиздин аты-жөнүңүз' : 'Ваше имя и группа'}
                  </label>
                  <input
                    type="text"
                    value={requestStudentName}
                    onChange={(e) => setRequestStudentName(e.target.value)}
                    placeholder={lang === 'ky' ? 'Мисалы: Айбек, 1-курс' : 'Например: Айбек, 1 курс'}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ky' ? 'Байланыш (Telegram же Почта)' : 'Контакт (Telegram или Почта)'}
                  </label>
                  <input
                    type="text"
                    value={requestContact}
                    onChange={(e) => setRequestContact(e.target.value)}
                    placeholder="@username же student@mail.com"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ky' ? 'Кандай маселе боюнча кеңеш керек?' : 'С чем нужна помощь?'}
                  </label>
                  <textarea
                    rows={3}
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder={lang === 'ky' ? 'Мисалы: Биринчи сессияга даярдануу жана сабак боюнча суроолор...' : 'Опишите ваши вопросы...'}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="px-3 py-2 text-xs font-semibold text-slate-500"
                  >
                    {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 shadow-xs"
                  >
                    {lang === 'ky' ? 'Суроону жөнөтүү' : 'Отправить запрос'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {lang === 'ky' ? 'Сурооңуз наставникке жөнөтүлдү!' : 'Запрос успешно отправлен!'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {lang === 'ky' 
                    ? `${selectedMentor.name} жакынкы аралыкта сиз көрсөткөн байланыш боюнча байланышат.` 
                    : `${selectedMentor.name} свяжется с вами по указанному контакту в ближайшее время.`}
                </p>
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  {lang === 'ky' ? 'Жабуу' : 'Закрыть'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Become Mentor Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {!applySentSuccess ? (
              <form onSubmit={handleApplyMentorSubmit} className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {lang === 'ky' ? 'Студент-наставниктер командасына кошулуу' : 'Стать студентом-наставником'}
                    </h3>
                    <p className="text-xs text-purple-700 font-semibold">
                      «Тең-теңине» (Peer-to-Peer) лидерлик программасы
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'ky' ? 'Аты-жөнүңүз' : 'Ваше ФИО'}
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder={lang === 'ky' ? 'Аты-жөнүңүз' : 'Имя'}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'ky' ? 'Курс' : 'Курс (3 же 4)'}
                    </label>
                    <select
                      value={applicantYear}
                      onChange={(e) => setApplicantYear(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value={3}>3-курс</option>
                      <option value={4}>4-курс</option>
                      <option value={2}>2-курс</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ky' ? 'Адистик / Багыт' : 'Специальность'}
                  </label>
                  <input
                    type="text"
                    value={applicantMajor}
                    onChange={(e) => setApplicantMajor(e.target.value)}
                    placeholder={lang === 'ky' ? 'Мисалы: Программалык инженерия' : 'Например: Программная инженерия'}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ky' ? 'Жардам бере ала турган темаларыңыз (үтүр менен)' : 'Темы помощи (через запятую)'}
                  </label>
                  <input
                    type="text"
                    value={applicantTags}
                    onChange={(e) => setApplicantTags(e.target.value)}
                    placeholder="Сабактар, Сессия, Жатакана, Стипендия"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ky' ? 'Өзүңүз жөнүндө кыскача' : 'Коротко о себе и мотивации'}
                  </label>
                  <textarea
                    rows={2}
                    value={applicantBio}
                    onChange={(e) => setApplicantBio(e.target.value)}
                    placeholder={lang === 'ky' ? 'Эмне үчүн 1-курстарга жардам бергиңиз келет?' : 'Почему хотите стать ментором?'}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telegram
                    </label>
                    <input
                      type="text"
                      value={applicantTelegram}
                      onChange={(e) => setApplicantTelegram(e.target.value)}
                      placeholder="@username"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="student@edu.kg"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-500"
                  >
                    {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500"
                  >
                    {lang === 'ky' ? 'Арызды тапшыруу' : 'Подать заявку'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {lang === 'ky' ? 'Арызыңыз кабыл алынды!' : 'Заявка успешно принята!'}
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'ky' 
                    ? 'Студенттик координатор сизге жакынкы күндөрдө тренингге чакыруу жөнөтөт.' 
                    : 'Координатор свяжется с вами и пригласит на вводный инструктаж менторов.'}
                </p>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  {lang === 'ky' ? 'Жабуу' : 'Закрыть'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
