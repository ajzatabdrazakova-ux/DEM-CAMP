import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  MessageSquarePlus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  HelpCircle, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  Check, 
  X, 
  ExternalLink, 
  Send, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Building,
  Tag,
  AlertCircle,
  Eye,
  GraduationCap,
  Star,
  MessageCircle
} from 'lucide-react';
import { StudentReviewItem, FeedbackType } from './StudentFeedbackTemplate';
import { mergeUniqueById } from '../utils/dbStorage';
import { 
  Language, 
  UserRole, 
  ActiveTab, 
  FeedbackSubmission, 
  OfficeHourBooking, 
  WeHeardItem, 
  DialogueEvent, 
  DialogueTopic, 
  AdaptationEvent, 
  StudentExpectation, 
  MentorProfile, 
  OnlineQuestion 
} from '../types';

interface AdminPanelProps {
  lang: Language;
  role: UserRole;
  setRole: (role: UserRole) => void;
  setActiveTab: (tab: ActiveTab) => void;
  feedbacks: FeedbackSubmission[];
  onUpdateFeedbackStatus: (id: string, status: FeedbackSubmission['status']) => void;
  onAddFeedbackResponse: (id: string, responseText: string, responderName: string, responderRole?: string) => void;
  onDeleteFeedback: (id: string) => void;
  officeHourBookings: OfficeHourBooking[];
  onUpdateBookingStatus: (id: string, status: OfficeHourBooking['status']) => void;
  onDeleteBooking: (id: string) => void;
  weHeardItems: WeHeardItem[];
  onAddWeHeardItem: (item: Omit<WeHeardItem, 'id' | 'likes'>) => void;
  onUpdateWeHeardStatus: (id: string, status: WeHeardItem['status']) => void;
  onDeleteWeHeardItem: (id: string) => void;
  dialogueEvent: DialogueEvent;
  onUpdateDialogueEvent: (updated: DialogueEvent) => void;
  dialogueTopics: DialogueTopic[];
  onDeleteTopic: (id: string) => void;
  onAddTopic: (titleKy: string, titleRu: string, descKy: string, descRu: string, category: string) => void;
  adaptationEvents: AdaptationEvent[];
  onAddAdaptationEvent: (event: Omit<AdaptationEvent, 'id' | 'attendeesCount'>) => void;
  onDeleteAdaptationEvent: (id: string) => void;
  expectations: StudentExpectation[];
  onDeleteExpectation: (id: string) => void;
  onRespondExpectation: (id: string, response: string) => void;
  mentors: MentorProfile[];
  onToggleMentorAvailability: (id: string) => void;
  onDeleteMentor: (id: string) => void;
  onAddMentor: (mentor: Omit<MentorProfile, 'id' | 'sessionsCompleted'>) => void;
  onlineQuestions: OnlineQuestion[];
  onAnswerQuestion: (questionId: string, answerText: string, authorRole: 'teacher' | 'dean_office' | 'student_mentor') => void;
  onDeleteQuestion: (id: string) => void;
  onResetData: () => void;
}

