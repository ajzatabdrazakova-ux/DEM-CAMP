import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  MapPin, 
  Video, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Star, 
  Filter,
  Sparkles,
  Ticket,
  ChevronRight,
  User
} from 'lucide-react';
import { Language, TeacherProfile, OfficeHourBooking, UserRole } from '../types';
import { translations } from '../locales/translations';

interface OfficeHoursProps {
  lang: Language;
  role: UserRole;
  teachers: TeacherProfile[];
  bookings: OfficeHourBooking[];
  onBookSlot: (booking: Omit<OfficeHourBooking, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => OfficeHourBooking;
}

export const OfficeHours: React.FC<OfficeHoursProps> = ({
  lang,
  role,
  teachers,
  bookings,
  onBookSlot
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [onlineOnly, setOnlineOnly] = useState(false);

  // Booking Modal State
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-09-18');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [topic, setTopic] = useState('Академиялык кеңеш / Учебная консультация');
  const [questionDetail, setQuestionDetail] = useState('');
  const [meetingFormat, setMeetingFormat] = useState<'offline' | 'online'>('offline');
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<OfficeHourBooking | null>(null);

  const filteredTeachers = teachers.filter(tch => {
    const nameMatch = (lang === 'ky' ? tch.nameKy : tch.nameRu).toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (lang === 'ky' ? tch.departmentKy : tch.departmentRu).toLowerCase().includes(searchTerm.toLowerCase());
    const facultyMatch = selectedFaculty === 'all' || 
                         (lang === 'ky' ? tch.facultyKy : tch.facultyRu).includes(selectedFaculty);
    const onlineMatch = !onlineOnly || tch.isOnlineAvailable;
    return nameMatch && facultyMatch && onlineMatch;
  });

  const handleOpenBookingModal = (teacher: TeacherProfile) => {
    setSelectedTeacher(teacher);
    setSelectedSlot(teacher.availableHours[0]?.slots[0] || '14:00 - 14:30');
    setLastConfirmedBooking(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedSlot) return;

    const newBooking = onBookSlot({
      teacherId: selectedTeacher.id,
      teacherName: lang === 'ky' ? selectedTeacher.nameKy : selectedTeacher.nameRu,
      studentName: studentName.trim() || (lang === 'ky' ? 'Студент' : 'Студент'),
      studentEmail: studentEmail.trim() || 'student@university.edu.kg',
      faculty: lang === 'ky' ? selectedTeacher.facultyKy : selectedTeacher.facultyRu,
      date: bookingDate,
      timeSlot: selectedSlot,
      format: meetingFormat,
      topic,
      questionDetail: questionDetail.trim()
    });

    setLastConfirmedBooking(newBooking);
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Clock className="w-3.5 h-3.5 text-amber-200" />
            {t.officeHours.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {t.officeHours.title}
          </h2>
          <p className="text-sm sm:text-base text-amber-100 font-normal leading-relaxed">
            {t.officeHours.subtitle}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.officeHours.searchPlaceholder}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Faculty select */}
          <div>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
            >
              <option value="all">{t.officeHours.allFaculties}</option>
              <option value="Маалыматтык">{lang === 'ky' ? 'ИТ факультети' : 'Факультет ИТ'}</option>
              <option value="Экономика">{lang === 'ky' ? 'Экономика факультети' : 'Факультет Экономики'}</option>
              <option value="Гуманитардык">{lang === 'ky' ? 'Гуманитардык факультет' : 'Гуманитарный факультет'}</option>
            </select>
          </div>

          {/* Online filter toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <Video className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.officeHours.filterOnlineOnly}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header with avatar & name */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={teacher.avatar}
                  alt={teacher.nameRu}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-slate-900 truncate">
                      {lang === 'ky' ? teacher.nameKy : teacher.nameRu}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{teacher.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-amber-800">
                    {lang === 'ky' ? teacher.titleKy : teacher.titleRu}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {lang === 'ky' ? teacher.departmentKy : teacher.departmentRu}
                  </p>
                </div>
              </div>

              {/* Bio quote */}
              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {lang === 'ky' ? teacher.bioKy : teacher.bioRu}
              </p>

              {/* Office & Online Indicators */}
              <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{teacher.officeRoom}</span>
                </div>
                {teacher.isOnlineAvailable && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-medium border border-sky-100">
                    <Video className="w-3.5 h-3.5 text-sky-600" />
                    <span>{t.officeHours.onlineLink}</span>
                  </div>
                )}
              </div>

              {/* Topics */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                  {lang === 'ky' ? 'Кеңеш берүү багыттары:' : 'Темы для консультаций:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(lang === 'ky' ? teacher.topicsKy : teacher.topicsRu).map((top, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-medium">
                      {top}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedule Slots preview */}
              <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 block mb-2">
                  {lang === 'ky' ? 'Ачык сааттардын графиги:' : 'График приема:'}
                </span>
                <div className="space-y-1.5">
                  {teacher.availableHours.map((hr, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">
                        {lang === 'ky' ? hr.dayOfWeekKy : hr.dayOfWeekRu}:
                      </span>
                      <div className="flex gap-1">
                        {hr.slots.map((s, si) => (
                          <span key={si} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 text-[10px] font-mono">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Book slot button */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                id={`btn-book-teacher-${teacher.id}`}
                onClick={() => handleOpenBookingModal(teacher)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.officeHours.bookSlotBtn}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {!lastConfirmedBooking ? (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase">
                      {t.officeHours.modalTitle}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {lang === 'ky' ? selectedTeacher.nameKy : selectedTeacher.nameRu}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTeacher(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.officeHours.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder={lang === 'ky' ? 'Аты-жөнүңүз' : 'Ваше имя'}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.officeHours.emailLabel}
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student@university.edu.kg"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.officeHours.dateLabel}
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.officeHours.slotLabel}
                    </label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                    >
                      {selectedTeacher.availableHours.flatMap(h => h.slots).map((slot, idx) => (
                        <option key={idx} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.officeHours.formatLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMeetingFormat('offline')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        meetingFormat === 'offline'
                          ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{t.officeHours.offline} ({selectedTeacher.officeRoom})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMeetingFormat('online')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        meetingFormat === 'online'
                          ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{t.officeHours.online}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.officeHours.topicLabel}
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.officeHours.questionLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={questionDetail}
                    onChange={(e) => setQuestionDetail(e.target.value)}
                    placeholder={lang === 'ky' ? 'Мисалы: 3-лабораториялык иш боюнча суроолорум бар...' : 'Например: вопросы по оформлению курсовой...'}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTeacher(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    {t.officeHours.confirmBooking}
                  </button>
                </div>
              </form>
            ) : (
              /* Booking Success Confirmation Ticket View */
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.officeHours.successMsg}
                </h3>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">{t.officeHours.ticketCode}:</span>
                    <span className="font-mono font-bold text-amber-700">{lastConfirmedBooking.ticketNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'ky' ? 'Окутуучу:' : 'Преподаватель:'}</span>
                    <span className="font-semibold text-slate-800">{lastConfirmedBooking.teacherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'ky' ? 'Күн жана убакыт:' : 'Дата и время:'}</span>
                    <span className="font-semibold text-slate-800">{lastConfirmedBooking.date}, {lastConfirmedBooking.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'ky' ? 'Форматы:' : 'Формат:'}</span>
                    <span className="font-semibold text-slate-800">
                      {lastConfirmedBooking.format === 'offline' ? selectedTeacher.officeRoom : 'Google Meet (онлайн)'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
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
