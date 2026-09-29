import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Dna,
  Zap,
  Globe,
  Languages,
  Activity,
  GraduationCap,
  Baby,
  Copy,
  Check,
  Download,
  Presentation,
  Video,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Gamepad2,
  Ticket,
  Award,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Printer,
  Brain,
  Lightbulb
} from 'lucide-react';
import { Language } from '../../types';
import {
  PRACTICE_SUBJECTS,
  PRACTICE_DETAILED_DATA,
  PracticeSubjectId
} from '../../data/practiceData';
import { GradePedagogySection } from './GradePedagogySection';

export type SubjectTabId =
  | 'topics'
  | 'plans'
  | 'methods'
  | 'age-pedagogy'
  | 'practical'
  | 'assessment'
  | 'presentation'
  | 'video'
  | 'pdf';

interface SubjectPageViewProps {
  lang: Language;
  initialSubjectId?: PracticeSubjectId;
  initialGradeFilter?: string;
  onOpenAiForTopic?: (subjectId: string, topicName: string, grade: string) => void;
}

export const SubjectPageView: React.FC<SubjectPageViewProps> = ({
  lang,
  initialSubjectId = 'biology',
  initialGradeFilter = 'all',
  onOpenAiForTopic
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<PracticeSubjectId>(initialSubjectId);
  const [activeTab, setActiveTab] = useState<SubjectTabId>('topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>(initialGradeFilter);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [selectedTopicForModal, setSelectedTopicForModal] = useState<any | null>(null);

  // Current Subject
  const currentSubjectMeta = PRACTICE_SUBJECTS.find((s) => s.id === selectedSubjectId) || PRACTICE_SUBJECTS[0];
  const currentSubjectData = PRACTICE_DETAILED_DATA[selectedSubjectId] || PRACTICE_DETAILED_DATA.biology;

  // Icon mapping
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return Calculator;
      case 'FlaskConical': return FlaskConical;
      case 'Dna': return Dna;
      case 'Zap': return Zap;
      case 'Globe': return Globe;
      case 'Languages': return Languages;
      case 'Activity': return Activity;
      case 'Baby': return Baby;
      case 'GraduationCap': return GraduationCap;
      default: return BookOpen;
    }
  };

  const CurrentIcon = getSubjectIcon(currentSubjectMeta.iconName);

  // Subject Tabs as requested
  const subjectTabs: { id: SubjectTabId; labelKy: string; labelRu: string; icon: any }[] = [
    { id: 'topics', labelKy: 'Темалар', labelRu: 'Темы', icon: Layers },
    { id: 'plans', labelKy: 'Сабактын иштелмеси', labelRu: 'Поурочные планы', icon: FileText },
    { id: 'methods', labelKy: 'Методика', labelRu: 'Методика', icon: Sparkles },
    { id: 'age-pedagogy', labelKy: 'Жаш өзгөчөлүк & Кеңештер', labelRu: 'Возраст и методика', icon: Brain },
    { id: 'practical', labelKy: 'Практикалык иштер', labelRu: 'Практические работы', icon: FlaskConical },
    { id: 'assessment', labelKy: 'Баалоо', labelRu: 'Оценивание', icon: Award },
    { id: 'presentation', labelKy: 'Презентация', labelRu: 'Презентация', icon: Presentation },
    { id: 'video', labelKy: 'Видео', labelRu: 'Видео', icon: Video },
    { id: 'pdf', labelKy: 'PDF жүктөө', labelRu: 'Скачать PDF', icon: Download }
  ];

  // Helper copy function
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filtered topics
  const filteredTopics = useMemo(() => {
    return currentSubjectData.topicExplanations.filter((t) => {
      const matchSearch =
        t.topicKy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.grade.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGrade = gradeFilter === 'all' || t.grade.includes(gradeFilter.replace('grade-', ''));
      return matchSearch && matchGrade;
    });
  }, [currentSubjectData, searchQuery, gradeFilter]);

  // Filtered lesson plans
  const filteredPlans = useMemo(() => {
    return currentSubjectData.lessonPlans.filter((p) => {
      const matchSearch =
        p.topicKy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.grade.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGrade = gradeFilter === 'all' || p.grade.includes(gradeFilter.replace('grade-', ''));
      return matchSearch && matchGrade;
    });
  }, [currentSubjectData, searchQuery, gradeFilter]);

  return (
    <div className="space-y-6">
      {/* 1. 10 Subjects Horizontal Selector Bar */}
      <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs overflow-x-auto select-none">
        <div className="flex items-center gap-2 min-w-max">
          {PRACTICE_SUBJECTS.map((subject) => {
            const isSelected = subject.id === selectedSubjectId;
            const Icon = getSubjectIcon(subject.iconName);

            return (
              <button
                key={subject.id}
                id={`btn-select-subject-${subject.id}`}
                onClick={() => {
                  setSelectedSubjectId(subject.id);
                  setExpandedTopicId(null);
                }}
                className={`px-3.5 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20'
                    : 'bg-slate-100/80 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                <span>{lang === 'ky' ? subject.nameKy.split(' (')[0] : subject.nameRu.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Subject Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentSubjectMeta.colorScheme} text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10`}>
              <CurrentIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                  {lang === 'ky' ? 'Предметтик багыт' : 'Предметный модуль'}
                </span>
                <span className="text-xs text-slate-400 font-medium">ОшМПУ Методикалык базасы</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'ky' ? currentSubjectMeta.nameKy : currentSubjectMeta.nameRu}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
                {lang === 'ky' ? currentSubjectMeta.shortDescKy : currentSubjectMeta.shortDescRu}
              </p>
            </div>
          </div>

          {/* Quick stats on topics and plans */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-lg font-black text-emerald-700">
                {currentSubjectData.lessonPlans.length}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Даяр план</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-lg font-black text-emerald-700">
                {currentSubjectData.topicExplanations.length}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Түшүндүрмө</span>
            </div>
          </div>
        </div>

        {/* 3. The 8 Tabs Navigation Bar as requested */}
        <div className="mt-8 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max pb-1">
            {subjectTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  id={`tab-subject-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-t-xl font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{lang === 'ky' ? tab.labelKy : tab.labelRu}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: ТЕМАЛАР (Full detailed cards with all 8 items requested by user) */}
      {activeTab === 'topics' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-topics-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ky' ? 'Тема боюнча издөө...' : 'Поиск по теме...'}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 shrink-0">Класс:</span>
              <select
                id="select-topics-grade-filter"
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">Бардык класстар</option>
                <option value="1">1-класс</option>
                <option value="2">2-класс</option>
                <option value="3">3-класс</option>
                <option value="4">4-класс</option>
                <option value="5">5-класс</option>
                <option value="6">6-класс</option>
                <option value="7">7-класс</option>
                <option value="8">8-класс</option>
                <option value="9">9-класс</option>
                <option value="10">10-класс</option>
                <option value="11">11-класс</option>
              </select>

              <button
                id="btn-quick-grade-pedagogy"
                onClick={() => setActiveTab('age-pedagogy')}
                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-200/70 transition-colors cursor-pointer shrink-0"
              >
                <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">Жаш өзгөчөлүгү & 8 кеңеш</span>
                <span className="md:hidden">8 Кеңеш</span>
              </button>
            </div>
          </div>

          {/* Topics List with the 8 sub-elements */}
          <div className="space-y-4">
            {filteredTopics.map((topic, index) => {
              const isExpanded = expandedTopicId === topic.id || index === 0;

              return (
                <div
                  key={topic.id}
                  id={`topic-item-${topic.id}`}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:border-emerald-300 transition-all"
                >
                  {/* Topic Title Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60">
                            {topic.grade}
                          </span>
                          <span className="text-[11px] font-medium text-slate-600">
                            Мамлекеттик стандарт
                          </span>
                        </div>
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                          {lang === 'ky' ? topic.topicKy : topic.topicRu}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {onOpenAiForTopic && (
                        <button
                          id={`btn-ai-for-topic-${topic.id}`}
                          onClick={() => onOpenAiForTopic(selectedSubjectId, topic.topicKy, topic.grade)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>AI Конспект</span>
                        </button>
                      )}
                      <button
                        id={`btn-toggle-topic-${topic.id}`}
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'Жашыруу' : 'Толук көрүү (8 бөлүм)'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* 8 Full Requirements Grid (Always readable, expanded with more depth) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* 1. Окуу максаты */}
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/80">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        1. Окуу максаты (Learning Objective):
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed font-normal">
                        Окуучулар теманын маңызын түшүнүп, турмуштук мисалдар аркылуу аныктамасын так айта алышат жана көнүгүүлөрдү чыгара алышат.
                      </p>
                    </div>

                    {/* 2. Сабактын түшүндүрмөсү */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                        2. Сабактын түшүндүрмөсү & Образдуу модели:
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed font-normal">
                        {topic.explanationModelKy}
                      </p>
                    </div>

                    {/* 3. Сабактын этаптары (Хронометраж) */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        3. Сабактын этаптары (45 мүнөт):
                      </span>
                      <ul className="text-[11px] text-slate-700 space-y-1">
                        <li>• Уюштуруу & Мотивация (3 мин)</li>
                        <li>• Блиц-кайталоо & Мээге чабуул (7 мин)</li>
                        <li>• Жаңы түшүнүктү интерактивдүү ачуу (15 мин)</li>
                        <li>• Жуптук машыгуу & Дидактикалык көнүгүү (12 мин)</li>
                        <li>• Баалоо, Рефлексия & Exit Ticket (8 мин)</li>
                      </ul>
                    </div>

                    {/* 4. Колдонулуучу усулдар (STEAM, 4C, Bloom, PISA) */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        4. Колдонулуучу усулдар:
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          STEAM интеграциясы
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                          4C көндүмдөрү
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Bloom: Анализ & Баалоо
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                          PISA: Функционалдык сабаттуулук
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Detailed 4 items when expanded */}
                  {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 animate-fadeIn">
                      {/* 5. Интерактивдүү оюндар */}
                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1.5">
                          <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
                          5. Интерактивдүү оюндар (Warm-up / Gamification):
                        </span>
                        <p className="text-xs text-amber-950 leading-relaxed font-normal">
                          «Турмуштук аналогия таймашы»: {topic.realLifeAnalogyKy} Окуучулар 2 топко бөлүнүп, тема боюнча өз турмушундагы мисалдарды таап, 1 мүнөттө далилдешет.
                        </p>
                      </div>

                      {/* 6. Worksheet (Тапшырма барагы) */}
                      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            6. Worksheet (Даяр таркатма барак):
                          </span>
                          <button
                            onClick={() => handleCopy(`ws-${topic.id}`, `ТАПШЫРМА БАРАГЫ (WORKSHEET)\nТема: ${topic.topicKy}\nКласс: ${topic.grade}\n\n1-тапшырма: Аныктамасын жазыңыз.\n2-тапшырма: ${topic.explanationModelKy}\n3-тапшырма: Турмуштан 2 мисал келтириңиз.`)}
                            className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === `ws-${topic.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>Көчүрүү</span>
                          </button>
                        </div>
                        <p className="text-xs text-emerald-950 font-mono bg-white p-2.5 rounded-xl border border-emerald-200/60 text-[11px]">
                          1-көнүгүү: Терминдерди дал келтиргиле.<br />
                          2-көнүгүү: Схемадагы бош орундарды толтургула.<br />
                          3-көнүгүү: «Эмне үчүн?» деген суроого 2 аргумент жазгыла.
                        </p>
                      </div>

                      {/* 7. Exit Ticket (Чыгуу билети) */}
                      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/60">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-1.5">
                          <Ticket className="w-3.5 h-3.5 text-indigo-600" />
                          7. Exit Ticket (Чыгуу билети - 3 мүнөт):
                        </span>
                        <div className="text-xs text-indigo-950 space-y-1 bg-white p-2.5 rounded-xl border border-indigo-100">
                          <p>1. Бүгүн сабактан үйрөнгөн 1 жаңы нерсем: _________</p>
                          <p>2. Мага дагы деле түшүнүксүз болуп калган суроо: _________</p>
                        </div>
                      </div>

                      {/* 8. Баалоо критерийи (Рубрика) */}
                      <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-1.5">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          8. Баалоо критерийи (Дескрипторлор):
                        </span>
                        <ul className="text-[11px] text-slate-700 space-y-1">
                          <li>• «5» (Эң жакшы): 3төн ашык туура аргумент келтирет, өз алдынча маселени чыгарат.</li>
                          <li>• «4» (Жакшы): Теманы билет, бирок 1-2 майда ката кетирет.</li>
                          <li>• «3» (Канааттандырарлык): Мугалимдин багыттоочу суроосу менен гана жооп берет.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: САБАКТЫН ИШТЕЛМЕСИ (Full Lesson Plans / Конспекты) */}
      {activeTab === 'plans' && (
        <div className="space-y-5">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between">
            <span className="text-xs text-emerald-900 font-medium">
              Мамлекеттик стандартка ылайык 3 максаты, хронометражы жана баалоосу камтылган даяр сабак конспектилери.
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-white px-3 py-1 rounded-xl shadow-xs">
              {filteredPlans.length} даяр план
            </span>
          </div>

          <div className="space-y-4">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs mr-2">
                      {plan.grade}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Убактысы: {plan.duration} • Түрү: {plan.lessonTypeKy}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                      {lang === 'ky' ? plan.topicKy : plan.topicRu}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      const fullPlanText = `ОШ МЕКТЕП-ПРАКТИКАСЫ: САБАКТЫН КОНСПЕКТИ\nПредмет: ${currentSubjectMeta.nameKy}\nКласс: ${plan.grade}\nТема: ${plan.topicKy}\n\n1. Максаттары:\n- Билим берүүчүлүк: ${plan.goalsKy.educational}\n- Өнүктүрүүчүлүк: ${plan.goalsKy.developmental}\n- Тарбиялык: ${plan.goalsKy.educative}\n\n2. Жабдылышы:\n${plan.equipmentKy.join(', ')}\n\n3. Этаптары:\n${plan.steps.map(s => `${s.stepNumber}. ${s.stageKy} (${s.timeMinutes} мин): Мугалим: ${s.teacherActivityKy} | Окуучу: ${s.studentActivityKy}`).join('\n')}\n\nРефлексия: ${plan.reflectionKy}`;
                      handleCopy(`plan-${plan.id}`, fullPlanText);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    {copiedId === `plan-${plan.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === `plan-${plan.id}` ? 'Көчүрүлдү!' : 'Планды толук көчүрүү'}</span>
                  </button>
                </div>

                {/* Goals */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-1">🎯 1. Билим берүүчүлүк:</span>
                    <p className="text-slate-700">{plan.goalsKy.educational}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-1">💡 2. Өнүктүрүүчүлүк:</span>
                    <p className="text-slate-700">{plan.goalsKy.developmental}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="font-bold text-purple-900 block mb-1">🤝 3. Тарбиялык:</span>
                    <p className="text-slate-700">{plan.goalsKy.educative}</p>
                  </div>
                </div>

                {/* Steps Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">№</th>
                        <th className="p-3">Сабактын этабы</th>
                        <th className="p-3">Мүнөт</th>
                        <th className="p-3">Мугалимдин иш-аракети</th>
                        <th className="p-3">Окуучунун иш-аракети</th>
                        <th className="p-3">Усулдар & Баалоо</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {plan.steps.map((st) => (
                        <tr key={st.stepNumber} className="hover:bg-slate-50/80">
                          <td className="p-3 font-bold text-emerald-700">{st.stepNumber}</td>
                          <td className="p-3 font-semibold text-slate-900">{st.stageKy}</td>
                          <td className="p-3 text-slate-500 font-mono">{st.timeMinutes} мин</td>
                          <td className="p-3 text-slate-700">{st.teacherActivityKy}</td>
                          <td className="p-3 text-slate-700">{st.studentActivityKy}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold block mb-1">
                              {st.methodsKy}
                            </span>
                            <span className="text-[10px] text-slate-500">{st.assessmentKy}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: МЕТОДИКА (Subject-Specific Methods) */}
      {activeTab === 'methods' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentSubjectData.methods.map((method, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {method.nameKy}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Сунушталган усул</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">{method.nameKy}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{method.descriptionKy}</p>
              
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Кадам сайын колдонуу:</span>
                {method.stepByStepKy.map((step, sIdx) => (
                  <p key={sIdx} className="text-slate-600 text-[11px]">• {step}</p>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 text-emerald-700 font-bold">
                <span>{method.bestForKy}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: ЖАШ ӨЗГӨЧӨЛҮГҮ ЖАНА МЕТОДИКАЛЫК КЕҢЕШТЕР (8 Cards & Infographics) */}
      {activeTab === 'age-pedagogy' && (
        <GradePedagogySection
          lang={lang}
          selectedGradeId={
            selectedSubjectId === 'kindergarten'
              ? 'kindergarten'
              : gradeFilter !== 'all'
              ? `grade-${gradeFilter}`
              : 'grade-1'
          }
          onExploreSubjects={(gid) => {
            const num = gid.replace('grade-', '');
            setGradeFilter(num === 'kindergarten' ? 'all' : num);
            setActiveTab('topics');
          }}
        />
      )}

      {/* TAB 4: ПРАКТИКАЛЫК ИШТЕР (Labs & Hands-on) */}
      {activeTab === 'practical' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-emerald-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentSubjectMeta.nameKy}: Лабораториялык жана практикалык иштер
              </h3>
              <p className="text-xs text-slate-500">
                Коопсуздук эрежелери, куралдар тизмеси жана окуучулардын отчеттук бланкы.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                1-Практикалык иш:
              </span>
              <h4 className="font-bold text-sm text-slate-900">
                «Табигый объектилерге байкоо жүргүзүү жана моделдөө»
              </h4>
              <p className="text-xs text-slate-700">
                Окуучулар микроскоп же приборлор менен тажрыйба жасап, жыйынтыгын таблицага түшүрүшөт.
              </p>
              <button
                onClick={() => handleCopy('lab-inst', 'ЛАБОРАТОРИЯЛЫК ИШ НУСКАМАСЫ:\n1. Коопсуздук эрежеси менен таанышуу.\n2. Приборлорду орнотуу.\n3. Тажрыйбаны жасоо.\n4. Корутунду чыгаруу.')}
                className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Нускаманы көчүрүү</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                2-Практикалык иш:
              </span>
              <h4 className="font-bold text-sm text-slate-900">
                «Көйгөйлүү кырдаалдарды чечүү жана маалыматты графикалоо»
              </h4>
              <p className="text-xs text-slate-700">
                Реалдуу турмуштук сандарды диаграммага айлантуу жана PISA форматында чечим сунуштоо.
              </p>
              <button
                onClick={() => handleCopy('lab-inst-2', 'ПРАКТИКАЛЫК ИШ БЛАНКЫ:\n1. Баштапкы маалыматтар.\n2. График чийүү.\n3. Анализ.')}
                className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Бланкты көчүрүү</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: БААЛОО (Assessment Rubrics) */}
      {activeTab === 'assessment' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-emerald-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentSubjectMeta.nameKy}: Баалоо критерийлери жана рубрикалар
              </h3>
              <p className="text-xs text-slate-500">
                Формативдик жана суммативдик баалоонун дескрипторлору.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">
                4 Деңгээлдүү Баалоо Рубрикасы:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold text-emerald-700 block mb-1">Деңгээл 4 (Эң жогорку):</span>
                  <p className="text-slate-600 text-[11px]">Теманы толук өздөштүргөн, чыгармачыл жана аргументтүү ой жүгүртөт.</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold text-blue-700 block mb-1">Деңгээл 3 (Ортодон жогору):</span>
                  <p className="text-slate-600 text-[11px]">Көнүгүүлөрдү өз алдынча чыгарат, майда суроолор боюнча кайрылат.</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold text-amber-700 block mb-1">Деңгээл 2 (Орточо):</span>
                  <p className="text-slate-600 text-[11px]">Негизги аныктамаларды билет, бирок маселе чыгарууда кыйналат.</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold text-rose-700 block mb-1">Деңгээл 1 (Баштапкы):</span>
                  <p className="text-slate-600 text-[11px]">Мугалимдин үзгүлтүксүз колдоосуна муктаж.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ПРЕЗЕНТАЦИЯ (Slides & Visual Materials) */}
      {activeTab === 'presentation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Presentation className="w-8 h-8 text-emerald-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentSubjectMeta.nameKy}: Сабакка даяр презентациялар (Слайддар)
              </h3>
              <p className="text-xs text-slate-500">
                Интерактивдүү доскада же проектордо көрсөтүү үчүн структураланган слайддар.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                PPTX Шаблон • 12 Слайд
              </span>
              <h4 className="font-bold text-sm text-slate-900">
                «Негизги түшүнүктөр, визуалдык инфографика жана суроолор»
              </h4>
              <p className="text-xs text-slate-600">
                Түстүү схемалар, анимациялык өтүүлөр жана окуучулар үчүн блиц-тест слайддары камтылган.
              </p>
              <button
                onClick={() => handleCopy('pptx-str', 'ПРЕЗЕНТАЦИЯ СТРУКТУРАСЫ:\nСлайд 1: Тема жана сабактын максаты\nСлайд 2: Мээге чабуул суроолору\nСлайд 3: Жаңы термин жана аныктама\nСлайд 4: Инфографика жана сүрөт\nСлайд 5: Топтук тапшырма\nСлайд 6: Рефлексия')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Слайд структурасын көчүрүү</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                Көрсөтмө куралдар
              </span>
              <h4 className="font-bold text-sm text-slate-900">
                «Интерактивдүү схемалар жана таблицалар»
              </h4>
              <p className="text-xs text-slate-600">
                Окуучулардын көңүлүн буруу үчүн кыска диаграммалар жана графикалык уюштургучтар.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ВИДЕО (Video Lessons & Masterclasses) */}
      {activeTab === 'video' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Video className="w-8 h-8 text-emerald-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentSubjectMeta.nameKy}: Видео сабактар жана ачык мастер-класстар
              </h3>
              <p className="text-xs text-slate-500">
                ОшМПУнун тажрыйбалуу методисттеринин үлгүлүү сабактарынын видеолору.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-white relative overflow-hidden group">
                <div className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  ▶
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                  15:20
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 mt-2">
                «Сабакта интерактивдүү усулдарды туура колдонуу чеберчилиги»
              </h4>
              <p className="text-[11px] text-slate-500">
                ОшМПУ Методикалык кафедрасынын ачык сабагы.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-white relative overflow-hidden group">
                <div className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  ▶
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                  12:45
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 mt-2">
                «Класста тартипти сактоо жана кыйкырбай башкаруу сырлары»
              </h4>
              <p className="text-[11px] text-slate-500">
                Практиканттарга психологдун практикалык кеңеши.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: PDF ЖҮКТӨӨ (Downloadable Resources) */}
      {activeTab === 'pdf' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Download className="w-8 h-8 text-emerald-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentSubjectMeta.nameKy}: PDF жана DOCX материалдарын жүктөө
              </h3>
              <p className="text-xs text-slate-500">
                Басып чыгарууга даяр поурочный пландар, таркатма материалдар жана баалоо барактары.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-emerald-700" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    «{currentSubjectMeta.nameKy} — Даяр поурочный пландар жыйнагы (1-чейрек)»
                  </h4>
                  <span className="text-[11px] text-slate-500">PDF • 45 бет • Кыргыз Республикасынын стандарты</span>
                </div>
              </div>
              <button
                onClick={() => handleCopy('pdf-dl-1', `PDF ЖҮКТӨӨ ТАСТЫКТООСУ: ${currentSubjectMeta.nameKy} сабактары жүктөлдү.`)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Жүктөө</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-slate-700" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    «Таркатма материалдар жана Worksheets (1-11-класс)»
                  </h4>
                  <span className="text-[11px] text-slate-500">DOCX • Басып чыгарууга ыңгайлашкан формат</span>
                </div>
              </div>
              <button
                onClick={() => handleCopy('pdf-dl-2', `DOCX ЖҮКТӨӨ ТАСТЫКТООСУ: Таркатма материалдар жүктөлдү.`)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Жүктөө</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
