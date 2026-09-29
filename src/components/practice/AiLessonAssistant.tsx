import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Copy,
  Check,
  Printer,
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
  FileText,
  Presentation,
  Award,
  HelpCircle,
  RotateCcw,
  Download,
  Share2
} from 'lucide-react';
import { Language } from '../../types';
import { PRACTICE_SUBJECTS, PRACTICE_GRADES } from '../../data/practiceData';

interface GeneratedLessonResult {
  title: string;
  grade: string;
  subject: string;
  duration: string;
  methodology: string;
  goals: {
    educational: string;
    developmental: string;
    educative: string;
  };
  stages: {
    phase: string;
    time: string;
    teacherWords: string;
    studentAction: string;
    method: string;
  }[];
  assessmentRubric: {
    level: string;
    criteria: string;
    points: string;
  }[];
  homework: {
    standard: string;
    creative: string;
  };
  worksheet: {
    task1: string;
    task2: string;
    task3: string;
  };
  presentationStructure: {
    slideNumber: number;
    title: string;
    content: string;
  }[];
}

interface AiLessonAssistantProps {
  lang: Language;
  prefillSubject?: string;
  prefillTopic?: string;
  prefillGrade?: string;
}

export const AiLessonAssistant: React.FC<AiLessonAssistantProps> = ({
  lang,
  prefillSubject = 'biology',
  prefillTopic = '',
  prefillGrade = 'grade-7'
}) => {
  // Form State
  const [selectedGrade, setSelectedGrade] = useState<string>(prefillGrade);
  const [selectedSubject, setSelectedSubject] = useState<string>(prefillSubject);
  const [topicInput, setTopicInput] = useState<string>(prefillTopic);
  const [duration, setDuration] = useState<string>('45');
  const [methodology, setMethodology] = useState<string>('STEAM');

  // Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedLesson, setGeneratedLesson] = useState<GeneratedLessonResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'plan' | 'worksheet' | 'slides' | 'assessment'>('plan');

  // Default suggested topics per subject
  const suggestedTopics: Record<string, string[]> = {
    biology: ['Өсүмдүк жана жаныбар клеткасынын айырмасы', 'Фотосинтез процесси жана анын мааниси', 'Адамдын дем алуу системасы'],
    chemistry: ['Заттардын тазалыгы жана аралашмалар', 'Кислоталар жана негиздер. Индикаторлор', 'Химиялык реакциянын белгилери'],
    math: ['Жөнөкөй жана ондук бөлчөктөр', 'Пифагор теоремасы жана турмушта колдонулушу', 'Бир белгисиздуу сызыктуу теңдемелер'],
    kyrgyz: ['Зат атоочтун жөндөлүшү жана синтаксистик милдети', 'Сөз айкашы жана сүйлөм мүчөлөрү', 'Манас эпосундагы тарбиялык идеялар'],
    english: ['Present Simple vs Present Continuous', 'Environmental Problems & Green Energy', 'My Future Profession'],
    geography: ['Кыргызстандын климаты жана суу ресурстары', 'Жер титирөө жана сейсмикалык коопсуздук', 'Дүйнөлүк океан жана материктер'],
    physics: ['Ньютондун закондору жана кыймыл', 'Жарыктын чагылышы жана сынышы', 'Архимед күчү жана нерселердин сүзүшү'],
    primary: ['Көбөйтүү таблицасын оюн аркылуу үйрөнүү', 'Алиппе: үндүү жана үнсүз тыбыштар', 'Табият таануу: Төрт мезгилдин сыры'],
    pe: ['Баскетбол: Топту алып жүрүү жана ыргытуу техникасы', 'Кыймылдуу эстафеталар жана командалык ынтымак', 'Гимнастикалык көнүгүүлөр жана туура дем алуу'],
    kindergarten: ['Түстөрдү жана геометриялык фигураларды айырмалоо', 'Жаныбарлардын үндөрүн тууроо жана сүйлөөнү өстүрүү', 'Сенсордук оюнчуктар менен майда моторика']
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    const subjectObj = PRACTICE_SUBJECTS.find((s) => s.id === selectedSubject) || PRACTICE_SUBJECTS[0];
    const gradeObj = PRACTICE_GRADES.find((g) => g.id === selectedGrade) || PRACTICE_GRADES[0];
    const effectiveTopic = topicInput.trim() || suggestedTopics[selectedSubject]?.[0] || 'Жаңы түшүнүктөрдү өздөштүрүү';

    setTimeout(() => {
      // Craft realistic, thorough pedagogical lesson result based on selected parameters
      const result: GeneratedLessonResult = {
        title: effectiveTopic,
        grade: gradeObj.labelKy,
        subject: subjectObj.nameKy.split(' (')[0],
        duration: `${duration} мүнөт`,
        methodology: methodology,
        goals: {
          educational: `Окуучулар «${effectiveTopic}» түшүнүгүнүн маңызын, эрежелерин жана негизги касиеттерин толук түшүнүп, өз сөздөрү менен так түшүндүрүп бере алышат.`,
          developmental: `Окуучулардын сынчыл ой жүгүртүүсү, 4C (Creative, Critical, Collaborative, Communicative) көндүмдөрү жана маалыматты анализдеп, салыштыруу жөндөмү өнүгөт.`,
          educative: `Бири-бирин угуу маданияты, топто ынтымактуу иштөө, жоопкерчиликтүүлүк жана илимге болгон кызыгуу калыптанат.`
        },
        stages: [
          {
            phase: '1. Уюштуруу & Мотивация',
            time: `${Math.round(parseInt(duration) * 0.1)} мин`,
            teacherWords: `«Саламатсыздарбы, урматтуу окуучулар! Бүгүнкү сабагыбыз өзгөчө болмокчу. Баарыбыз терең дем алып, көңүлүбүздү доскага бурабыз. Бүгүн биз турмушта күн сайын жолуккан керемет кубулуштун сырын ачабыз!»`,
            studentAction: `Окуу куралдарын даярдашат, саламдашышат, өз ара жылмаюу тартуулап позитивдүү маанай түзүшөт.`,
            method: 'Психологиялык маанай, "Жылмаюу чынжыры"'
          },
          {
            phase: '2. Мээге чабуул & Көйгөйлүү суроо',
            time: `${Math.round(parseInt(duration) * 0.15)} мин`,
            teacherWords: `«Балдар, карагылачы, эгерде биз ${effectiveTopic} кубулушун жок кылсак же байкабасак, күнүмдүк жашообузда эмне өзгөрөт эле? Ким өз божомолун айтат?»`,
            studentAction: `Жекече ойлонушат, жупта талкуулашат (Think-Pair-Share), өз божомолдорду эркин айтышат.`,
            method: 'Think-Pair-Share, PISA форматындагы турмуштук кырдаал'
          },
          {
            phase: '3. Жаңы теманы ачуу & Интерактивдүү түшүндүрүү',
            time: `${Math.round(parseInt(duration) * 0.35)} мин`,
            teacherWords: `«Мына ошондуктан илимпоздор төмөнкү эрежени далилдешкен. Слайддагы схемага көңүл бургула: бул жерде башкы ролду 3 фактор ойнойт... Азыр ар бир топко изилдөөчүлүк карточкаларды таркатам.»`,
            studentAction: `Карточкалар менен иштешет, негизги терминдерди дептерге жазышат, слайддагы моделдерди анализдешет.`,
            method: `${methodology} технологиясы, Көргөзмөлүүлүк`
          },
          {
            phase: '4. Бышыктоо & Практикалык тапшырма',
            time: `${Math.round(parseInt(duration) * 0.25)} мин`,
            teacherWords: `«Азаматсыздар! Эми алган билимибизди практикада сынайлы. Таркатма барактагы (Worksheet) 2-көнүгүүнү тобуңуздар менен чыгарып, лидер доскага коргойт.»`,
            studentAction: `Worksheet көнүгүүлөрүн аткарышат, бири-бирине түшүндүрүшөт, жыйынтыгын таблицага салыштырышат.`,
            method: 'Дидактикалык оюн, Топтук иш'
          },
          {
            phase: '5. Баалоо, Рефлексия & Exit Ticket',
            time: `${Math.round(parseInt(duration) * 0.15)} мин`,
            teacherWords: `«Бүгүнкү сабакта өзгөчө жигердүү болгон окуучуларга ыраазычылык. Чыгуу барагындагы (Exit Ticket) 2 суроого жооп берип, кутуга таштап кетебиз.»`,
            studentAction: `Чыгуу билетин толтурушат, өзүн-өзү жана бири-бирин баалоо шкаласы менен жыйынтык чыгарышат.`,
            method: 'Exit Ticket, Формативдик кайтарым байланыш'
          }
        ],
        assessmentRubric: [
          {
            level: '«5» (Эң жакшы / Жогорку)',
            criteria: 'Теманын маңызын толук түшүнөт, өз алдынча чыгармачыл далилдерди келтирет, катасыз аткарат.',
            points: '85–100%'
          },
          {
            level: '«4» (Жакшы / Ортодон жогору)',
            criteria: 'Негизги түшүнүктөрдү билет, көнүгүүлөрдү туура чыгарат, бирок 1-2 майда так эместиктерге жол берет.',
            points: '70–84%'
          },
          {
            level: '«3» (Канааттандырарлык)',
            criteria: 'Аныктамаларды жаттап айтат, бирок турмуштук мисалдар менен байланыштырууда мугалимдин жардамына муктаж.',
            points: '50–69%'
          }
        ],
        homework: {
          standard: `Окуу китебиндеги теманы окуп, параграфтын аягындагы 1- жана 3-суроолорго жазуу түрүндө жооп берүү.`,
          creative: `«Эгерде мен илимпоз болсом...» деген темада 1 беттик чакан эссе жазуу же тема боюнча 3 суроодон турган викторина түзүп келүү.`
        },
        worksheet: {
          task1: `1-көнүгүү (Түшүнүү): Төмөнкү терминдердин туура аныктамасын сызык аркылуу дал келтиргиле.`,
          task2: `2-көнүгүү (Колдонуу): Берилген схемадагы же формуладагы бош орундарды турмуштук фактылар менен толуктагыла.`,
          task3: `3-көнүгүү (PISA/STEAM): Эмне себептен бул кубулуш күнүмдүк турмушта маанилүү? 2 аргумент жазыңыз.`
        },
        presentationStructure: [
          {
            slideNumber: 1,
            title: `Титулдук слайд: ${effectiveTopic}`,
            content: `Предмет: ${subjectObj.nameKy.split(' (')[0]} | Класс: ${gradeObj.labelKy} | Мугалим-практикант`
          },
          {
            slideNumber: 2,
            title: `Бүгүнкү сабактын максаты & Суроо`,
            content: `Биз эмнелерди үйрөнөбүз? Көйгөйлүү сүрөт жана мээге чабуул.`
          },
          {
            slideNumber: 3,
            title: `Негизги түшүнүктөр жана Аныктамалар`,
            content: `Инфографика, негизги терминдер жана образдуу салыштыруу.`
          },
          {
            slideNumber: 4,
            title: `Турмуштук мисалдар & STEAM байланышы`,
            content: `Илимдин реалдуу турмушта, техникада жана жаратылышта колдонулушу.`
          },
          {
            slideNumber: 5,
            title: `Топтук тапшырма & Worksheet`,
            content: `Ар бир топ үчүн критерийлер жана таймер (10 мүнөт).`
          },
          {
            slideNumber: 6,
            title: `Жыйынтыктоо & Exit Ticket`,
            content: `Бүгүн эмнени түшүндүк? Үй тапшырмасы жана рефлексия.`
          }
        ]
      };

      setGeneratedLesson(result);
      setIsGenerating(false);
    }, 600);
  };

  const handleCopyFullPlan = () => {
    if (!generatedLesson) return;

    const fullText = `
ОШ МЕКТЕП-ПРАКТИКАСЫ: AI МЕНЕН ТҮЗҮЛГӨН САБАКТЫН ПЛАН-КОНСПЕКТИ
==================================================
Тема: ${generatedLesson.title}
Предмет: ${generatedLesson.subject}
Класс: ${generatedLesson.grade}
Сабактын убактысы: ${generatedLesson.duration}
Методикалык багыт: ${generatedLesson.methodology}

1. САБАКТЫН МАКСАТТАРЫ:
- Билим берүүчүлүк: ${generatedLesson.goals.educational}
- Өнүктүрүүчүлүк: ${generatedLesson.goals.developmental}
- Тарбиялык: ${generatedLesson.goals.educative}

2. САБАКТЫН ЭТАПТАРЫ ЖАНА МУГАЛИМДИН СӨЗДӨРҮ:
${generatedLesson.stages.map((s) => `
[${s.phase}] (${s.time})
• Мугалимдин сөзү: ${s.teacherWords}
• Окуучунун иш-аракети: ${s.studentAction}
• Колдонулган усул: ${s.method}
`).join('\n')}

3. БААЛОО КРИТЕРИЙЛЕРИ:
${generatedLesson.assessmentRubric.map((r) => `- ${r.level}: ${r.criteria} (${r.points})`).join('\n')}

4. ТАРКАТМА БАРАК (WORKSHEET):
${generatedLesson.worksheet.task1}
${generatedLesson.worksheet.task2}
${generatedLesson.worksheet.task3}

5. ПРЕЗЕНТАЦИЯ СТРУКТУРАСЫ:
${generatedLesson.presentationStructure.map((sl) => `Слайд ${sl.slideNumber}: ${sl.title} -> ${sl.content}`).join('\n')}

6. ҮЙ ТАПШЫРМАСЫ:
- Негизги: ${generatedLesson.homework.standard}
- Чыгармачыл: ${generatedLesson.homework.creative}
    `;

    navigator.clipboard.writeText(fullText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Bot className="w-3.5 h-3.5" />
            <span>Педагогикалык AI Генератор</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Сабак жардамчысы
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Классты, предметти, теманы жана каалаган методикаңызды тандаңыз. AI практикант үчүн мугалимдин сөздөрүн, хронометражын, таркатма баракчасын жана презентация структурасын автоматтык түрдө даярдап берет.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>КР Стандартына 100% шайкеш</span>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <span>Сабактын параметрлерин толтуруңуз</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Класс */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Класс (1–11, садик):</span>
            </label>
            <select
              id="ai-select-grade"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {PRACTICE_GRADES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.labelKy} ({g.ageKy})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Предмет */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Предмет:</span>
            </label>
            <select
              id="ai-select-subject"
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                // auto set first suggestion
                if (suggestedTopics[e.target.value]?.[0]) {
                  setTopicInput(suggestedTopics[e.target.value][0]);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {PRACTICE_SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameKy}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Сабак убактысы */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Сабак убактысы:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: '45', label: '45 мин' },
                { val: '40', label: '40 мин' },
                { val: '25', label: '25 мин (садик)' }
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  id={`ai-btn-duration-${item.val}`}
                  onClick={() => setDuration(item.val)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                    duration === item.val
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Тема & Suggestions */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Сабактын темасы:</span>
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Өз темаңызды жазыңыз же төмөнкү сунуштардан тандаңыз
            </span>
          </label>
          <input
            id="ai-input-topic"
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Мисалы: Зат атоочтун жөндөлүшү же Фотосинтез процесси..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Quick topic pills */}
          {suggestedTopics[selectedSubject] && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400">Сунуштар:</span>
              {suggestedTopics[selectedSubject].map((sTopic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopicInput(sTopic)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 transition-colors cursor-pointer"
                >
                  + {sTopic}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. Методика */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Колдонулуучу методика (STEAM, PISA, Блум, ж.б.):</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'STEAM', label: 'STEAM усулу' },
              { id: 'PISA', label: 'PISA сабаттуулук' },
              { id: 'Bloom', label: 'Блум таксономиясы' },
              { id: 'Interactive', label: 'Интерактивдүү оюн' },
              { id: 'Project', label: 'Долбоордук окутуу' },
              { id: 'CLIL', label: 'CLIL (Тил+Илим)' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                id={`ai-method-${m.id}`}
                onClick={() => setMethodology(m.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                  methodology === m.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button: 'Сабакты жаратуу' */}
        <div className="pt-2">
          <button
            id="btn-generate-ai-lesson"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>Сабак түзүлүүдө... Күтө туруңуз</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Сабакты жаратуу</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Lesson Output Result */}
      {generatedLesson && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-xl space-y-6 animate-fadeIn">
          {/* Output Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {generatedLesson.grade} • {generatedLesson.subject}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {generatedLesson.duration} • {generatedLesson.methodology}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {generatedLesson.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-copy-ai-lesson"
                onClick={handleCopyFullPlan}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Көчүрүлдү!' : 'Толук планды көчүрүү'}</span>
              </button>

              <button
                id="btn-print-ai-lesson"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Басып чыгаруу (Print/PDF)</span>
              </button>
            </div>
          </div>

          {/* Sub-tabs for Result: Plan, Worksheet, Slides, Assessment */}
          <div className="flex items-center gap-2 border-b border-slate-100 overflow-x-auto pb-1">
            {[
              { id: 'plan', label: '1. Сабактын планы & Мугалимдин сөзү', icon: FileText },
              { id: 'worksheet', label: '2. Worksheet (Таркатма барак)', icon: BookOpen },
              { id: 'slides', label: '3. Презентация структурасы', icon: Presentation },
              { id: 'assessment', label: '4. Баалоо & Үй тапшырмасы', icon: Award }
            ].map((ot) => (
              <button
                key={ot.id}
                onClick={() => setActiveOutputTab(ot.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeOutputTab === ot.id
                    ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ot.icon className="w-3.5 h-3.5" />
                <span>{ot.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: FULL PLAN & TEACHER WORDS */}
          {activeOutputTab === 'plan' && (
            <div className="space-y-6">
              {/* 3 Goals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <span className="font-bold text-emerald-900 text-xs block mb-1">
                    🎯 Билим берүүчүлүк максаты:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {generatedLesson.goals.educational}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <span className="font-bold text-blue-900 text-xs block mb-1">
                    💡 Өнүктүрүүчүлүк максаты:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {generatedLesson.goals.developmental}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <span className="font-bold text-purple-900 text-xs block mb-1">
                    🤝 Тарбиялык максаты:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {generatedLesson.goals.educative}
                  </p>
                </div>
              </div>

              {/* Stages Timeline with teacher speech and student actions */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Сабактын этаптары, мугалимдин сөздөрү жана окуучунун аракети:
                </span>

                {generatedLesson.stages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <span className="font-extrabold text-sm text-emerald-800">
                        {stage.phase}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-mono text-[11px]">
                          {stage.time}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {stage.method}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                        <span className="font-bold text-slate-900 block mb-1">
                          🗣️ Мугалимдин сөзү (Практикант эмне деп айтат):
                        </span>
                        <p className="text-slate-700 italic leading-relaxed font-normal">
                          {stage.teacherWords}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                        <span className="font-bold text-slate-900 block mb-1">
                          ✍️ Окуучунун иш-аракети:
                        </span>
                        <p className="text-slate-700 leading-relaxed font-normal">
                          {stage.studentAction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: WORKSHEET */}
          {activeOutputTab === 'worksheet' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    ТАПШЫРМА БАРАГЫ (WORKSHEET)
                  </h4>
                  <span className="text-xs text-slate-500">
                    Тема: {generatedLesson.title} | Окуучунун аты-жөнү: ____________________
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`WORKSHEET: ${generatedLesson.title}\n\n1. ${generatedLesson.worksheet.task1}\n2. ${generatedLesson.worksheet.task2}\n3. ${generatedLesson.worksheet.task3}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Worksheet'ти көчүрүү</span>
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono bg-white p-6 rounded-2xl border border-slate-200">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="font-bold text-slate-900 mb-1">{generatedLesson.worksheet.task1}</p>
                  <p className="text-slate-400">Жооп үчүн орун: _________________________________________________</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="font-bold text-slate-900 mb-1">{generatedLesson.worksheet.task2}</p>
                  <p className="text-slate-400">Жооп үчүн орун: _________________________________________________</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="font-bold text-slate-900 mb-1">{generatedLesson.worksheet.task3}</p>
                  <p className="text-slate-400">Жооп үчүн орун: _________________________________________________</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SLIDES STRUCTURE */}
          {activeOutputTab === 'slides' && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                6 Слайддан турган презентация схемасы:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedLesson.presentationStructure.map((sl) => (
                  <div
                    key={sl.slideNumber}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Слайд {sl.slideNumber}
                      </span>
                      <Presentation className="w-4 h-4 text-slate-400" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">{sl.title}</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                      {sl.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ASSESSMENT & HOMEWORK */}
          {activeOutputTab === 'assessment' && (
            <div className="space-y-6">
              {/* Assessment Rubric Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Баалоо критерийлеринин рубрикасы:
                </span>
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 font-bold text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">Баа деңгээли</th>
                        <th className="p-3">Критерий / Дескриптор</th>
                        <th className="p-3">Пайыздык ченем</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {generatedLesson.assessmentRubric.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/70">
                          <td className="p-3 font-bold text-emerald-800">{r.level}</td>
                          <td className="p-3 text-slate-700">{r.criteria}</td>
                          <td className="p-3 font-mono text-slate-500">{r.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Homework */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">
                    📚 1. Негизги үй тапшырмасы:
                  </span>
                  <p className="text-xs text-slate-700">{generatedLesson.homework.standard}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <span className="text-xs font-bold text-amber-900 block">
                    🎨 2. Чыгармачыл / Өнүктүрүүчү тапшырма:
                  </span>
                  <p className="text-xs text-amber-900">{generatedLesson.homework.creative}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
