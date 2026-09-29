import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Layers,
  Languages,
  Users,
  CheckCircle2,
  Award,
  ArrowRight,
  BookOpen,
  X,
  Copy,
  Check,
  Lightbulb,
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import { Language } from '../../types';
import { METHODOLOGY_CARDS, MethodologyCard } from '../../data/practiceHubData';

interface MethodologyViewProps {
  lang: Language;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ lang }) => {
  const [selectedCard, setSelectedCard] = useState<MethodologyCard | null>(METHODOLOGY_CARDS[0]);
  const [copied, setCopied] = useState(false);

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'Globe': return Globe;
      case 'Layers': return Layers;
      case 'Languages': return Languages;
      case 'Users': return Users;
      case 'CheckCircle2': return CheckCircle2;
      case 'Award': return Award;
      default: return Lightbulb;
    }
  };

  const handleCopyExample = (card: MethodologyCard) => {
    const text = `
МЕТОДИКАЛЫК ҮЛГҮ: ${card.title}
Түшүндүрмөсү: ${card.summary}

МИСАЛ САБАК:
Предмети: ${card.exampleLesson.subject} (${card.exampleLesson.grade})
Темасы: ${card.exampleLesson.topic}
Максаты: ${card.exampleLesson.goal}

ЭТАПТАРЫ:
${card.exampleLesson.steps.map((s, i) => `${i + 1}. ${s.phase} -> ${s.activity} (Жыйынтык: ${s.outcome})`).join('\n')}

МЕТОДИСТТИН КЕҢЕШТЕРИ:
${card.internTips.map((tip) => `- ${tip}`).join('\n')}
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Педагогикалык методикалар</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Методикалык жардам борбору
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Заманбап 7 алдыңкы окутуу технологиясы. Ар бир карточканы ачып, теориясын, негизги принциптерин жана даяр мисал сабагын көрүңүз.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs text-slate-600">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>Карточканы тандап, мисал сабакты ачыңыз</span>
        </div>
      </div>

      {/* Grid of the 7 Methodology Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {METHODOLOGY_CARDS.map((card) => {
          const isSelected = selectedCard?.id === card.id;
          const Icon = getMethodIcon(card.icon);

          return (
            <div
              key={card.id}
              id={`method-card-${card.id}`}
              onClick={() => setSelectedCard(card)}
              className={`rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.accentColor} text-white flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {card.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>{isSelected ? 'Ачылды' : 'Түшүндүрмө & Мисал'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Showcase & Example Lesson for Selected Card */}
      {selectedCard && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-xl space-y-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedCard.accentColor} text-white flex items-center justify-center shadow-md`}
              >
                {React.createElement(getMethodIcon(selectedCard.icon), { className: 'w-6 h-6' })}
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {selectedCard.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  {selectedCard.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedCard.subtitle}</p>
              </div>
            </div>

            <button
              id="btn-copy-method-example"
              onClick={() => handleCopyExample(selectedCard)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Көчүрүлдү!' : 'Мисал сабакты көчүрүү'}</span>
            </button>
          </div>

          {/* Explanation Summary & Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                📖 Методологиянын маңызы:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {selectedCard.summary}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                🎯 Негизги принциптери:
              </span>
              <ul className="text-xs text-slate-700 space-y-1.5">
                {selectedCard.principles.map((pr, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pr}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Example Lesson Box */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mr-2">
                  МИСАЛ САБАК: {selectedCard.exampleLesson.grade}
                </span>
                <span className="text-xs text-slate-400">
                  {selectedCard.exampleLesson.subject}
                </span>
                <h4 className="text-lg font-bold text-white mt-1">
                  {selectedCard.exampleLesson.topic}
                </h4>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                Максаты: {selectedCard.exampleLesson.goal}
              </span>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Сабактын кадам сайын өтүү тартиби:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedCard.exampleLesson.steps.map((st, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 block">
                      {st.phase}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {st.activity}
                    </p>
                    <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                      <span className="text-emerald-300 font-semibold">Жыйынтык: </span>
                      {st.outcome}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Intern Tips */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-100 text-xs space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                <Lightbulb className="w-4 h-4 text-amber-300" />
                Методисттин практикантка 3 алтын кеңеши:
              </span>
              <ul className="text-xs text-emerald-200/90 space-y-1 list-disc list-inside">
                {selectedCard.internTips.map((tip, tIdx) => (
                  <li key={tIdx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* KAO PISA Methodology Callout */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-amber-950">
                Улуттук PISA методикалык базасы: КАО (kao.kg/pisa)
              </h4>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                PISA 2025/2026
              </span>
            </div>
            <p className="text-xs text-amber-900/90 mt-1 leading-relaxed max-w-2xl">
              Кыргыз билим берүү академиясынын (КАО) расмий PISA платформасынан окуучулардын функционалдык, математикалык жана табигый-илимий сабаттуулугун калыптандыруу боюнча эл аралык стандарттагы үлгү тапшырмаларды жана баалоо критерийлерин үйрөнүңүз.
            </p>
          </div>
        </div>

        <a
          id="btn-methodology-kao-pisa"
          href="https://kao.kg/pisa/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-600/20 cursor-pointer"
        >
          <span>kao.kg/pisa порталын ачуу</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* RIPK.KG Methodology Callout */}
      <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-emerald-950">
              Мамлекеттик усулдук база: РИПК жана КДПИ (ripk.kg)
            </h4>
            <p className="text-xs text-emerald-800 mt-1 leading-relaxed max-w-2xl">
              КР Билим берүү жана илим министрлигинин алдындагы институттун расмий сайтынан республикалык деңгээлдеги жаңы окутуу усулдарын, сабактын типтүү түзүлүштөрүн жана мугалимдин кесиптик өнүгүү курстарын изилдеңиз.
            </p>
          </div>
        </div>

        <a
          id="btn-methodology-ripk"
          href="https://ripk.kg"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <span>ripk.kg порталын ачуу</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