type AdminSubSection = 
  | 'overview' 
  | 'feedback' 
  | 'bookings' 
  | 'we-heard' 
  | 'dialogue' 
  | 'adaptation-mentors' 
  | 'questions';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  lang,
  role,
  setRole,
  setActiveTab,
  feedbacks,
  onUpdateFeedbackStatus,
  onAddFeedbackResponse,
  onDeleteFeedback,
  officeHourBookings,
  onUpdateBookingStatus,
  onDeleteBooking,
  weHeardItems,
  onAddWeHeardItem,
  onUpdateWeHeardStatus,
  onDeleteWeHeardItem,
  dialogueEvent,
  onUpdateDialogueEvent,
  dialogueTopics,
  onDeleteTopic,
  onAddTopic,
  adaptationEvents,
  onAddAdaptationEvent,
  onDeleteAdaptationEvent,
  expectations,
  onDeleteExpectation,
  onRespondExpectation,
  mentors,
  onToggleMentorAvailability,
  onDeleteMentor,
  onAddMentor,
  onlineQuestions,
  onAnswerQuestion,
  onDeleteQuestion,
  onResetData
}) => {
  const [subSection, setSubSection] = useState<AdminSubSection>('overview');

  // Feedback tab states
  const [feedbackSubTab, setFeedbackSubTab] = useState<'student-reviews' | 'trust'>('student-reviews');
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<'all' | FeedbackSubmission['status']>('all');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<string>('all');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyResponderName, setReplyResponderName] = useState('ОшМПУ Ректораты & Окуу бөлүмү');
  const [replyResponderRole, setReplyResponderRole] = useState('Университет администрациясы');

  // Student reviews moderation states
  const [studentReviews, setStudentReviews] = useState<StudentReviewItem[]>([]);
  const [studentReviewSearch, setStudentReviewSearch] = useState('');
  const [studentReviewStatusFilter, setStudentReviewStatusFilter] = useState<string>('all');
  const [studentReviewTypeFilter, setStudentReviewTypeFilter] = useState<string>('all');
  const [activeStudentReplyId, setActiveStudentReplyId] = useState<string | null>(null);
  const [studentReplyText, setStudentReplyText] = useState('');

  // Office hours bookings filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | OfficeHourBooking['status']>('all');

  // New We Heard Item Form state
  const [showAddWeHeardModal, setShowAddWeHeardModal] = useState(false);
  const [newWhTitleKy, setNewWhTitleKy] = useState('');
  const [newWhTitleRu, setNewWhTitleRu] = useState('');
  const [newWhProblemKy, setNewWhProblemKy] = useState('');
  const [newWhProblemRu, setNewWhProblemRu] = useState('');
  const [newWhActionKy, setNewWhActionKy] = useState('');
  const [newWhActionRu, setNewWhActionRu] = useState('');
  const [newWhDeptKy, setNewWhDeptKy] = useState('Окуу-усулдук департаменти');
  const [newWhDeptRu, setNewWhDeptRu] = useState('Учебно-методический департамент');
  const [newWhImpactKy, setNewWhImpactKy] = useState('Бардык студенттер үчүн жеткиликтүү болду');
  const [newWhImpactRu, setNewWhImpactRu] = useState('Стало доступно для всех студентов');
  const [newWhCategory, setNewWhCategory] = useState('Академиялык / Окуу');
  const [newWhStatus, setNewWhStatus] = useState<WeHeardItem['status']>('implemented');

  // Edit Dialogue Meeting Form
  const [dialogueTitleKy, setDialogueTitleKy] = useState(dialogueEvent.titleKy);
  const [dialogueDate, setDialogueDate] = useState(dialogueEvent.date);
  const [dialogueTime, setDialogueTime] = useState(dialogueEvent.time);
  const [dialogueLocation, setDialogueLocation] = useState(dialogueEvent.location);
  const [dialogueCapacity, setDialogueCapacity] = useState(dialogueEvent.maxCapacity);
  const [dialogueSavedToast, setDialogueSavedToast] = useState(false);

  // New Topic state
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('Академиялык');

  // Online question answer state
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [adminAnswerText, setAdminAnswerText] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // KPIs
  const totalFeedbacks = feedbacks.length;
  const resolvedFeedbacks = feedbacks.filter(f => f.status === 'resolved').length;
  const reviewingFeedbacks = feedbacks.filter(f => f.status === 'reviewing').length;
  const receivedFeedbacks = feedbacks.filter(f => f.status === 'received').length;
  const urgentHighFeedbacks = feedbacks.filter(f => f.urgency === 'high').length;

  const totalBookings = officeHourBookings.length;
  const confirmedBookings = officeHourBookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = officeHourBookings.filter(b => b.status === 'completed').length;

  const resolvedWeHeardCount = weHeardItems.filter(w => w.status === 'implemented').length;

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(f => {
      const matchSearch = 
        feedbackSearch === '' ||
        f.trackingCode.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
        f.title.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
        f.message.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
        f.faculty.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
        (f.studentName && f.studentName.toLowerCase().includes(feedbackSearch.toLowerCase()));
      
      const matchStatus = feedbackStatusFilter === 'all' || f.status === feedbackStatusFilter;
      const matchCategory = feedbackCategoryFilter === 'all' || f.category === feedbackCategoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [feedbacks, feedbackSearch, feedbackStatusFilter, feedbackCategoryFilter]);

  // Fetch Student Reviews from Server with reconciliation
  const fetchStudentReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          let localSaved: StudentReviewItem[] = [];
          let vaultSaved: StudentReviewItem[] = [];
          try {
            const s = localStorage.getItem('dem_student_reviews');
            if (s) localSaved = JSON.parse(s);
          } catch {}
          try {
            const v = localStorage.getItem('dem_student_reviews_vault');
            if (v) vaultSaved = JSON.parse(v);
          } catch {}
          const merged = mergeUniqueById(data, localSaved, vaultSaved);
          setStudentReviews(merged);
          localStorage.setItem('dem_student_reviews', JSON.stringify(merged));
          localStorage.setItem('dem_student_reviews_vault', JSON.stringify(merged));
        }
      }
    } catch {
      try {
        const saved = localStorage.getItem('dem_student_reviews');
        if (saved) setStudentReviews(JSON.parse(saved));
      } catch {}
    }
  };

  useEffect(() => {
    fetchStudentReviews();
    const handleUpdate = () => fetchStudentReviews();
    window.addEventListener('dem_student_reviews_updated', handleUpdate);
    return () => window.removeEventListener('dem_student_reviews_updated', handleUpdate);
  }, []);

  const handleUpdateStudentReviewStatus = async (id: string, newStatus: StudentReviewItem['status']) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setStudentReviews(updated);
        localStorage.setItem('dem_student_reviews', JSON.stringify(updated));
        localStorage.setItem('dem_student_reviews_vault', JSON.stringify(updated));
      } else {
        setStudentReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch {
      setStudentReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
    window.dispatchEvent(new CustomEvent('dem_student_reviews_updated'));
    showToast(lang === 'ky' ? 'Пикирдин статусу өзгөртүлдү жана серверге сакталды!' : 'Статус отзыва изменён и сохранён на сервере!');
  };

  const handleSaveStudentReviewReply = async (id: string) => {
    if (!studentReplyText.trim()) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminReply: studentReplyText.trim(), status: 'accepted' })
      });
      if (res.ok) {
        const updated = await res.json();
        setStudentReviews(updated);
        localStorage.setItem('dem_student_reviews', JSON.stringify(updated));
        localStorage.setItem('dem_student_reviews_vault', JSON.stringify(updated));
      } else {
        setStudentReviews(prev => prev.map(r => r.id === id ? { ...r, adminReply: studentReplyText.trim(), status: 'accepted' } : r));
      }
    } catch {
      setStudentReviews(prev => prev.map(r => r.id === id ? { ...r, adminReply: studentReplyText.trim(), status: 'accepted' } : r));
    }
    setActiveStudentReplyId(null);
    setStudentReplyText('');
    window.dispatchEvent(new CustomEvent('dem_student_reviews_updated'));
    showToast(lang === 'ky' ? 'Студенттин пикирине расмий жооп сайтта сакталды жана жарыяланды!' : 'Официальный ответ сохранён на сайте!');
  };

  const handleDeleteStudentReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = await res.json();
        setStudentReviews(updated);
        localStorage.setItem('dem_student_reviews', JSON.stringify(updated));
      } else {
        setStudentReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch {
      setStudentReviews(prev => prev.filter(r => r.id !== id));
    }
    window.dispatchEvent(new CustomEvent('dem_student_reviews_updated'));
    showToast(lang === 'ky' ? 'Пикир өчүрүлдү' : 'Отзыв удалён');
  };

  // Filtered student reviews
  const filteredStudentReviews = useMemo(() => {
    return studentReviews.filter(r => {
      const matchSearch =
        studentReviewSearch === '' ||
        r.fullName.toLowerCase().includes(studentReviewSearch.toLowerCase()) ||
        r.groupName.toLowerCase().includes(studentReviewSearch.toLowerCase()) ||
        r.title.toLowerCase().includes(studentReviewSearch.toLowerCase()) ||
        r.content.toLowerCase().includes(studentReviewSearch.toLowerCase()) ||
        r.faculty.toLowerCase().includes(studentReviewSearch.toLowerCase());

      const matchStatus = studentReviewStatusFilter === 'all' || r.status === studentReviewStatusFilter;
      const matchType = studentReviewTypeFilter === 'all' || r.feedbackType === studentReviewTypeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [studentReviews, studentReviewSearch, studentReviewStatusFilter, studentReviewTypeFilter]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return officeHourBookings.filter(b => {
      const matchSearch = 
        bookingSearch === '' ||
        b.ticketNumber.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.studentName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.teacherName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.topic.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.faculty.toLowerCase().includes(bookingSearch.toLowerCase());

      const matchStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [officeHourBookings, bookingSearch, bookingStatusFilter]);

  // JSON Database Export Handler
  const handleExportData = () => {
    const fullDatabase = {
      exportDate: new Date().toISOString(),
      platform: 'DEM-CAMP OshSPU',
      feedbacks,
      studentReviews,
      officeHourBookings,
      weHeardItems,
      dialogueEvent,
      dialogueTopics,
      adaptationEvents,
      expectations,
      mentors,
      onlineQuestions
    };

    const blob = new Blob([JSON.stringify(fullDatabase, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dem_camp_oshspu_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(lang === 'ky' ? 'Маалыматтар JSON форматында көчүрүлдү!' : 'Данные успешно экспортированы в JSON!');
  };

  // Submit official reply to feedback
  const handleSaveReply = (id: string) => {
    if (!replyText.trim()) return;
    onAddFeedbackResponse(id, replyText, replyResponderName, replyResponderRole);
    setActiveReplyId(null);
    setReplyText('');
    showToast(lang === 'ky' ? 'Расмий жооп жарыяланды жана тикет чечилди деп белгиленди!' : 'Официальный ответ опубликован!');
  };

  // Submit new We Heard Item
  const handleCreateWeHeard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhTitleKy.trim() || !newWhActionKy.trim()) return;

    onAddWeHeardItem({
      titleKy: newWhTitleKy,
      titleRu: newWhTitleRu || newWhTitleKy,
      problemKy: newWhProblemKy || newWhTitleKy,
      problemRu: newWhProblemRu || newWhProblemKy,
      actionTakenKy: newWhActionKy,
      actionTakenRu: newWhActionRu || newWhActionKy,
      status: newWhStatus,
      departmentKy: newWhDeptKy,
      departmentRu: newWhDeptRu,
      dateResolved: new Date().toISOString().split('T')[0],
      impactKy: newWhImpactKy,
      impactRu: newWhImpactRu,
      category: newWhCategory
    });

    setShowAddWeHeardModal(false);
    setNewWhTitleKy('');
    setNewWhTitleRu('');
    setNewWhProblemKy('');
    setNewWhProblemRu('');
    setNewWhActionKy('');
    setNewWhActionRu('');
    showToast(lang === 'ky' ? 'Жаңы чечилген маселе «Биз уктык!» тизмесине кошулду!' : 'Решение добавлено в «Мы услышали»!');
  };

  // Save Dialogue Event changes
  const handleSaveDialogueEvent = () => {
    onUpdateDialogueEvent({
      ...dialogueEvent,
      titleKy: dialogueTitleKy,
      titleRu: dialogueTitleKy,
      date: dialogueDate,
      time: dialogueTime,
      location: dialogueLocation,
      maxCapacity: Number(dialogueCapacity)
    });
    setDialogueSavedToast(true);
    setTimeout(() => setDialogueSavedToast(false), 3000);
    showToast(lang === 'ky' ? 'Ачык диалогдун маалыматтары сакталды!' : 'Параметры открытого диалога сохранены!');
  };

  // Handle Admin Q&A reply
  const handleAnswerSubmit = (qId: string) => {
    if (!adminAnswerText.trim()) return;
    onAnswerQuestion(qId, adminAnswerText, 'dean_office');
    setAnsweringQuestionId(null);
    setAdminAnswerText('');
    showToast(lang === 'ky' ? 'ОшМПУ администрациясынын расмий жообу жарыяланды!' : 'Официальный ответ деканата опубликован!');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white border border-emerald-500/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-100">{toastMessage}</p>
        </div>
      )}

      {/* Admin Panel Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>ОшМПУ • Администратор Панели</span>
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                LIVE СИСТЕМА
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>DEM-CAMP Башкаруу Борбору</span>
              <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {lang === 'ky' 
                ? 'Студенттердин кайрылууларын иштеп чыгуу, Ишеним кутусун модерациялоо, ачык сааттарга жазылууларды көзөмөлдөө жана «Биз уктык!» чечимдерин кошуу.'
                : 'Обработка студенческих обращений, модерация «Ящика доверия», управление открытыми часами и публикация внедрённых решений.'}
            </p>
          </div>

          {/* Quick System Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-export-database"
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Маалыматтарды JSON форматында сактап алуу"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'ky' ? 'Экспорт (JSON)' : 'Экспорт (JSON)'}</span>
            </button>

            <button
              id="btn-open-add-weheard"
              onClick={() => {
                setSubSection('we-heard');
                setShowAddWeHeardModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ky' ? 'Чечим кошуу' : 'Добавить решение'}</span>
            </button>

            <button
              id="btn-reset-demo"
              onClick={() => {
                if (window.confirm(lang === 'ky' ? 'Бардык өзгөртүүлөрдү баштапкы үлгү абалга кайтарууну каалайсызбы?' : 'Сбросить все тестовые данные к исходным?')) {
                  onResetData();
                  showToast(lang === 'ky' ? 'Баштапкы үлгү маалыматтар калыбына келтирилди!' : 'Данные успешно сброшены!');
                }
              }}
              className="p-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
              title="Баштапкы абалга кайтаруу"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs inside Admin Panel */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview' as AdminSubSection, label: lang === 'ky' ? 'Обзор & Статистика' : 'Обзор и метрики', icon: LayoutDashboard, count: null },
            { id: 'feedback' as AdminSubSection, label: lang === 'ky' ? 'Ишеним кутусу' : 'Ящик доверия', icon: MessageSquarePlus, count: receivedFeedbacks + reviewingFeedbacks },
            { id: 'bookings' as AdminSubSection, label: lang === 'ky' ? 'Ачык сааттар' : 'Открытые часы', icon: Clock, count: confirmedBookings },
            { id: 'we-heard' as AdminSubSection, label: lang === 'ky' ? '«Биз уктык!» Чечимдер' : '«Мы услышали»', icon: CheckCircle2, count: resolvedWeHeardCount },
            { id: 'dialogue' as AdminSubSection, label: lang === 'ky' ? 'Диалог & Темалар' : 'Диалог и Темы', icon: Users, count: dialogueTopics.length },
            { id: 'adaptation-mentors' as AdminSubSection, label: lang === 'ky' ? 'Старт & Насаатчылар' : 'Старт и Менторы', icon: GraduationCap, count: mentors.length },
            { id: 'questions' as AdminSubSection, label: lang === 'ky' ? 'Онлайн Q&A' : 'Онлайн Q&A', icon: HelpCircle, count: onlineQuestions.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subSection === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-subtab-${tab.id}`}
                onClick={() => setSubSection(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                    isActive ? 'bg-slate-950 text-cyan-300' : 'bg-white/20 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBSECTION 1: OVERVIEW & STATS */}
      {subSection === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {lang === 'ky' ? 'Жалпы кайрылуулар' : 'Всего обращений'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{totalFeedbacks}</span>
                <span className="text-xs text-emerald-600 font-bold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  {Math.round((resolvedFeedbacks / (totalFeedbacks || 1)) * 100)}% {lang === 'ky' ? 'чечилди' : 'решено'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {receivedFeedbacks} жаңы • {reviewingFeedbacks} каралууда
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {lang === 'ky' ? 'Ачык саат жазылуулары' : 'Записей на приём'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{totalBookings}</span>
                <span className="text-xs text-amber-600 font-bold">
                  {confirmedBookings} {lang === 'ky' ? 'активдүү' : 'активно'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {completedBookings} өткөрүлдү
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {lang === 'ky' ? 'Чечилген иштер («Биз уктык»)' : 'Решено кейсов'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{resolvedWeHeardCount}</span>
                <span className="text-xs text-emerald-700 font-bold px-1.5 py-0.5 rounded bg-emerald-100">
                  Жыйынтык
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Студенттердин сунушу менен ишке ашты
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {lang === 'ky' ? 'Диалог катышуучулары' : 'Участников диалога'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{dialogueEvent.registeredCount}</span>
                <span className="text-xs text-slate-400 font-normal">
                  / {dialogueEvent.maxCapacity} {lang === 'ky' ? 'орун' : 'мест'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {dialogueTopics.length} студенттик тема сунушталды
              </p>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                    {urgentHighFeedbacks} {lang === 'ky' ? 'шашылыш кайрылуу' : 'срочных обращений'}
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    {lang === 'ky' ? 'Дароо кароону талап кылган көйгөйлөр' : 'Требуют первоочередного ответа'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSubSection('feedback');
                  setFeedbackStatusFilter('received');
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                {lang === 'ky' ? 'Кароо' : 'Открыть'}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-cyan-950">
                    {confirmedBookings} {lang === 'ky' ? 'активдүү жазылуу' : 'активных записей'}
                  </h4>
                  <p className="text-[11px] text-cyan-800">
                    {lang === 'ky' ? 'Окутуучулардын кабыл алуу тизмеси' : 'График приёма студентов'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSubSection('bookings')}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                {lang === 'ky' ? 'Көрүү' : 'Открыть'}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                    {lang === 'ky' ? 'Жаңы чечим жарыялоо' : 'Опубликовать решение'}
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    {lang === 'ky' ? 'Студенттерге ачык отчёт берүү' : 'Отчёт перед студентами'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSubSection('we-heard');
                  setShowAddWeHeardModal(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                + Кошуу
              </button>
            </div>
          </div>

          {/* Recent Trust Box Feedbacks Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquarePlus className="w-4 h-4 text-cyan-600" />
                  <span>{lang === 'ky' ? 'Акыркы кайрылуулар жана статустар' : 'Последние обращения'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'ky' ? '«Ишеним кутусунан» түшкөн сунуш-көйгөйлөр' : 'Обращения из Ящика доверия'}
                </p>
              </div>
              <button
                onClick={() => setSubSection('feedback')}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
              >
                <span>{lang === 'ky' ? 'Бардыгын ачуу' : 'Показать все'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {feedbacks.slice(0, 4).map((f) => (
                <div key={f.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                        {f.trackingCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{f.title}</span>
                      {f.urgency === 'high' && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                          ШАШЫЛЫШ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{f.message}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{f.faculty}</span>
                      <span>•</span>
                      <span>{f.submittedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                      f.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : f.status === 'reviewing'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {f.status === 'resolved' ? 'Чечилди' : f.status === 'reviewing' ? 'Каралууда' : 'Кабыл алынды'}
                    </span>
                    <button
                      onClick={() => {
                        setSubSection('feedback');
                        setActiveReplyId(f.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {lang === 'ky' ? 'Жооп берүү' : 'Ответить'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 2: TRUST BOX & FEEDBACK MODERATION */}
      {subSection === 'feedback' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Sub-tab selection: Student Reviews vs Trust Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
              <button
                type="button"
                id="admin-subtab-student-reviews"
                onClick={() => setFeedbackSubTab('student-reviews')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  feedbackSubTab === 'student-reviews'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-200" />
                <span>Студенттик пикирлер ({studentReviews.length})</span>
              </button>

              <button
                type="button"
                id="admin-subtab-trust-box"
                onClick={() => setFeedbackSubTab('trust')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  feedbackSubTab === 'trust'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Ишеним кутусу ({feedbacks.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => fetchStudentReviews()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                title="Сайттын серверинен акыркы пикирлерди жаңылоо"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Жаңылоо</span>
              </button>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Сайттын базасы (JSON)</span>
              </div>
            </div>
          </div>

          {/* VIEW A: OFFICIAL STUDENT REVIEWS (PERSISTED ON SERVER) */}
          {feedbackSubTab === 'student-reviews' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Filter Bar */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={studentReviewSearch}
                      onChange={(e) => setStudentReviewSearch(e.target.value)}
                      placeholder={lang === 'ky' ? 'Издөө: Ф.И.О, группа, тема, текст...' : 'Поиск: ФИО, группа, текст...'}
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {studentReviewSearch && (
                      <button 
                        onClick={() => setStudentReviewSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Status Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {[
                      { id: 'all', label: lang === 'ky' ? 'Бардыгы' : 'Все' },
                      { id: 'received', label: lang === 'ky' ? 'Жаңы' : 'Новые' },
                      { id: 'reviewing', label: lang === 'ky' ? 'Каралууда' : 'В работе' },
                      { id: 'accepted', label: lang === 'ky' ? 'Кабыл алынды' : 'Принято' },
                      { id: 'implemented', label: lang === 'ky' ? 'Ишке ашты' : 'Внедрено' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStudentReviewStatusFilter(s.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-colors ${
                          studentReviewStatusFilter === s.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Pills */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="text-[11px] font-bold text-slate-500 mr-1 shrink-0">Түрү:</span>
                  {[
                    { id: 'all', label: 'Бардыгы' },
                    { id: 'review', label: 'Отзыв' },
                    { id: 'suggestion', label: 'Сунуш' },
                    { id: 'opinion', label: 'Пикир' },
                    { id: 'issue', label: 'Кайрылуу' },
                    { id: 'gratitude', label: 'Ыраазычылык' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setStudentReviewTypeFilter(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer whitespace-nowrap transition-colors ${
                        studentReviewTypeFilter === t.id
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                  <span className="ml-auto text-[11px] text-slate-500 font-medium">
                    Сайтта сакталган: <strong className="text-emerald-700">{filteredStudentReviews.length}</strong> / {studentReviews.length}
                  </span>
                </div>
              </div>

              {/* Student Reviews Feed */}
              <div className="space-y-3">
                {filteredStudentReviews.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    {lang === 'ky' ? 'Студенттик пикирлер табылган жок.' : 'Отзывы не найдены.'}
                  </div>
                ) : (
                  filteredStudentReviews.map((r) => {
                    const isReplying = activeStudentReplyId === r.id;
                    return (
                      <div
                        key={r.id}
                        id={`student-review-admin-card-${r.id}`}
                        className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                              👤 {r.fullName}
                            </span>
                            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              🎓 {r.groupName}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {r.faculty}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                              {r.category}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              📅 {r.createdAt}
                            </span>
                          </div>

                          {/* Status and Rating */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-amber-500 text-xs">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                />
                              ))}
                            </div>

                            <select
                              value={r.status}
                              onChange={(e) => handleUpdateStudentReviewStatus(r.id, e.target.value as any)}
                              className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="received">Жаңы (Кабыл алынды)</option>
                              <option value="reviewing">Каралууда</option>
                              <option value="accepted">Кабыл алынды / Жооптолду</option>
                              <option value="implemented">Ишке ашырылды</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleDeleteStudentReview(r.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Сайттан өчүрүү"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Content */}
                        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                          <h4 className="text-xs font-extrabold text-slate-900">{r.title}</h4>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{r.content}</p>
                        </div>

                        {/* Admin Official Response if exists */}
                        {r.adminReply && (
                          <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200/80 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-extrabold text-emerald-900 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ОшМПУ Администрациясынын расмий жообу:
                              </span>
                              {r.adminReplyDate && (
                                <span className="text-[10px] text-emerald-700 font-medium">{r.adminReplyDate}</span>
                              )}
                            </div>
                            <p className="text-xs text-emerald-950 font-medium leading-relaxed whitespace-pre-wrap">
                              {r.adminReply}
                            </p>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <span>👍 Колдоолор: <strong>{r.likes}</strong></span>
                            <span className="mx-1">•</span>
                            <span className="text-emerald-700 font-bold">Сайтта сакталган</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (isReplying) {
                                setActiveStudentReplyId(null);
                                setStudentReplyText('');
                              } else {
                                setActiveStudentReplyId(r.id);
                                setStudentReplyText(r.adminReply || '');
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3 text-emerald-600" />
                            <span>{r.adminReply ? 'Жоопту өзгөртүү' : 'Студентке жооп берүү'}</span>
                          </button>
                        </div>

                        {/* Reply Form Box */}
                        {isReplying && (
                          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-in fade-in">
                            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                              <Send className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{lang === 'ky' ? 'Студенттин пикирине расмий жооп жазуу' : 'Ответ на отзыв студента'}</span>
                            </h4>

                            <textarea
                              rows={3}
                              value={studentReplyText}
                              onChange={(e) => setStudentReplyText(e.target.value)}
                              placeholder={lang === 'ky' ? 'Студентке берилүүчү расмий чечим же жооптун текстин жазыңыз...' : 'Напишите текст официального ответа...'}
                              className="w-full p-2.5 rounded-xl bg-white border border-emerald-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />

                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveStudentReplyId(null);
                                  setStudentReplyText('');
                                }}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                              >
                                {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveStudentReviewReply(r.id)}
                                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>{lang === 'ky' ? 'Жоопту сайтка сактоо & жарыялоо' : 'Сохранить и опубликовать'}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* VIEW B: TRUST BOX ANONYMOUS / CODE-BASED FEEDBACKS */}
          {feedbackSubTab === 'trust' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Filter Bar */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={feedbackSearch}
                onChange={(e) => setFeedbackSearch(e.target.value)}
                placeholder={lang === 'ky' ? 'Издөө: #DEM коду, сөз, факультет...' : 'Поиск: код, факультет...'}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {feedbackSearch && (
                <button 
                  onClick={() => setFeedbackSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: lang === 'ky' ? 'Бардыгы' : 'Все' },
                { id: 'received', label: lang === 'ky' ? 'Жаңы' : 'Новые' },
                { id: 'reviewing', label: lang === 'ky' ? 'Каралууда' : 'В работе' },
                { id: 'resolved', label: lang === 'ky' ? 'Чечилген' : 'Решённые' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFeedbackStatusFilter(s.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-colors ${
                    feedbackStatusFilter === s.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedbacks List */}
          <div className="space-y-3">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                {lang === 'ky' ? 'Кайрылуулар табылган жок.' : 'Обращения не найдены.'}
              </div>
            ) : (
              filteredFeedbacks.map((f) => {
                const isReplying = activeReplyId === f.id;
                return (
                  <div 
                    key={f.id} 
                    id={`feedback-admin-card-${f.id}`}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                          {f.trackingCode}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">{f.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                          {f.category}
                        </span>
                        {f.urgency === 'high' && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                            Шашылыш
                          </span>
                        )}
                      </div>

                      {/* Quick Status Changer Dropdown */}
                      <div className="flex items-center gap-2">
                        <select
                          id={`select-status-${f.id}`}
                          value={f.status}
                          onChange={(e) => {
                            onUpdateFeedbackStatus(f.id, e.target.value as any);
                            showToast(lang === 'ky' ? 'Статус өзгөртүлдү!' : 'Статус обновлен!');
                          }}
                          className={`text-xs font-bold px-3 py-1 rounded-xl border cursor-pointer focus:outline-none ${
                            f.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : f.status === 'reviewing'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-50 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="received">{lang === 'ky' ? 'Жаңы кабыл алынды' : 'Получено'}</option>
                          <option value="reviewing">{lang === 'ky' ? 'Каралууда (Иште)' : 'На рассмотрении'}</option>
                          <option value="resolved">{lang === 'ky' ? 'Чечилди / Ишке ашты' : 'Решено'}</option>
                          <option value="clarification">{lang === 'ky' ? 'Түшүндүрмө берилди' : 'Разъяснено'}</option>
                        </select>

                        <button
                          onClick={() => {
                            if (window.confirm(lang === 'ky' ? 'Бул кайрылууну өчүрүүнү тастыктайсызбы?' : 'Удалить обращение?')) {
                              onDeleteFeedback(f.id);
                              showToast(lang === 'ky' ? 'Кайрылуу өчүрүлдү!' : 'Обращение удалено!');
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Өчүрүү"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      {f.message}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                      <div className="flex items-center gap-2">
                        <span>{f.isAnonymous ? 'Анонимдүү студент' : f.studentName || 'Студент'}</span>
                        <span>•</span>
                        <span>{f.faculty}</span>
                        <span>•</span>
                        <span>{f.submittedAt}</span>
                      </div>

                      <button
                        id={`btn-toggle-reply-${f.id}`}
                        onClick={() => {
                          setActiveReplyId(isReplying ? null : f.id);
                          setReplyText(f.officialResponse?.responseText || '');
                        }}
                        className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{f.officialResponse ? (lang === 'ky' ? 'Жоопту оңдоо' : 'Редактировать ответ') : (lang === 'ky' ? 'Расмий жооп жазуу' : 'Написать ответ')}</span>
                      </button>
                    </div>

                    {/* Official Response Display if exists */}
                    {f.officialResponse && !isReplying && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{f.officialResponse.responderName} ({f.officialResponse.responderRole})</span>
                          </span>
                          <span className="text-[10px] text-emerald-700">{f.officialResponse.respondedAt}</span>
                        </div>
                        <p className="text-emerald-950 font-medium">{f.officialResponse.responseText}</p>
                      </div>
                    )}

                    {/* Reply Form */}
                    {isReplying && (
                      <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-3 animate-in fade-in">
                        <h4 className="text-xs font-bold text-cyan-950 flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-cyan-600" />
                          <span>{lang === 'ky' ? 'Студентке расмий жооп даярдоо' : 'Подготовка официального ответа'}</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-cyan-900 mb-1">
                              {lang === 'ky' ? 'Жооп берген орган / Жетекчи' : 'Орган / Должность'}
                            </label>
                            <input
                              type="text"
                              value={replyResponderName}
                              onChange={(e) => setReplyResponderName(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-cyan-200 text-xs font-semibold text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-cyan-900 mb-1">
                              {lang === 'ky' ? 'Ролу / Статусу' : 'Роль / Статус'}
                            </label>
                            <input
                              type="text"
                              value={replyResponderRole}
                              onChange={(e) => setReplyResponderRole(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-cyan-200 text-xs font-semibold text-slate-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-cyan-900 mb-1">
                            {lang === 'ky' ? 'Расмий жооптун тексти' : 'Текст официального ответа'}
                          </label>
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={lang === 'ky' ? 'Көйгөй кандай чечилет же эмне чаралар көрүлдү...' : 'Какие меры приняты по данному обращению...'}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-cyan-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveReplyId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
                          </button>
                          <button
                            type="button"
                            id={`btn-publish-reply-${f.id}`}
                            onClick={() => handleSaveReply(f.id)}
                            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{lang === 'ky' ? 'Жоопту жарыялоо' : 'Опубликовать'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBSECTION 3: OFFICE HOURS & BOOKINGS */}
      {subSection === 'bookings' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder={lang === 'ky' ? 'Студент, окутуучу, тема...' : 'Студент, преподаватель...'}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: lang === 'ky' ? 'Бардыгы' : 'Все' },
                { id: 'confirmed', label: lang === 'ky' ? 'Тастыкталган' : 'Подтверждённые' },
                { id: 'completed', label: lang === 'ky' ? 'Өткөрүлгөн' : 'Завершённые' },
                { id: 'cancelled', label: lang === 'ky' ? 'Жокко чыккан' : 'Отменённые' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setBookingStatusFilter(s.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    bookingStatusFilter === s.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Билет #</th>
                    <th className="px-4 py-3">Студент</th>
                    <th className="px-4 py-3">Окутуучу</th>
                    <th className="px-4 py-3">Күнү жана убактысы</th>
                    <th className="px-4 py-3">Тема & Формат</th>
                    <th className="px-4 py-3">Статусу</th>
                    <th className="px-4 py-3 text-right">Аракеттер</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        {lang === 'ky' ? 'Жазылуулар табылган жок.' : 'Записи не найдены.'}
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-black text-cyan-800">
                          {b.ticketNumber}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{b.studentName}</div>
                          <div className="text-[11px] text-slate-500">{b.studentEmail} • {b.faculty}</div>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {b.teacherName}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{b.date}</div>
                          <div className="text-[11px] text-slate-500">{b.timeSlot}</div>
                        </td>
                        <td className="px-4 py-3 max-w-xs truncate">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 ${
                            b.format === 'online' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {b.format === 'online' ? 'Онлайн' : 'Офлайн'}
                          </span>
                          <span className="font-medium text-slate-800">{b.topic}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                            b.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : b.status === 'confirmed'
                              ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                              : b.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {b.status === 'completed' ? 'Өткөрүлдү' : b.status === 'confirmed' ? 'Тастыкталды' : b.status === 'cancelled' ? 'Жокко чыкты' : 'Күтүлүүдө'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.status !== 'completed' && (
                              <button
                                onClick={() => {
                                  onUpdateBookingStatus(b.id, 'completed');
                                  showToast(lang === 'ky' ? 'Жазылуу «Өткөрүлдү» деп белгиленди!' : 'Отмечено как завершённое!');
                                }}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                                title="Өткөрүлдү деп белгилөө"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (window.confirm(lang === 'ky' ? 'Жазылууну өчүрөсүзбү?' : 'Удалить запись?')) {
                                  onDeleteBooking(b.id);
                                  showToast(lang === 'ky' ? 'Жазылуу өчүрүлдү!' : 'Запись удалена!');
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Өчүрүү"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 4: WE HEARD YOU RESOLUTIONS */}
      {subSection === 'we-heard' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === 'ky' ? '«Биз уктык!» — Студенттик чечимдер реестри' : 'Реестр внедрённых решений «Мы услышали»'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ky' ? 'Университет тарабынан студенттердин кайрылуулары боюнча ишке ашырылган реалдуу өзгөрүүлөр' : 'Официальный публичный отчёт о решённых студенческих вопросах'}
              </p>
            </div>

            <button
              id="btn-add-we-heard-modal"
              onClick={() => setShowAddWeHeardModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ky' ? 'Жаңы чечим кошуу' : 'Добавить решение'}</span>
            </button>
          </div>

          {/* Modal / Form to add resolution */}
          {showAddWeHeardModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      {lang === 'ky' ? '«Биз уктык!» тактасына чечим кошуу' : 'Добавление решения в «Мы услышали»'}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setShowAddWeHeardModal(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateWeHeard} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {lang === 'ky' ? 'Чечимдин аталышы (Кыргызча)' : 'Название (Кыргызча)'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newWhTitleKy}
                      onChange={(e) => setNewWhTitleKy(e.target.value)}
                      placeholder="мис: Жатаканадагы Wi-Fi байланышы күчөтүлдү"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {lang === 'ky' ? 'Көйгөй эмнеде эле? (Студенттер эмне сураган)' : 'В чём заключалась проблема'}
                    </label>
                    <textarea
                      rows={2}
                      value={newWhProblemKy}
                      onChange={(e) => setNewWhProblemKy(e.target.value)}
                      placeholder="мис: 2-жатакананын 3-4-кабаттарында интернет сигналы начар болчу..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {lang === 'ky' ? 'Университет тарабынан көрүлгөн чара' : 'Принятые меры'} *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={newWhActionKy}
                      onChange={(e) => setNewWhActionKy(e.target.value)}
                      placeholder="мис: 4 даана жаңы роутер орнотулуп, ылдамдык 100 Мбит/сек көтөрүлдү."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {lang === 'ky' ? 'Жооптуу бөлүм' : 'Ответственный отдел'}
                      </label>
                      <input
                        type="text"
                        value={newWhDeptKy}
                        onChange={(e) => setNewWhDeptKy(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {lang === 'ky' ? 'Статусу' : 'Статус'}
                      </label>
                      <select
                        value={newWhStatus}
                        onChange={(e) => setNewWhStatus(e.target.value as any)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                      >
                        <option value="implemented">{lang === 'ky' ? 'Ишке ашырылды' : 'Внедрено'}</option>
                        <option value="in_progress">{lang === 'ky' ? 'Иште (Жүрүп жатат)' : 'В процессе'}</option>
                        <option value="explained">{lang === 'ky' ? 'Түшүндүрмө берилди' : 'Разъяснено'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddWeHeardModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
                    </button>
                    <button
                      type="submit"
                      id="btn-submit-weheard"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer shadow-md shadow-emerald-500/25"
                    >
                      {lang === 'ky' ? 'Жарыялоо' : 'Опубликовать'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Resolutions list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weHeardItems.map((item) => (
              <div 
                key={item.id} 
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {item.titleKy}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <select
                      value={item.status}
                      onChange={(e) => {
                        onUpdateWeHeardStatus(item.id, e.target.value as any);
                        showToast(lang === 'ky' ? 'Чечимдин статусу өзгөртүлдү!' : 'Статус решения изменён!');
                      }}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer"
                    >
                      <option value="implemented">{lang === 'ky' ? 'Ишке ашты' : 'Внедрено'}</option>
                      <option value="in_progress">{lang === 'ky' ? 'Иште' : 'В процессе'}</option>
                      <option value="explained">{lang === 'ky' ? 'Түшүндүрүлдү' : 'Разъяснено'}</option>
                    </select>

                    <button
                      onClick={() => {
                        if (window.confirm(lang === 'ky' ? 'Бул чечимди өчүрөсүзбү?' : 'Удалить кейс?')) {
                          onDeleteWeHeardItem(item.id);
                          showToast(lang === 'ky' ? 'Өчүрүлдү!' : 'Удалено!');
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs space-y-1.5">
                  <p className="text-slate-500">
                    <strong className="text-slate-700 font-semibold">{lang === 'ky' ? 'Көйгөй:' : 'Проблема:'}</strong> {item.problemKy}
                  </p>
                  <p className="text-emerald-900 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100">
                    <strong className="font-extrabold">{lang === 'ky' ? 'Көрүлгөн чара:' : 'Решение:'}</strong> {item.actionTakenKy}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>{item.departmentKy}</span>
                  <span>{item.dateResolved}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION 5: DIALOGUE & TOPICS */}
      {subSection === 'dialogue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Upcoming Dialogue Settings */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {lang === 'ky' ? 'Кезектеги Диалог жолугушуусу' : 'Очередная встреча Диалога'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ky' ? 'Өтүүчү убактысы жана орундар' : 'Параметры открытой встречи'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ky' ? 'Жолугушуунун аталышы' : 'Название встречи'}
                </label>
                <input
                  type="text"
                  value={dialogueTitleKy}
                  onChange={(e) => setDialogueTitleKy(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ky' ? 'Күнү' : 'Дата'}
                  </label>
                  <input
                    type="date"
                    value={dialogueDate}
                    onChange={(e) => setDialogueDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ky' ? 'Убактысы' : 'Время'}
                  </label>
                  <input
                    type="text"
                    value={dialogueTime}
                    onChange={(e) => setDialogueTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ky' ? 'Өтүүчү жай' : 'Место'}
                </label>
                <input
                  type="text"
                  value={dialogueLocation}
                  onChange={(e) => setDialogueLocation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ky' ? 'Орундардын сыйымдуулугу' : 'Макс. вместимость'}
                </label>
                <input
                  type="number"
                  value={dialogueCapacity}
                  onChange={(e) => setDialogueCapacity(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-50 text-cyan-900 text-xs space-y-1">
                <span className="font-bold block">
                  {lang === 'ky' ? 'Учурдагы катталуулар:' : 'Текущие регистрации:'}
                </span>
                <span className="text-lg font-black">{dialogueEvent.registeredCount} / {dialogueCapacity}</span>
              </div>

              <button
                type="button"
                id="btn-save-dialogue-event"
                onClick={handleSaveDialogueEvent}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{lang === 'ky' ? 'Өзгөртүүлөрдү сактоо' : 'Сохранить параметры'}</span>
              </button>
            </div>
          </div>

          {/* Student Proposed Topics Moderation */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {lang === 'ky' ? 'Студенттер сунуштаган темалар' : 'Темы от студентов'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ky' ? 'Диалогго алып чыгуу үчүн добуш топтоп жаткан сунуштар' : 'Темы для голосования к следующему диалогу'}
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {dialogueTopics.length} {lang === 'ky' ? 'тема' : 'тем'}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {dialogueTopics.map((topic) => (
                <div 
                  key={topic.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                        {topic.category}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900">{topic.titleKy}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{topic.descriptionKy}</p>
                    <span className="text-[10px] text-slate-400">Сунуштаган: {topic.proposedBy}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-black text-cyan-700 block">{topic.votes}</span>
                      <span className="text-[10px] text-slate-400">добуш</span>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(lang === 'ky' ? 'Теманы өчүрөсүзбү?' : 'Удалить тему?')) {
                          onDeleteTopic(topic.id);
                          showToast(lang === 'ky' ? 'Тема өчүрүлдү!' : 'Тема удалена!');
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 6: ADAPTATION WEEK & MENTORS */}
      {subSection === 'adaptation-mentors' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Mentors Management */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {lang === 'ky' ? 'Студент-наставниктердин тизмеси' : 'Студенты-наставники'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ky' ? 'Биринчи курстарды коштоп жүрүүчү активдүү студенттер' : 'Старшекурсники, сопровождающие адаптацию первокурсников'}
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                {mentors.length} {lang === 'ky' ? 'насаатчы' : 'менторов'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mentors.map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                        <p className="text-[10px] text-slate-500">{m.year}-курс • {m.facultyKy}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(lang === 'ky' ? 'Насаатчыны өчүрөсүзбү?' : 'Удалить профиль ментора?')) {
                          onDeleteMentor(m.id);
                          showToast(lang === 'ky' ? 'Өчүрүлдү!' : 'Удалено!');
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/80">
                    <span className="text-slate-500">
                      {m.sessionsCompleted} {lang === 'ky' ? 'сессия өткөрдү' : 'сессий проведено'}
                    </span>
                    <button
                      onClick={() => {
                        onToggleMentorAvailability(m.id);
                        showToast(lang === 'ky' ? 'Жеткиликтүүлүк статусу жаңыртылды!' : 'Статус обновлен!');
                      }}
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] cursor-pointer ${
                        m.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {m.isAvailable ? (lang === 'ky' ? 'Жеткиликтүү' : 'Доступен') : (lang === 'ky' ? 'Бош эмес' : 'Занят')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Expectations Moderation */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {lang === 'ky' ? '«Менин күтүүлөрүм» тактасынын модерациясы' : 'Модерация доски ожиданий'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ky' ? 'Студенттердин адаптация жумалыгындагы каалоолору жана суроолору' : 'Ожидания первокурсников'}
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {expectations.slice(0, 6).map((exp) => (
                <div key={exp.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{exp.author}</span>
                      <span className="text-[10px] text-slate-400">• {exp.faculty} • {exp.date}</span>
                    </div>
                    <p className="text-xs text-slate-700">{exp.textKy}</p>
                    {exp.responseFromTeacher && (
                      <p className="text-[11px] text-cyan-800 bg-cyan-50 p-2 rounded-lg mt-1 font-medium">
                        <strong>Жооп:</strong> {exp.responseFromTeacher}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(lang === 'ky' ? 'Өчүрүүнү тастыктайсызбы?' : 'Удалить запись?')) {
                        onDeleteExpectation(exp.id);
                        showToast(lang === 'ky' ? 'Күтүү өчүрүлдү!' : 'Запись удалена!');
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION 7: ONLINE Q&A MODERATION */}
      {subSection === 'questions' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === 'ky' ? 'DEM-CAMP Online: Суроолорго расмий жооп берүү' : 'Онлайн Q&A: Официальные ответы деканата'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ky' ? 'Студенттердин суроолоруна администрация же деканаттын атынан верификацияланган жооп берүү' : 'Верифицированные ответы руководства и деканата'}
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {onlineQuestions.length} {lang === 'ky' ? 'суроо' : 'вопросов'}
            </span>
          </div>

          <div className="space-y-3">
            {onlineQuestions.map((q) => {
              const isAnswering = answeringQuestionId === q.id;
              return (
                <div 
                  key={q.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {q.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {q.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400">• {q.date}</span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium">{q.questionKy}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(lang === 'ky' ? 'Суроону өчүрөсүзбү?' : 'Удалить вопрос?')) {
                          onDeleteQuestion(q.id);
                          showToast(lang === 'ky' ? 'Суроо өчүрүлдү!' : 'Вопрос удалён!');
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Answers list */}
                  {q.answers.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {q.answers.map((ans) => (
                        <div key={ans.id} className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-extrabold text-cyan-800 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                              <span>{ans.authorName}</span>
                            </span>
                            <span className="text-slate-400">{ans.date}</span>
                          </div>
                          <p className="text-slate-700">{ans.answerKy}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Answer Box Form */}
                  {isAnswering ? (
                    <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 space-y-2.5">
                      <label className="block text-xs font-bold text-cyan-950">
                        {lang === 'ky' ? 'ОшМПУ Деканаты / Администрациясынын расмий жообу:' : 'Официальный ответ:'}
                      </label>
                      <textarea
                        rows={3}
                        value={adminAnswerText}
                        onChange={(e) => setAdminAnswerText(e.target.value)}
                        placeholder={lang === 'ky' ? 'Жообуңузду жазыңыз...' : 'Введите ответ...'}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-cyan-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setAnsweringQuestionId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAnswerSubmit(q.id)}
                          className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
                        >
                          {lang === 'ky' ? 'Жоопту жарыялоо' : 'Отправить ответ'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          setAnsweringQuestionId(q.id);
                          setAdminAnswerText('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{lang === 'ky' ? 'Расмий жооп берүү' : 'Ответить официально'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
