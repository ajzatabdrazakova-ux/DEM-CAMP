import React, { useState } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  MessageSquarePlus, 
  Users, 
  CheckCircle2, 
  UserCheck, 
  Globe, 
  Sparkles, 
  Shield, 
  HeartHandshake, 
  TrendingUp, 
  Layers,
  Quote,
  ChevronLeft,
  ChevronRight,
  Camera,
  Rotate3d,
  MapPin,
  Navigation,
  BookOpen,
  FileText,
  Video,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { Language, ActiveTab, UserRole } from '../types';
import { translations } from '../locales/translations';
import { ThreeDHeroAnimation } from './ThreeDHeroAnimation';
import { ThreeDTiltCard } from './ThreeDTiltCard';
import studentHeroImg from '../assets/images/student_story_hero_1789402017526.jpg';
import campusMapImg from '../assets/images/campus_map_isometric_1789402995511.jpg';
import resourceHeroImg from '../assets/images/resource_center_hero_1789403568098.jpg';

interface HeroSectionProps {
  lang: Language;
  role: UserRole;
  setActiveTab: (tab: ActiveTab) => void;
  stats: {
    dialogues: number;
    officeHoursPerWeek: number;
    resolvedProblems: number;
    mentorsCount: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  role,
  setActiveTab,
  stats
}) => {
  const t = translations[lang];
  const [heroVisualMode, setHeroVisualMode] = useState<'photo' | '3d'>('photo');
  const [storyIndex, setStoryIndex] = useState(0);

  const studentStories = [
    {
      id: 'story-1',
      authorKy: 'Айдай Саматова',
      authorRu: 'Айдай Саматова',
      authorEn: 'Ayday Samatova',
      roleKy: '2-курс, Табият таануу жана математика ф-ти (ОшМПУ)',
      roleRu: '2 курс, Факультет естествознания и математики (ОшГПУ)',
      roleEn: 'Sophomore, Faculty of Natural Sciences & Mathematics (OshSPU)',
      quoteKy: '«ОшМПУнун DEM-CAMP платформасы аркылуу жогорку курстан насаатчы таптым. Ал мага сессияга даярданууга, лабораториялык долбоорумду ийгиликтүү бүтүрүүгө жана педагогикалык ишенимимди арттырууга чоң көмөк берди!»',
      quoteRu: '«Благодаря платформе DEM-CAMP ОшГПУ нашла наставника со старшего курса. Он помог мне подготовиться к сессии, защитить лабораторный проект и поверить в свои педагогические силы!»',
      quoteEn: '"Through the OshSPU DEM-CAMP platform, I connected with an upperclass peer mentor. He guided me through finals prep, helped me complete my lab project, and gave me confidence in my future teaching career!"',
      badgeKy: 'Насаатчылык окуясы • ОшМПУ',
      badgeRu: 'История наставничества • ОшГПУ',
      badgeEn: 'Mentorship Story • OshSPU',
      avatarBg: 'bg-cyan-500'
    },
    {
      id: 'story-2',
      authorKy: 'Бексултан Токтогулов',
      authorRu: 'Бексултан Токтогулов',
      authorEn: 'Beksultan Toktogulov',
      roleKy: '1-курс, Гуманитардык билим берүү факультети (ОшМПУ)',
      roleRu: '1 курс, Факультет гуманитарного образования (ОшГПУ)',
      roleEn: 'Freshman, Faculty of Humanities & Education (OshSPU)',
      quoteKy: '«ОшМПУдагы адаптация жумалыгында деканат жана окутуучулар менен чай үстүндө эркин тааныштык. Суроо берүүдөн тартынбай, университетибизде өзүмдү чоң педагогикалык жамааттын мүчөсү катары сезе баштадым.»',
      quoteRu: '«На адаптационной неделе в ОшГПУ познакомились с деканатом и преподавателями в неформальной обстановке. Перестал стесняться задавать вопросы и почувствовал настоящую университетскую поддержку.»',
      quoteEn: '"During orientation week at OshSPU, we met deans and faculty members in a relaxed atmosphere over tea. I felt genuinely welcomed into our academic community."',
      badgeKy: 'Адаптация окуясы • ОшМПУ',
      badgeRu: 'История адаптации • ОшГПУ',
      badgeEn: 'Orientation Story • OshSPU',
      avatarBg: 'bg-amber-500'
    },
    {
      id: 'story-3',
      authorKy: 'Чыңгыз жана курсташтары',
      authorRu: 'Чингиз и сокурсники',
      authorEn: 'Chyngyz & Classmates',
      roleKy: '3-курс, Педагогика жана искусство ф-ти (ОшМПУ)',
      roleRu: '3 курс, Факультет педагогики и искусства (ОшГПУ)',
      roleEn: 'Junior, Faculty of Pedagogy & Art (OshSPU)',
      quoteKy: '«ОшМПУ Ишеним кутусуна студенттик китепкананы жана коворкингди кечки сааттарга чейин иштетүү сунушун жазганбыз. 1 жумада ректорат угуп, график узартылды. Биздин үнүбүз реалдуу чечимге айланды!»',
      quoteRu: '«Через Ящик доверия ОшГПУ предложили продлить график работы студенческого коворкинга и библиотеки. Руководство университета оперативно решило вопрос с открытым отчетом!»',
      quoteEn: '"Via the OshSPU Trust Box, we requested extending evening library and coworking hours. The administration acted promptly with a public notice. Our student voice brought real change!"',
      badgeKy: 'Чечилген демилге • ОшМПУ',
      badgeRu: 'Решенная инициатива • ОшГПУ',
      badgeEn: 'Resolved Initiative • OshSPU',
      avatarBg: 'bg-emerald-500'
    }
  ];

  const currentStory = studentStories[storyIndex];

  const handleNextStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStoryIndex((prev) => (prev + 1) % studentStories.length);
  };

  const handlePrevStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStoryIndex((prev) => (prev - 1 + studentStories.length) % studentStories.length);
  };

  const pillars = [
    {
      id: 'start-together' as ActiveTab,
      num: '1',
      title: lang === 'ky' ? '«Старт бирге»' : lang === 'ru' ? '«Старт вместе»' : '«Start Together»',
      subtitle: lang === 'ky' ? 'Адаптация жумалыгы' : lang === 'ru' ? 'Неделя адаптации' : 'Orientation Week',
      desc: lang === 'ky' 
        ? 'Семестр башында окутуучулар менен бейформал таанышуу, квесттер жана күтүүлөр тактасы.' 
        : lang === 'ru'
        ? 'Знакомство, обсуждение ожиданий, неформальные встречи и поддержка первокурсников.'
        : 'Meet faculty casually at the start of semester, campus quests, and the mutual expectations wall.',
      icon: Calendar,
      color: 'from-blue-500/10 to-cyan-500/10 border-blue-200 text-blue-700'
    },
    {
      id: 'office-hours' as ActiveTab,
      num: '2',
      title: lang === 'ky' ? '«Ачык сааттар»' : lang === 'ru' ? '«Открытые часы»' : '«Office Hours»',
      subtitle: lang === 'ky' ? 'Студент үчүн убакыт' : lang === 'ru' ? 'Время для студента' : 'Faculty Hours',
      desc: lang === 'ky' 
        ? 'Ар бир окутуучунун белгиленген кабыл алуу убактысы: жеке кеңеш, суроолор жана карьера.' 
        : lang === 'ru'
        ? 'Регулярные часы консультаций: разбор сложных тем, наука и индивидуальная поддержка.'
        : 'Weekly dedicated consultation slots: deep-dive questions, academic advice, and career support.',
      icon: Clock,
      color: 'from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-700'
    },
    {
      id: 'your-voice' as ActiveTab,
      num: '3',
      title: lang === 'ky' ? '«Сенин добушуң»' : lang === 'ru' ? '«Твой голос»' : '«Your Voice»',
      subtitle: lang === 'ky' ? 'Коопсуз кайтарым' : lang === 'ru' ? 'Безопасная связь' : 'Trust Box',
      desc: lang === 'ky' 
        ? 'Анонимдүү же ачык «Ишеним кутусу». Трек-код аркылуу сунушуңуздун чечимин байкаңыз.' 
        : lang === 'ru'
        ? 'Анонимный цифровой «Ящик доверия» с отслеживанием статуса решения по трек-коду.'
        : 'Anonymous digital Trust Box with transparent status tracking for your suggestions.',
      icon: MessageSquarePlus,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-700'
    },
    {
      id: 'dialogue' as ActiveTab,
      num: '4',
      title: lang === 'ky' ? '«Диалог»' : lang === 'ru' ? '«Диалог»' : '«Dialogue»',
      subtitle: lang === 'ky' ? 'Регулярдуу жолугушуу' : lang === 'ru' ? 'Регулярные встречи' : 'Open Forums',
      desc: lang === 'ky' 
        ? 'Айына бир жолу студенттер менен окутуучулардын ачык тегерек столу жана темаларга добуш берүү.' 
        : lang === 'ru'
        ? 'Ежемесячные круглые столы, открытый микрофон и голосование за темы обсуждения.'
        : 'Monthly open roundtables between students and leadership with student topic voting.',
      icon: Users,
      color: 'from-indigo-500/10 to-violet-500/10 border-indigo-200 text-indigo-700'
    },
    {
      id: 'we-heard' as ActiveTab,
      num: '5',
      title: lang === 'ky' ? '«Биз уктык!»' : lang === 'ru' ? '«Мы услышали»' : '«We Heard You!»',
      subtitle: lang === 'ky' ? 'Жыйынтык тактасы' : lang === 'ru' ? 'Итоги и решения' : 'Action Tracker',
      desc: lang === 'ky' 
        ? '«Эмне сунушталды? Эмне өзгөрдү?». Чечилген маселелердин ачык айкын отчету.' 
        : lang === 'ru'
        ? 'Прозрачный трекер: что предложили студенты, что уже внедрено и почему.'
        : 'Transparent accountability tracker: what was proposed, what was implemented, and why.',
      icon: CheckCircle2,
      color: 'from-rose-500/10 to-pink-500/10 border-rose-200 text-rose-700'
    },
    {
      id: 'mentors' as ActiveTab,
      num: '6',
      title: lang === 'ky' ? '«Студент-наставник»' : lang === 'ru' ? '«Студент-наставник»' : '«Peer Mentors»',
      subtitle: lang === 'ky' ? 'Тең-теңине көмөк' : lang === 'ru' ? 'Равный — равному' : 'Peer to Peer',
      desc: lang === 'ky' 
        ? 'Жогорку курстар 1-курстарга сабактарда, жатаканада жана университетте багыт берет.' 
        : lang === 'ru'
        ? 'Опытные старшекурсники помогают первокурсникам освоиться в учебе и кампусе.'
        : 'Upperclassmen mentor freshmen through academic courses, dormitory life, and campus integration.',
      icon: UserCheck,
      color: 'from-purple-500/10 to-indigo-500/10 border-purple-200 text-purple-700'
    },
    {
      id: 'online' as ActiveTab,
      num: '7',
      title: '«DEM-CAMP Online»',
      subtitle: lang === 'ky' ? 'Санарип мейкиндик' : lang === 'ru' ? 'Цифровой канал' : 'Digital Space',
      desc: lang === 'ky' 
        ? 'Бирдиктүү Q&A аянтчасы, суроо-жооп базасы жана AI-сылыктык жардамчысы.' 
        : lang === 'ru'
        ? 'Онлайн Q&A портал, вопросы преподавателям в 1 клик и AI-помощник формулировок.'
        : 'One-stop Q&A platform, verified knowledge base, and an AI tone assistant for courteous faculty messages.',
      icon: Globe,
      color: 'from-sky-500/10 to-cyan-500/10 border-sky-200 text-sky-700'
    }
  ];

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Banner with Authentic Student Story Photograph & 3D Mode Toggle */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl border border-slate-800/80 p-6 sm:p-10 lg:p-12">
        {/* Background Visual: Student Stories Photo OR 3D WebGL Canvas */}
        {heroVisualMode === 'photo' ? (
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src={studentHeroImg} 
              alt={lang === 'ky' ? 'Студенттердин окуясы жана диалогу' : 'История и диалог студентов'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-1000 ease-out"
            />
            {/* Elegant high-contrast vignette and gradient overlays for perfect text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-indigo-950/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />
          </div>
        ) : (
          <ThreeDHeroAnimation lang={lang} />
        )}

        {/* Top Header Row inside Banner: Tag badge + Visual Mode Switcher */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-cyan-950/40">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.demCampTag}</span>
          </div>

          {/* Visual Mode Switcher: Photo Story (Default) vs 3D Scene */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-xs font-medium shadow-md">
            <button
              id="hero-toggle-photo"
              onClick={() => setHeroVisualMode('photo')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                heroVisualMode === 'photo'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{lang === 'ky' ? 'Студенттик сүрөт' : lang === 'ru' ? 'Студенческое фото' : 'Campus Photo'}</span>
            </button>
            <button
              id="hero-toggle-3d"
              onClick={() => setHeroVisualMode('3d')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                heroVisualMode === '3d'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>{lang === 'ky' ? '3D Режим' : lang === 'ru' ? '3D Режим' : '3D Mode'}</span>
            </button>
          </div>
        </div>

        {/* Main Banner Content: Text & Actions (Left) + Live Student Story Spotlight (Right) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-auto">
          <div className="lg:col-span-7">
            {/* OshSPU Affiliation Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/25 to-sky-500/25 border border-cyan-400/40 text-cyan-200 text-xs font-bold mb-4 backdrop-blur-md shadow-xs">
              <GraduationCap className="w-4 h-4 text-cyan-300" />
              <span>
                {lang === 'ky' 
                  ? 'А. Мырсабеков атындагы Ош мамлекеттик педагогикалык университети (ОшМПУ)' 
                  : lang === 'ru' 
                  ? 'Ошский государственный педагогический университет имени А. Мырсабекова (ОшГПУ)' 
                  : 'Osh State Pedagogical University named after A. Myrsabekov (OshSPU)'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4 drop-shadow-sm">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-slate-200/90 font-normal leading-relaxed mb-8 max-w-2xl drop-shadow-sm">
              {t.heroDesc}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                id="hero-btn-trust"
                onClick={() => setActiveTab('your-voice')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4 text-slate-950" />
                <span>{t.quickActionTrust}</span>
              </button>

              <button
                id="hero-btn-office-hours"
                onClick={() => setActiveTab('office-hours')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-600/60 backdrop-blur-md shadow-md hover:border-cyan-400/50 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-cyan-300" />
                <span>{t.quickActionOfficeHours}</span>
              </button>

              <button
                id="hero-btn-mentors"
                onClick={() => setActiveTab('mentors')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 font-semibold text-sm border border-indigo-400/40 backdrop-blur-md shadow-md hover:border-indigo-300/70 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-indigo-300" />
                <span>{lang === 'ky' ? 'Насаатчы табуу' : lang === 'ru' ? 'Найти наставника' : 'Find a Mentor'}</span>
              </button>

              <button
                id="hero-btn-practice"
                onClick={() => setActiveTab('practice')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-slate-950" />
                <span>{lang === 'ky' ? 'Пед. практика (1-11 кл + Садик)' : 'Пед. практика (1-11 кл + Сад)'}</span>
              </button>

              <a
                id="hero-btn-google-maps"
                href="https://maps.app.goo.gl/Bj7ke88AEYEiKcv67"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 font-semibold text-sm border border-emerald-400/40 backdrop-blur-md shadow-md hover:border-emerald-300/70 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-300" />
                <span>{lang === 'ky' ? 'Google Картыдан көрүү' : 'ОшГПУ на Google Картах'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
              </a>
            </div>
          </div>

          {/* Right Side: Student Story Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-900/80 hover:bg-slate-900/90 border border-slate-700/80 p-5 sm:p-6 backdrop-blur-xl shadow-2xl transition-all">
              {/* Header badge & controls */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold uppercase tracking-wider border border-cyan-500/30">
                  <Quote className="w-3 h-3" />
                  <span>{lang === 'ky' ? currentStory.badgeKy : lang === 'ru' ? currentStory.badgeRu : currentStory.badgeEn}</span>
                </div>

                {/* Carousel navigation */}
                <div className="flex items-center gap-1">
                  <button
                    id="hero-story-prev"
                    onClick={handlePrevStory}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Previous story"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-400 px-1">
                    {storyIndex + 1}/{studentStories.length}
                  </span>
                  <button
                    id="hero-story-next"
                    onClick={handleNextStory}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Next story"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mb-4 italic">
                {lang === 'ky' ? currentStory.quoteKy : lang === 'ru' ? currentStory.quoteRu : currentStory.quoteEn}
              </p>

              {/* Author details */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full ${currentStory.avatarBg} text-slate-950 font-black text-xs flex items-center justify-center shadow-xs`}>
                    {(lang === 'en' ? currentStory.authorEn : currentStory.authorKy).charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {lang === 'ky' ? currentStory.authorKy : lang === 'ru' ? currentStory.authorRu : currentStory.authorEn}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {lang === 'ky' ? currentStory.roleKy : lang === 'ru' ? currentStory.roleRu : currentStory.roleEn}
                    </p>
                  </div>
                </div>

                <button
                  id="hero-story-share-btn"
                  onClick={() => setActiveTab('your-voice')}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{lang === 'ky' ? 'Өз окуяңды кош' : lang === 'ru' ? 'Твоя история' : 'Share your story'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Grid with Interactive 3D Tilt */}
        <div className="relative z-10 mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <ThreeDTiltCard
            id="hero-stat-dialogues"
            glowColor="rgba(6, 182, 212, 0.4)"
            className="cursor-pointer"
            onClick={() => setActiveTab('dialogue')}
          >
            <div className="bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-700/70 hover:border-cyan-500/60 transition-colors shadow-lg">
              <div className="flex items-center gap-2 text-cyan-400 mb-1.5">
                <Users className="w-4 h-4" />
                <span className="text-xl sm:text-2xl font-black">{stats.dialogues}+</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{t.heroStats.dialogues}</p>
            </div>
          </ThreeDTiltCard>

          <ThreeDTiltCard
            id="hero-stat-office-hours"
            glowColor="rgba(245, 158, 11, 0.4)"
            className="cursor-pointer"
            onClick={() => setActiveTab('office-hours')}
          >
            <div className="bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-700/70 hover:border-amber-500/60 transition-colors shadow-lg">
              <div className="flex items-center gap-2 text-amber-400 mb-1.5">
                <Clock className="w-4 h-4" />
                <span className="text-xl sm:text-2xl font-black">{stats.officeHoursPerWeek}</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{t.heroStats.officeHours}</p>
            </div>
          </ThreeDTiltCard>

          <ThreeDTiltCard
            id="hero-stat-resolved"
            glowColor="rgba(16, 185, 129, 0.4)"
            className="cursor-pointer"
            onClick={() => setActiveTab('we-heard')}
          >
            <div className="bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-700/70 hover:border-emerald-500/60 transition-colors shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xl sm:text-2xl font-black">{stats.resolvedProblems}</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{t.heroStats.resolved}</p>
            </div>
          </ThreeDTiltCard>

          <ThreeDTiltCard
            id="hero-stat-mentors"
            glowColor="rgba(129, 140, 248, 0.4)"
            className="cursor-pointer"
            onClick={() => setActiveTab('mentors')}
          >
            <div className="bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-700/70 hover:border-indigo-500/60 transition-colors shadow-lg">
              <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
                <UserCheck className="w-4 h-4" />
                <span className="text-xl sm:text-2xl font-black">{stats.mentorsCount}</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{t.heroStats.mentors}</p>
            </div>
          </ThreeDTiltCard>
        </div>
      </section>

      {/* Innovation Feature: 1. Campus Map (Interactive 3D Map) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & Action */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold">
              <span>📍 1. Campus Map ({lang === 'ky' ? 'Интерактивдүү карта' : lang === 'ru' ? 'Интерактивная карта' : 'Interactive Map'})</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                {lang === 'ky' ? 'Кошумча инновациялык функциялар' : lang === 'ru' ? 'Дополнительные инновационные функции' : 'Innovative Campus Features'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {lang === 'ky' ? 'Кампуста 3D навигация' : lang === 'ru' ? 'Навигация по кампусу в 3D' : 'Find your way around campus in 3D'}
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {lang === 'ky'
                ? 'Биринчи курстар жана студенттер үчүн университеттин бардык корпустарын, лекциялык аудиторияларын, окутуучулардын ачык саат кабинеттерин жана ишеним кутуларын табуучу интерактивдүү 3D карта.'
                : lang === 'ru'
                ? 'Интерактивная 3D-навигация по кампусу для первокурсников: находите нужные аудитории, кафедры преподавателей, столовую, читальные залы и точки доверия DEM-CAMP.'
                : 'Interactive 3D campus navigation for students: find lecture halls, faculty consultation offices, cafeteria, library rooms, and DEM-CAMP Trust Box locations.'}
            </p>

            <div className="flex flex-wrap gap-2 text-xs text-slate-300 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{lang === 'ky' ? '3D Изометриялык көрүнүш' : lang === 'ru' ? '3D Изометрический вид' : '3D Isometric View'}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{lang === 'ky' ? 'Жөө басуу маршруту' : lang === 'ru' ? 'Пеший маршрут' : 'Walking Route'}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{lang === 'ky' ? 'Ишеним кутуларынын локациясы' : lang === 'ru' ? 'Точки ящиков доверия' : 'Trust Box Locations'}</span>
              </span>
            </div>

            <div className="pt-2">
              <button
                id="btn-hero-open-campus-map"
                onClick={() => setActiveTab('campus-map')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-slate-950" />
                <span>{lang === 'ky' ? 'Интерактивдүү Картаны ачуу' : lang === 'ru' ? 'Открыть карту кампуса' : 'Explore Campus Map'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Visual Teaser */}
          <div 
            onClick={() => setActiveTab('campus-map')}
            className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group cursor-pointer aspect-video sm:aspect-[16/10]"
          >
            <img
              src={campusMapImg}
              alt="Campus Map Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
            
            {/* Overlay Interactive Mock Pins */}
            <div className="absolute top-1/4 left-1/3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black shadow-lg animate-bounce">
              <MapPin className="w-3 h-3" />
              <span>{lang === 'ky' ? 'Б-1 Башкы корпус' : lang === 'ru' ? 'Г-1 Главный корпус' : 'Main Hall (B-1)'}</span>
            </div>
            <div className="absolute top-1/2 left-2/3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-lg">
              <span>{lang === 'ky' ? '📮 Ишеним кутусу #1' : lang === 'ru' ? '📮 Ящик доверия #1' : '📮 Trust Box #1'}</span>
            </div>

            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ky' ? 'Картаны толук көрүү →' : lang === 'ru' ? 'Смотреть полностью →' : 'View Full Map →'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Innovation Feature: 2. Ресурстар борбору (Resource Center) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & Action */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <span>📚 2. {lang === 'ky' ? 'Ресурстар борбору' : lang === 'ru' ? 'Центр ресурсов' : 'Resource Center'}</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                {lang === 'ky' ? 'Окуу жана методикалык база' : lang === 'ru' ? 'Образовательная и методическая база' : 'Academic & Methodological Hub'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {lang === 'ky' ? 'Бирдиктүү билим берүү ресурстар борбору' : lang === 'ru' ? 'Единый цифровой центр ресурсов' : 'Unified Learning & Resource Center'}
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {lang === 'ky'
                ? 'Студенттер жана окутуучулар үчүн бардык зарыл методикалык материалдар, видеолекциялар, PDF колдонмолор жана ЖРТ, PISA, STEAM боюнча атайын даярдык базасы.'
                : lang === 'ru'
                ? 'Все необходимые методические разработки, видеоуроки, цифровые PDF-пособия, а также база материалов по ОРТ, PISA и STEAM-проектам.'
                : 'Curated methodological guides, video courses, downloadable digital PDFs, plus preparation material for ORT, PISA, and STEAM projects.'}
            </p>

            {/* 4 Pillars Requested in screenshot */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="font-semibold">{lang === 'ky' ? 'Методикалык материалдар' : lang === 'ru' ? 'Методические материалы' : 'Methodological Guides'}</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span className="font-semibold">{lang === 'ky' ? 'Видео курстар & лекциялар' : lang === 'ru' ? 'Видеокурсы и лекции' : 'Video Courses & Lectures'}</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span className="font-semibold">{lang === 'ky' ? 'PDF колдонмолор & китептер' : lang === 'ru' ? 'PDF пособия и книги' : 'PDF Books & Handbooks'}</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="font-semibold">{lang === 'ky' ? 'ЖРТ / ПИЗА / STEAM' : lang === 'ru' ? 'ОРТ / PISA / STEAM' : 'ORT / PISA / STEAM'}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="btn-hero-open-resource-center"
                onClick={() => setActiveTab('resource-center')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-white" />
                <span>{lang === 'ky' ? 'Ресурстар борборуна өтүү' : lang === 'ru' ? 'Перейти в Центр ресурсов' : 'Open Resource Center'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Visual Teaser */}
          <div 
            onClick={() => setActiveTab('resource-center')}
            className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group cursor-pointer aspect-video sm:aspect-[16/10]"
          >
            <img
              src={resourceHeroImg}
              alt="Resource Center Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
            
            {/* Overlay Interactive Mock Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-black shadow-lg">
              <BookOpen className="w-3 h-3" />
              <span>{lang === 'ky' ? '150+ Ресурстар фонду' : lang === 'ru' ? '150+ Фонд ресурсов' : '150+ Digital Resources'}</span>
            </div>

            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'ky' ? 'Базаны толук ачуу →' : lang === 'ru' ? 'Открыть всю базу →' : 'Browse All Resources →'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Pillars of Köpürö Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              {lang === 'ky' ? 'Системалык ыкма' : lang === 'ru' ? 'Комплексный подход' : 'Systemic Approach'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {lang === 'ky' ? 'DEM-CAMP платформасынын 7 негизги багыты' : lang === 'ru' ? '7 ключевых направлений DEM-CAMP' : '7 Core Pillars of DEM-CAMP'}
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            {lang === 'ky' 
              ? 'Студенттин үнүн угуудан баштап, көйгөйлөрдү реалдуу чечүүгө чейинки бирдиктүү экосистема.' 
              : lang === 'ru'
              ? 'Экосистема открытого диалога, от адаптации первокурсника до институциональных изменений.'
              : 'A unified student ecosystem: from active listening and peer support to actionable university solutions.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <ThreeDTiltCard
                key={pillar.id}
                id={`card-pillar-${pillar.id}`}
                maxTilt={8}
                scaleOnHover={1.025}
                glowColor="rgba(6, 182, 212, 0.15)"
                onClick={() => setActiveTab(pillar.id)}
                className="cursor-pointer h-full"
              >
                <div className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-cyan-300 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${pillar.color} border shadow-xs transform group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {lang === 'ky' ? `${pillar.num}-багыт` : lang === 'ru' ? `Направление ${pillar.num}` : `Pillar ${pillar.num}`}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                            {pillar.title}
                          </h3>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {pillar.subtitle}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600 group-hover:text-cyan-700">
                    <span>{lang === 'ky' ? 'Багытка өтүү' : lang === 'ru' ? 'Перейти в раздел' : 'Explore Pillar'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </ThreeDTiltCard>
            );
          })}
        </div>
      </div>

      {/* Teacher & Student Perspective Callout */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-cyan-50 to-indigo-50 border border-sky-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {lang === 'ky' 
                ? 'DEM-CAMP — эки тараптуу жол: Студент жана Окутуучу' 
                : lang === 'ru'
                ? 'DEM-CAMP — двустороннее движение: Студент и Преподаватель'
                : 'DEM-CAMP — A Two-Way Bridge: Students & Faculty'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {lang === 'ky'
                ? 'Бул бир гана суроо берүү эмес. Бул окутуучунун студенттин муктаждыгын түшүнүүсү, ал эми студенттин жоопкерчиликтүү жана демилгелүү болушу.'
                : lang === 'ru'
                ? 'Это не просто сервис обращений. Это культура доверия, где преподаватель лучше понимает ожидания нового поколения, а студент становится соавтором изменений в университете.'
                : 'More than a feedback portal — it is a culture of mutual trust where faculty understand the modern student experience, and students actively co-create institutional progress.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('dialogue')}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs"
          >
            {lang === 'ky' ? 'Диалогго кошулуу' : lang === 'ru' ? 'Участвовать в Диалоге' : 'Join the Dialogue'}
          </button>
        </div>
      </div>
    </div>
  );
};
