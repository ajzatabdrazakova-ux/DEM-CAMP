import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Sparkles, 
  Search, 
  Download, 
  Eye, 
  Star, 
  Bookmark, 
  BookmarkCheck, 
  Filter, 
  Play, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Share2, 
  Layers, 
  GraduationCap, 
  HelpCircle, 
  X, 
  ChevronRight, 
  Check, 
  FileCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Language, LearningResource, ResourceCategory, ResourceFormat } from '../types';
import { learningResources } from '../data/learningResources';
import resourceHeroImg from '../assets/images/resource_center_hero_1789403568098.jpg';

interface ResourceCenterProps {
  lang: Language;
  onNavigateToMap?: () => void;
}

export const ResourceCenter: React.FC<ResourceCenterProps> = ({ lang }) => {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | ResourceFormat>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dem_camp_bookmarked_resources');
      return saved ? JSON.parse(saved) : ['res-ort-prep-math', 'res-pdf-ai-prompt-engineering'];
    } catch {
      return ['res-ort-prep-math', 'res-pdf-ai-prompt-engineering'];
    }
  });

  // Modal State
  const [activePreviewResource, setActivePreviewResource] = useState<LearningResource | null>(null);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Interactive Quiz state for PISA/ORT interactive items
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Suggest Resource Form
  const [suggestForm, setSuggestForm] = useState({
    title: '',
    category: 'methodology',
    format: 'pdf',
    author: '',
    link: '',
    description: ''
  });
  const [suggestSubmitted, setSuggestSubmitted] = useState(false);

  // Bookmark toggle
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('dem_camp_bookmarked_resources', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const handleDownload = (res: LearningResource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadSuccessToast(
      lang === 'ky' 
        ? `«${res.titleKy}» материалы ийгиликтүү жүктөлдү!` 
        : `Материал «${res.titleRu}» успешно скачан!`
    );
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 3500);
  };

  // Filtered resources
  const filteredResources = useMemo(() => {
    return learningResources.filter(res => {
      // Category match
      if (activeCategory !== 'all' && res.category !== activeCategory) {
        return false;
      }
      // Format match
      if (selectedFormat !== 'all' && res.format !== selectedFormat) {
        return false;
      }
      // Level match
      if (selectedLevel !== 'all' && res.level !== selectedLevel && res.level !== 'all-levels') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = res.titleKy.toLowerCase().includes(q) || res.titleRu.toLowerCase().includes(q);
        const matchDesc = res.descriptionKy.toLowerCase().includes(q) || res.descriptionRu.toLowerCase().includes(q);
        const matchAuthor = res.authorKy.toLowerCase().includes(q) || res.authorRu.toLowerCase().includes(q);
        const matchTags = res.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchAuthor && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, selectedFormat, selectedLevel, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: learningResources.length,
      methodology: learningResources.filter(r => r.category === 'methodology').length,
      video: learningResources.filter(r => r.category === 'video').length,
      pdf: learningResources.filter(r => r.category === 'pdf').length,
      ortPisaSteam: learningResources.filter(r => r.category === 'ort-pisa-steam').length,
    };
  }, []);

  const categoryTabs = [
    { id: 'all' as ResourceCategory, labelKy: 'Бардык ресурстар', labelRu: 'Все ресурсы', count: counts.all, icon: Layers },
    { id: 'methodology' as ResourceCategory, labelKy: 'Методикалык материалдар', labelRu: 'Методические материалы', count: counts.methodology, icon: BookOpen },
    { id: 'video' as ResourceCategory, labelKy: 'Видео сабактар', labelRu: 'Видео уроки', count: counts.video, icon: Video },
    { id: 'pdf' as ResourceCategory, labelKy: 'PDF китептер & Колдонмолор', labelRu: 'PDF пособия', count: counts.pdf, icon: FileText },
    { id: 'ort-pisa-steam' as ResourceCategory, labelKy: 'ЖРТ / ПИЗА / STEAM', labelRu: 'ОРТ / PISA / STEAM', count: counts.ortPisaSteam, icon: Sparkles },
  ];

  const getFormatBadge = (format: ResourceFormat) => {
    switch (format) {
      case 'pdf':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          label: 'PDF Document',
          icon: FileText
        };
      case 'video':
        return {
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          label: 'Video Course',
          icon: Video
        };
      case 'interactive':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          label: 'Interactive Lab',
          icon: Sparkles
        };
      case 'doc':
      default:
        return {
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          label: 'Guide / Checklist',
          icon: BookOpen
        };
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-950/95 border border-emerald-500 text-emerald-200 shadow-2xl backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-semibold">{downloadSuccessToast}</span>
        </div>
      )}

      {/* Main Hero Header Banner (Mirroring design screenshot) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-10">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text & Stats */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <span>📚 2. Ресурстар борбору (Resource Center)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {lang === 'ky' 
                ? 'Билим берүү жана методикалык ресурстар борбору' 
                : 'Центр образовательных и методических ресурсов'}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {lang === 'ky'
                ? 'Студенттердин жана окутуучулардын окуу процессин жеңилдетүү үчүн текшерилген методикалык материалдар, видеосабактар, электрондук PDF колдонмолор, ошондой эле ЖРТ, PISA жана STEAM боюнча практикалык материалдардын санарип фонду.'
                : 'Единый цифровой фонд проверенных методических разработок, видеоуроков, электронных PDF пособий, а также ресурсов подготовки к ОРТ, PISA и STEAM-проектам.'}
            </p>

            {/* Quick 4-Pillars Tag Highlights from User Prompt */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div 
                onClick={() => setActiveCategory('methodology')}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  activeCategory === 'methodology' 
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md' 
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-indigo-400/50'
                }`}
              >
                <span className="font-bold block text-indigo-400">📄 Методика</span>
                <span className="text-[11px] opacity-80">Силлабус, эреже</span>
              </div>
              <div 
                onClick={() => setActiveCategory('video')}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  activeCategory === 'video' 
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-md' 
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-purple-400/50'
                }`}
              >
                <span className="font-bold block text-purple-400">🎥 Видео</span>
                <span className="text-[11px] opacity-80">Курстар, лекция</span>
              </div>
              <div 
                onClick={() => setActiveCategory('pdf')}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  activeCategory === 'pdf' 
                    ? 'bg-rose-600/30 border-rose-400 text-white shadow-md' 
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-rose-400/50'
                }`}
              >
                <span className="font-bold block text-rose-400">📑 PDF</span>
                <span className="text-[11px] opacity-80">Китептер, чек-лист</span>
              </div>
              <div 
                onClick={() => setActiveCategory('ort-pisa-steam')}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  activeCategory === 'ort-pisa-steam' 
                    ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-md' 
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-emerald-400/50'
                }`}
              >
                <span className="font-bold block text-emerald-400">🚀 ЖРТ/PISA/STEAM</span>
                <span className="text-[11px] opacity-80">Практикум, тест</span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                id="btn-open-suggest-resource"
                onClick={() => setIsSuggestModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>{lang === 'ky' ? '+ Материал кошуу же сунуштоо' : '+ Предложить материал'}</span>
              </button>
              
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{lang === 'ky' ? 'Баарына ачык жана бекер' : 'Доступно всем студентам'}</span>
              </div>
            </div>
          </div>

          {/* Right Teaser Banner Graphic (Mirroring UI in screenshot) */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group aspect-[16/10]">
            <img
              src={resourceHeroImg}
              alt="Resource Center Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />
            
            {/* Live metric overlay badges */}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-indigo-900/90 border border-indigo-500/40 text-indigo-200 text-xs font-bold backdrop-blur-md flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>4.9 Рейтинг</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                  2.4k
                </div>
                <div>
                  <div className="font-bold">{lang === 'ky' ? 'Активдүү окурмандар' : 'Активных читателей'}</div>
                  <div className="text-[10px] text-slate-400">{lang === 'ky' ? '120+ саат видео мазмун' : '120+ часов видеоконтента'}</div>
                </div>
              </div>
              <span className="text-indigo-400 font-bold text-[11px]">{lang === 'ky' ? 'Ачык фонд →' : 'Открытый фонд →'}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Statistics Bar (Matches Education.co card from screenshot) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-white">110h+</div>
              <div className="text-[11px] text-slate-400">{lang === 'ky' ? 'Жалпы сааттар' : 'Всего часов контента'}</div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-white">150+</div>
              <div className="text-[11px] text-slate-400">{lang === 'ky' ? 'Материалдар & Китептер' : 'Пособий и книг'}</div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-white">2,800+</div>
              <div className="text-[11px] text-slate-400">{lang === 'ky' ? 'Студенттердин кароосу' : 'Просмотров студентами'}</div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-white">100%</div>
              <div className="text-[11px] text-slate-400">{lang === 'ky' ? 'Акысыз жеткиликтүү' : 'Бесплатный доступ'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Section (Mirroring Trulern design in screenshot) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categoryTabs.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`btn-cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'ky' ? cat.labelKy : cat.labelRu}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-700 text-slate-300'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input and Secondary Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-search-resources"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ky' 
                  ? 'Аталышы, ЖРТ, PISA, автор же тема боюнча издөө...' 
                  : 'Поиск по названию, ОРТ, PISA, автору или теме...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Format Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline flex-shrink-0">
              {lang === 'ky' ? 'Формат:' : 'Формат:'}
            </span>
            <select
              id="select-format-filter"
              value={selectedFormat}
              onChange={e => setSelectedFormat(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">{lang === 'ky' ? 'Бардык форматтар' : 'Все форматы'}</option>
              <option value="pdf">PDF Документ</option>
              <option value="video">Видео сабак</option>
              <option value="interactive">Интерактив / Практикум</option>
              <option value="doc">Чек-лист / Гид</option>
            </select>

            {/* Level Selector */}
            <select
              id="select-level-filter"
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">{lang === 'ky' ? 'Бардык деңгээлдер' : 'Все уровни'}</option>
              <option value="beginner">{lang === 'ky' ? '1-курс / Башталгыч' : '1 курс / Начинающий'}</option>
              <option value="intermediate">{lang === 'ky' ? 'Орто деңгээл' : 'Средний уровень'}</option>
              <option value="advanced">{lang === 'ky' ? 'Жогорку курс' : 'Продвинутый'}</option>
            </select>
          </div>
        </div>

        {/* Active tags count indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div>
            {lang === 'ky' 
              ? `Табылды: ${filteredResources.length} ресурс` 
              : `Найдено: ${filteredResources.length} ресурсов`}
          </div>
          {bookmarkedIds.length > 0 && (
            <div className="text-amber-400 flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 fill-amber-400" />
              <span>{bookmarkedIds.length} {lang === 'ky' ? 'сакталган' : 'сохранено'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Special Feature Section: ЖРТ / ПИЗА / STEAM Quick Simulator Bar */}
      {(activeCategory === 'all' || activeCategory === 'ort-pisa-steam') && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{lang === 'ky' ? 'Өзгөчө багыт: ЖРТ, PISA жана STEAM лабораториясы' : 'Спецраздел: ОРТ, PISA и STEAM-лаборатория'}</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'ky' 
                  ? 'Студенттердин аналитикалык ой жүгүртүүсүн жана инженердик жөндөмүн өстүрүү' 
                  : 'Развитие аналитического мышления и инженерных компетенций'}
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                {lang === 'ky'
                  ? 'PISA функционалдык сабаттуулук тапшырмалары, ЖРТ тесттик базасы жана STEAM робототехника боюнча даяр лабораториялык көрсөтмөлөр.'
                  : 'Тесты читательской грамотности PISA, разборы заданий ОРТ и пошаговые руководства для STEAM-проектов.'}
              </p>
            </div>

            <button
              id="btn-quick-pisa-simulator"
              onClick={() => {
                const pisaRes = learningResources.find(r => r.id === 'res-pisa-critical-thinking');
                if (pisaRes) setActivePreviewResource(pisaRes);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{lang === 'ky' ? 'PISA кейсин сынап көрүү' : 'Пройти кейс PISA'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid of Resources Cards (Mirroring screenshot layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => {
          const formatBadge = getFormatBadge(resource.format);
          const isBookmarked = bookmarkedIds.includes(resource.id);

          return (
            <div
              key={resource.id}
              id={`card-resource-${resource.id}`}
              onClick={() => setActivePreviewResource(resource)}
              className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              {/* Card Header Top */}
              <div className="p-5 pb-3 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-3">
                  {/* Format Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${formatBadge.bg}`}>
                    <formatBadge.icon className="w-3.5 h-3.5" />
                    <span>{formatBadge.label}</span>
                  </span>

                  {/* Bookmark Button */}
                  <button
                    id={`btn-bookmark-${resource.id}`}
                    onClick={(e) => toggleBookmark(resource.id, e)}
                    aria-label="Bookmark"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 flex items-center justify-center transition-colors"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Badges: New / Popular */}
                <div className="flex items-center gap-1.5 mb-2">
                  {resource.isNew && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      NEW
                    </span>
                  )}
                  {resource.isPopular && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      POPULAR
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 ml-auto flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-200">{resource.rating}</span>
                    <span>({resource.reviewsCount})</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
                  {lang === 'ky' ? resource.titleKy : resource.titleRu}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed flex-1">
                  {lang === 'ky' ? resource.descriptionKy : resource.descriptionRu}
                </p>

                {/* Author & Meta */}
                <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="truncate text-slate-300">
                      {lang === 'ky' ? resource.authorKy : resource.authorRu}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{lang === 'ky' ? resource.durationOrPagesKy : resource.durationOrPagesRu}</span>
                    </span>
                    {resource.fileSize && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {resource.fileSize}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pl-2">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{resource.viewsCount}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{resource.downloadsCount}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleDownload(resource, e)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    title={lang === 'ky' ? 'Жүктөп алуу' : 'Скачать'}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActivePreviewResource(resource)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <span>{lang === 'ky' ? 'Көрүү' : 'Открыть'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State if no resources match search */}
      {filteredResources.length === 0 && (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">
            {lang === 'ky' ? 'Эч кандай ресурс табылган жок' : 'Ресурсы не найдены'}
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {lang === 'ky'
              ? 'Издөө сурооңузду өзгөртүп же фильтрлерди тазалап көрүңүз.'
              : 'Попробуйте изменить поисковый запрос или сбросить фильтры.'}
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectedFormat('all');
              setSelectedLevel('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
          >
            {lang === 'ky' ? 'Фильтрлерди тазалоо' : 'Сбросить фильтры'}
          </button>
        </div>
      )}

      {/* Resource Detail / Interactive Preview Modal */}
      {activePreviewResource && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActivePreviewResource(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getFormatBadge(activePreviewResource.format).bg}`}>
                    {getFormatBadge(activePreviewResource.format).label}
                  </span>
                  <span className="text-xs text-slate-400">
                    {lang === 'ky' ? activePreviewResource.durationOrPagesKy : activePreviewResource.durationOrPagesRu}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {lang === 'ky' ? activePreviewResource.titleKy : activePreviewResource.titleRu}
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === 'ky' ? activePreviewResource.authorKy : activePreviewResource.authorRu}
                </p>
              </div>

              <button
                id="btn-close-resource-modal"
                onClick={() => setActivePreviewResource(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Custom View based on Format */}
            <div className="p-6 space-y-6">
              {/* VIDEO FORMAT VIEW */}
              {activePreviewResource.format === 'video' && (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden group shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                    <div className="text-center space-y-3 relative z-10 p-6">
                      <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                        <Play className="w-7 h-7 ml-1 fill-white" />
                      </div>
                      <div className="text-white font-bold text-sm">
                        {lang === 'ky' ? 'Видео сабакты баштоо' : 'Запустить видеоурок'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {activePreviewResource.durationOrPagesKy} • HD 1080p
                      </div>
                    </div>
                  </div>

                  {/* Video Lesson Curriculum / Topics */}
                  <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      {lang === 'ky' ? 'Видео сабактын программасы:' : 'Программа видеоурока:'}
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                      <li>00:00 — {lang === 'ky' ? 'Киришүү жана максаттарды коюу' : 'Введение и постановка целей'}</li>
                      <li>08:30 — {lang === 'ky' ? 'Теориялык негиздер жана мисалдар' : 'Теоретические основы и примеры'}</li>
                      <li>22:15 — {lang === 'ky' ? 'Практикалык талдоо жана кейстер' : 'Практический разбор и решение кейсов'}</li>
                      <li>38:40 — {lang === 'ky' ? 'Суроо-жооп жана үй тапшырмасы' : 'Сессия вопросов и ответов, домашнее задание'}</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* INTERACTIVE QUIZ / PISA CASE VIEW */}
              {activePreviewResource.format === 'interactive' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>{lang === 'ky' ? 'PISA Практикалык тапшырмасы №1' : 'Практическое задание PISA №1'}</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {lang === 'ky'
                        ? 'Тексттен үзүндү: «Изилдөөчүлөр студенттердин арасында тайм-менеджмент колдонгондордун экзамендик стресси 38% төмөн экенин аныкташкан. Бирок күнүнө 8 сааттан ашык тынымсыз окугандардын маалыматты эстеп калуусу 25% төмөндөгөн».'
                        : 'Фрагмент текста: «Исследования показали, что студенты, применяющие тайм-менеджмент, испытывают стресс на 38% меньше. Однако непрерывная зубрежка более 8 часов снижает запоминаемость на 25%».'}
                    </p>
                    <div className="text-xs text-slate-300 font-bold">
                      {lang === 'ky' ? 'Суроо: Төмөнкүлөрдүн кайсынысы эң туура жыйынтык?' : 'Вопрос: Какой вывод наиболее точен?'}
                    </div>

                    <div className="space-y-2 pt-2">
                      {[
                        lang === 'ky' ? 'А) Канчалык көп окусаң, ошончолук экзамен жакшы болот' : 'А) Чем дольше учишься без перерыва, тем выше балл',
                        lang === 'ky' ? 'Б) Эс алуу менен пландаштыруу окуп-үйрөнүүнүн натыйжалуулугун жогорулатат' : 'Б) Грамотное планирование и перерывы повышают продуктивность',
                        lang === 'ky' ? 'В) Тайм-менеджмент стрессти толугу менен жок кылат' : 'В) Тайм-менеджмент полностью исключает любой стресс'
                      ].map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setQuizAnswer(idx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                            quizAnswer === idx
                              ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold'
                              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{opt}</span>
                          {quizAnswer === idx && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>
                      ))}
                    </div>

                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={quizAnswer === null}
                        className="mt-3 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md"
                      >
                        {lang === 'ky' ? 'Жоопту текшерүү' : 'Проверить ответ'}
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{quizAnswer === 1 ? (lang === 'ky' ? 'Азаматсыз! Туура жооп.' : 'Отлично! Правильный ответ.') : (lang === 'ky' ? 'Туура жооп Б эле.' : 'Правильный вариант — Б.')}</span>
                        </div>
                        <p className="opacity-90">
                          {lang === 'ky' 
                            ? 'PISA стандарты боюнча маалыматты туура талдоо эс алуу интервалдарынын маанилүүлүгүн тастыктайт.' 
                            : 'Анализ данных подтверждает важность интервального отдыха для эффективного запоминания.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PDF & DOC VIEWER SIMULATION */}
              {(activePreviewResource.format === 'pdf' || activePreviewResource.format === 'doc') && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-rose-400" />
                        <span>1-бет / {activePreviewResource.durationOrPagesKy}</span>
                      </span>
                      <span className="text-slate-500">{activePreviewResource.fileSize || 'PDF'}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                      <div className="text-xs font-bold text-indigo-400">
                        {lang === 'ky' ? 'Материалдын кыскача мазмуну жана үзүндүсү:' : 'Краткое содержание и выдержка:'}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        «{activePreviewResource.contentSnippetKy || activePreviewResource.descriptionKy}»
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags list */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'ky' ? 'Тематикалык тегдер:' : 'Тематические теги:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activePreviewResource.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-indigo-300 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={(e) => toggleBookmark(activePreviewResource.id, e)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                {bookmarkedIds.includes(activePreviewResource.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{lang === 'ky' ? 'Сакталган' : 'Сохранено'}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>{lang === 'ky' ? 'Сактап коюу' : 'В избранное'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="btn-download-modal-resource"
                  onClick={() => handleDownload(activePreviewResource)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ky' ? 'Файлды жүктөө' : 'Скачать файл'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggest / Upload New Resource Modal */}
      {isSuggestModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsSuggestModalOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ky' ? 'Жаңы окуу материалын сунуштоо' : 'Предложить учебный материал'}
                </h3>
              </div>
              <button 
                onClick={() => setIsSuggestModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {!suggestSubmitted ? (
              <form 
                onSubmit={e => {
                  e.preventDefault();
                  setSuggestSubmitted(true);
                  setTimeout(() => {
                    setSuggestSubmitted(false);
                    setIsSuggestModalOpen(false);
                  }, 2500);
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {lang === 'ky' ? 'Материалдын аталышы *' : 'Название материала *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={suggestForm.title}
                    onChange={e => setSuggestForm({ ...suggestForm, title: e.target.value })}
                    placeholder={lang === 'ky' ? 'Мисалы: 1-курс математика боюнча силлабус...' : 'Например: Силлабус по высшей математике...'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {lang === 'ky' ? 'Категория' : 'Категория'}
                    </label>
                    <select
                      value={suggestForm.category}
                      onChange={e => setSuggestForm({ ...suggestForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    >
                      <option value="methodology">{lang === 'ky' ? 'Методика' : 'Методика'}</option>
                      <option value="video">{lang === 'ky' ? 'Видео сабак' : 'Видео'}</option>
                      <option value="pdf">PDF колдонмо</option>
                      <option value="ort-pisa-steam">ЖРТ / PISA / STEAM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {lang === 'ky' ? 'Формат' : 'Формат'}
                    </label>
                    <select
                      value={suggestForm.format}
                      onChange={e => setSuggestForm({ ...suggestForm, format: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    >
                      <option value="pdf">PDF документ</option>
                      <option value="video">Видео шилтеме</option>
                      <option value="doc">Word / Чек-лист</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {lang === 'ky' ? 'Автор / Кафедра' : 'Автор / Кафедра'}
                  </label>
                  <input
                    type="text"
                    value={suggestForm.author}
                    onChange={e => setSuggestForm({ ...suggestForm, author: e.target.value })}
                    placeholder={lang === 'ky' ? 'Окутуучунун аты-жөнү же студенттик топ' : 'ФИО преподавателя или студенческой группы'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {lang === 'ky' ? 'Кыскача түшүндүрмө' : 'Краткое описание'}
                  </label>
                  <textarea
                    rows={3}
                    value={suggestForm.description}
                    onChange={e => setSuggestForm({ ...suggestForm, description: e.target.value })}
                    placeholder={lang === 'ky' ? 'Бул материал студенттерге эмнени үйрөтөт?' : 'Чем этот материал полезен студентам?'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSuggestModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                  >
                    {lang === 'ky' ? 'Жөнөтүү (Текшерүүгө)' : 'Отправить на модерацию'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">
                  {lang === 'ky' ? 'Чоң рахмат! Материал жөнөтүлдү.' : 'Спасибо! Материал отправлен.'}
                </h4>
                <p className="text-xs text-slate-300">
                  {lang === 'ky' 
                    ? 'Академиялык модераторлор материалды карап чыгып, жалпы Ресурстар борборуна жайгаштырышат.' 
                    : 'Модераторы проверят материал и опубликуют его в общем Ресурсном центре.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
