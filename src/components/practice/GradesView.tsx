import React, { useState } from 'react';
import { 
  GraduationCap, 
  Baby, 
  Clock, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  CheckCircle2,
  Lightbulb,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Language } from '../../types';
import { PRACTICE_GRADES, PracticeSubjectId } from '../../data/practiceData';
import { GradePedagogySection } from './GradePedagogySection';

interface GradesViewProps {
  lang: Language;
  onSelectGrade: (gradeId: string) => void;
  onSelectSubjectWithGrade?: (subjectId: PracticeSubjectId, gradeId: string) => void;
  initialGradeId?: string;
}

export const GradesView: React.FC<GradesViewProps> = ({
  lang,
  onSelectGrade,
  onSelectSubjectWithGrade,
  initialGradeId = 'grade-1'
}) => {
  const [activeTab, setActiveTab] = useState<'pedagogy-guide' | 'all-grades'>('pedagogy-guide');
  const [selectedGradeForPedagogy, setSelectedGradeForPedagogy] = useState<string>(initialGradeId);

  // Rich details for each grade
  const gradeDetails: Record<string, {
    stageTitleKy: string;
    focusKy: string;
    durationKy: string;
    subjectsListKy: string[];
    psychologyTipKy: string;
    bgAccent: string;
  }> = {
    'kindergarten': {
      stageTitleKy: 'Мектепке чейинки курак',
      focusKy: 'Оюн аркылуу дүйнөнү таануу, сенсорика, майда моторика, социализация',
      durationKy: '20-25 мүнөт (оюн түрүндө)',
      subjectsListKy: ['Сенсорика', 'Сүрөт/Көркөм өнөр', 'Тил өстүрүү', 'Музыка'],
      psychologyTipKy: 'Балдар 10-15 мүнөттөн ашык көңүлүн бир нерсеге топтой албайт, оюнду тез-тез алмаштырып туруу зарыл.',
      bgAccent: 'from-pink-500 to-rose-600'
    },
    'grade-1': {
      stageTitleKy: 'Башталгыч баскыч',
      focusKy: 'Мектепке көнүү, партада отуруу маданияты, Алиппе жана алгачкы эсептөө',
      durationKy: '35 мүнөт (2 жолу физминутка менен)',
      subjectsListKy: ['Алиппе/Окуу', 'Жазуу', 'Математика', 'Мекен таануу'],
      psychologyTipKy: 'Баа коюлбайт, ар бир кичине ийгилигин (кол көтөргөнүн, туура отурганын) мактоо маанилүү.',
      bgAccent: 'from-emerald-500 to-green-600'
    },
    'grade-2': {
      stageTitleKy: 'Башталгыч баскыч',
      focusKy: 'Шар окуу, каллиграфиялык сулуу жазуу, көбөйтүү таблицасына киришүү',
      durationKy: '40 мүнөт',
      subjectsListKy: ['Кыргыз тили', 'Математика', 'Адабий окуу', 'Англис тили'],
      psychologyTipKy: 'Көргөзмөлүүлүк принциби: түстүү карточкалар, магниттик фигуралар жана топтук оюндар.',
      bgAccent: 'from-teal-500 to-emerald-600'
    },
    'grade-3': {
      stageTitleKy: 'Башталгыч баскыч',
      focusKy: 'Тексттин мазмунун айтып берүү, тексттик маселелерди чыгаруу, сөздүк курамы',
      durationKy: '40-45 мүнөт',
      subjectsListKy: ['Кыргыз тили', 'Математика', 'Мекен таануу', 'Англис тили'],
      psychologyTipKy: 'Окуучулар бири-бири менен салыштыра башташат, атаандаштыкты достук кызматташтыкка багыттаңыз.',
      bgAccent: 'from-green-600 to-teal-700'
    },
    'grade-4': {
      stageTitleKy: 'Башталгычты бүтүрүү',
      focusKy: 'Башталгыч мектепти жыйынтыктоо, өз алдынча маалымат издөө, дилбаян жазуу',
      durationKy: '45 мүнөт',
      subjectsListKy: ['Кыргыз тили', 'Математика', 'Табият таануу', 'Англис тили'],
      psychologyTipKy: '5-класска өтүүгө психологиялык даярдык: предметтик кабинеттер менен тааныштыруу.',
      bgAccent: 'from-emerald-600 to-cyan-700'
    },
    'grade-5': {
      stageTitleKy: 'Орто звено (Өткөөл курак)',
      focusKy: 'Кабинеттик системге көнүү, бир нече жаңы мугалимдин талаптарына ыңгайлашуу',
      durationKy: '45 мүнөт',
      subjectsListKy: ['Математика', 'Кыргыз адабияты', 'Тарых', 'Табият таануу'],
      psychologyTipKy: 'Адаптациялык кризис болушу мүмкүн; үй тапшырмасынын көлөмүн көзөмөлдөп, колдоо көрсөтүү керек.',
      bgAccent: 'from-blue-600 to-indigo-700'
    },
    'grade-6': {
      stageTitleKy: 'Орто звено',
      focusKy: 'Логикалык ой жүгүртүү, географиялык карталар менен иштөө, биологиялык терминдер',
      durationKy: '45 мүнөт',
      subjectsListKy: ['Математика', 'Биология', 'География', 'Кыргыз тили'],
      psychologyTipKy: 'Курдаштарынын пикири мугалимдикинен жогору тура баштайт; жуптук жана командалык таймаштар өтө эффективдүү.',
      bgAccent: 'from-indigo-600 to-blue-700'
    },
    'grade-7': {
      stageTitleKy: 'Өспүрүм курак (Жаңы илимдер)',
      focusKy: 'Физика жана алгебра илимдерине киришүү, абстракттуу формулалар жана лаборатория',
      durationKy: '45 мүнөт',
      subjectsListKy: ['Алгебра', 'Геометрия', 'Физика', 'Биология', 'География'],
      psychologyTipKy: 'Физикалык эксперименттер аркылуу теорияны турмушка байланыштыруу мотивацияны сактайт.',
      bgAccent: 'from-sky-600 to-cyan-700'
    },
    'grade-8': {
      stageTitleKy: 'Өспүрүм курак',
      focusKy: 'Химия илимине киришүү, химиялык теңдемелер, геометриялык теоремаларды далилдөө',
      durationKy: '45 мүнөт',
      subjectsListKy: ['Химия', 'Физика', 'Алгебра', 'Кыргыз тили', 'Англис тили'],
      psychologyTipKy: 'Класста лидерлик талашуу күчөйт; баарына сөз берип, калыс баалоо принцибин сактаңыз.',
      bgAccent: 'from-teal-600 to-emerald-700'
    },
    'grade-9': {
      stageTitleKy: 'Негизги мектепти бүтүрүү',
      focusKy: 'Мамлекеттик бүтүрүү сынактары, кесип тандоо (колледж же 10-класс), коомдук сабаттуулук',
      durationKy: '45 мүнөт',
      subjectsListKy: ['Алгебра/Геометрия', 'Физика', 'Химия', 'Биология', 'Тарых'],
      psychologyTipKy: 'Сынак алдындагы стресс күчөйт; өзүнө ишенимди арттырып, тест менен иштөө стратегиясын үйрөтүңүз.',
      bgAccent: 'from-emerald-700 to-green-800'
    },
    'grade-10': {
      stageTitleKy: 'Жогорку класс',
      focusKy: 'Тереңдетилген профилдик билим, илимий-изилдөөчүлүк долбоорлор, ЖРТга (ОРТ) даярдык',
      durationKy: '45 мүнөт',
      subjectsListKy: ['Алгебра/Анализ', 'Физика', 'Химия', 'Кыргыз адабияты'],
      psychologyTipKy: 'Окуучуларга чоң адамдардай мамиле кылуу, дискуссия жана дебат усулдарын кеңири колдонуу керек.',
      bgAccent: 'from-emerald-800 to-teal-900'
    },
    'grade-11': {
      stageTitleKy: 'Бүтүрүүчү класс',
      focusKy: 'ЖРТ (ОРТ) тесттерине активдүү даярдануу, университет тандоо, турмуштук көз караш',
      durationKy: '45 мүнөт',
      subjectsListKy: ['ЖРТ Математика', 'Аналогиялар/Окуу', 'Профилдик сабактар'],
      psychologyTipKy: 'Убакытты башкаруу (Time management) жана сынак учурунда эмоцияны кармоо боюнча кеңештерди бериңиз.',
      bgAccent: 'from-slate-800 to-emerald-950'
    }
  };

  const handleOpenPedagogyForGrade = (gradeId: string) => {
    setSelectedGradeForPedagogy(gradeId);
    setActiveTab('pedagogy-guide');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* View Mode Tabs: Pedagogy Module vs All Grades Cards */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            id="tab-btn-pedagogy-guide"
            onClick={() => setActiveTab('pedagogy-guide')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'pedagogy-guide'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-transparent text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Жаш өзгөчөлүгү жана методикалык жардам (8 карточка)</span>
          </button>

          <button
            id="tab-btn-all-grades"
            onClick={() => setActiveTab('all-grades')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'all-grades'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-transparent text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>12 Курактык топ сереби (1–11-класс)</span>
          </button>
        </div>

        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-100">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
          <span>DEM Practice Hub</span>
        </span>
      </div>

      {activeTab === 'pedagogy-guide' && (
        <GradePedagogySection
          lang={lang}
          selectedGradeId={selectedGradeForPedagogy}
          onSelectGradeId={(gid) => setSelectedGradeForPedagogy(gid)}
          onExploreSubjects={(gid) => onSelectGrade(gid)}
        />
      )}

      {activeTab === 'all-grades' && (
        <>
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>1–11-класстар жана Садик</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Класстар боюнча педагогикалык колдонмо
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Ар бир класстын курактык, психологиялык жана физиологиялык өзгөчөлүктөрү, сунушталган сабак убактысы жана предметтик басымы.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3 bg-emerald-50 border border-emerald-200/60 p-4 rounded-2xl">
              <Brain className="w-8 h-8 text-emerald-700 shrink-0" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold block">12 Курактык топ</span>
                <span className="text-emerald-700">Бала бакчадан бүтүрүүчүгө чейин</span>
              </div>
            </div>
          </div>

          {/* Grid of Large Grade Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRACTICE_GRADES.map((grade) => {
              const details = gradeDetails[grade.id] || {
                stageTitleKy: 'Окуу баскычы',
                focusKy: 'Жалпы билим берүү',
                durationKy: '45 мүнөт',
                subjectsListKy: ['Негизги сабактар'],
                psychologyTipKy: 'Мамлекеттик стандартка ылайык окутуу.',
                bgAccent: 'from-emerald-600 to-green-700'
              };

              const isKindergarten = grade.id === 'kindergarten';

              return (
                <div
                  key={grade.id}
                  id={`grade-card-${grade.id}`}
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Badge & Number */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${details.bgAccent} text-white flex items-center justify-center font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform`}>
                          {isKindergarten ? <Baby className="w-6 h-6" /> : grade.labelKy.split('-')[0]}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {lang === 'ky' ? grade.labelKy : grade.labelRu}
                          </h3>
                          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {grade.ageKy}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {details.stageTitleKy}
                      </span>
                    </div>

                    {/* Duration indicator */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="font-medium">{details.durationKy}</span>
                    </div>

                    {/* Pedagogical Focus */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Негизги басым:
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed font-normal">
                        {details.focusKy}
                      </p>
                    </div>

                    {/* Subjects tags */}
                    <div className="space-y-1.5 mb-4">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Негизги предметтер:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {details.subjectsListKy.map((sub, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Psychologist Tip Box */}
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs mb-4">
                      <span className="font-bold block text-[11px] text-amber-800 mb-1">
                        💡 Практикантка психологиялык кеңеш:
                      </span>
                      <p className="text-[11px] leading-relaxed text-amber-900/90">
                        {details.psychologyTipKy}
                      </p>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      id={`btn-open-pedagogy-${grade.id}`}
                      onClick={() => handleOpenPedagogyForGrade(grade.id)}
                      className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-200/70 cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Жаш өзгөчөлүгү жана 8 кеңеш</span>
                    </button>

                    <button
                      id={`btn-explore-grade-${grade.id}`}
                      onClick={() => onSelectGrade(grade.id)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 text-slate-800 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all group-hover:bg-emerald-600 group-hover:text-white cursor-pointer shadow-xs"
                    >
                      <span>Сабактарды ачуу</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
