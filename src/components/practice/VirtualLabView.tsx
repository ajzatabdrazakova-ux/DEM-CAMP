import React, { useState } from 'react';
import {
  FlaskConical,
  Dna,
  Sparkles,
  RotateCcw,
  Eye,
  CheckCircle2,
  Info,
  ZoomIn,
  Sliders,
  Beaker,
  ShieldAlert,
  ExternalLink,
  Microscope
} from 'lucide-react';
import { Language } from '../../types';

interface VirtualLabViewProps {
  lang: Language;
}

export const VirtualLabView: React.FC<VirtualLabViewProps> = ({ lang }) => {
  const [activeSubject, setActiveSubject] = useState<'chemistry' | 'biology'>('chemistry');

  // Chemistry Experiment State
  const [selectedSolution, setSelectedSolution] = useState<'hcl' | 'naoh' | 'water' | 'vinegar'>('hcl');
  const [selectedIndicator, setSelectedIndicator] = useState<'litmus' | 'phenolphthalein' | 'methyl-orange' | 'universal'>('litmus');
  const [isReacted, setIsReacted] = useState<boolean>(true);

  // Biology Microscope State
  const [selectedSpecimen, setSelectedSpecimen] = useState<'onion' | 'blood' | 'bacteria' | 'leaf'>('onion');
  const [zoomLevel, setZoomLevel] = useState<number>(40); // 10, 40, 100

  // Solutions data
  const solutions = {
    hcl: {
      nameKy: 'Туз кислотасы (HCl)',
      ph: 1.2,
      type: 'Кислоталуу чөйрө',
      color: 'bg-slate-100',
      formula: 'HCl (күчтүү кислота)'
    },
    naoh: {
      nameKy: 'Натрий гидроксиди (NaOH)',
      ph: 13.5,
      type: 'Жегичтүү (негиздик) чөйрө',
      color: 'bg-slate-100',
      formula: 'NaOH (щелочь)'
    },
    water: {
      nameKy: 'Дистилденген суу (H₂O)',
      ph: 7.0,
      type: 'Нейтралдуу чөйрө',
      color: 'bg-sky-50',
      formula: 'H₂O (бейтарап)'
    },
    vinegar: {
      nameKy: 'Уксус кислотасы (CH₃COOH)',
      ph: 3.0,
      type: 'Алсыз кислоталуу чөйрө',
      color: 'bg-amber-50',
      formula: 'CH₃COOH (органикалык кислота)'
    }
  };

  // Indicators reaction logic
  const getReactionResult = () => {
    if (selectedIndicator === 'litmus') {
      if (selectedSolution === 'hcl' || selectedSolution === 'vinegar') {
        return {
          liquidColor: 'bg-rose-500',
          colorName: 'Кызыл',
          reason: 'Кислоталуу чөйрөдө көк лакмус кызыл түскө өзгөрөт (H⁺ иондорунун таасиринен).'
        };
      } else if (selectedSolution === 'naoh') {
        return {
          liquidColor: 'bg-blue-600',
          colorName: 'Көк',
          reason: 'Жегичтүү чөйрөдө лакмус көк түскө өзгөрөт (OH⁻ гидроксид иондору).'
        };
      } else {
        return {
          liquidColor: 'bg-purple-400',
          colorName: 'Сыя көк / Кызгылт көк',
          reason: 'Нейтралдуу сууда лакмус баштапкы кызгылт көк түсүн сактайт.'
        };
      }
    }

    if (selectedIndicator === 'phenolphthalein') {
      if (selectedSolution === 'naoh') {
        return {
          liquidColor: 'bg-fuchsia-600',
          colorName: 'Ачык Малина түсү',
          reason: 'Фенолфталеин бир гана жегичтүү чөйрөдө (pH > 8.2) каныккан малина түсүнө өтөт!'
        };
      } else {
        return {
          liquidColor: 'bg-slate-100 border border-slate-300',
          colorName: 'Түссүз (тунук)',
          reason: 'Кислоталуу жана нейтралдуу чөйрөдө фенолфталеин түсүн өзгөртпөйт (түссүз бойдон калат).'
        };
      }
    }

    if (selectedIndicator === 'methyl-orange') {
      if (selectedSolution === 'hcl' || selectedSolution === 'vinegar') {
        return {
          liquidColor: 'bg-red-600',
          colorName: 'Кызгылт-кызыл',
          reason: 'Кислоталуу чөйрөдө метилоранж кызыл түскө айланат.'
        };
      } else if (selectedSolution === 'naoh') {
        return {
          liquidColor: 'bg-amber-400',
          colorName: 'Сары',
          reason: 'Жегичтүү чөйрөдө метилоранж ачык сары түскө өтөт.'
        };
      } else {
        return {
          liquidColor: 'bg-orange-400',
          colorName: 'Кызгылт-сары',
          reason: 'Нейтралдуу чөйрөдө кызгылт-сары баштапкы түс сакталат.'
        };
      }
    }

    // Universal indicator
    if (selectedSolution === 'hcl') {
      return {
        liquidColor: 'bg-red-600',
        colorName: 'Кочкул кызыл (pH 1)',
        reason: 'Күчтүү кислота индикатор кагазын кочкул кызыл кылат.'
      };
    } else if (selectedSolution === 'vinegar') {
      return {
        liquidColor: 'bg-orange-500',
        colorName: 'Кызгылт сары (pH 3)',
        reason: 'Алсыз кислоталуу чөйрө.'
      };
    } else if (selectedSolution === 'naoh') {
      return {
        liquidColor: 'bg-indigo-700',
        colorName: 'Кочкул сыя көк (pH 13-14)',
        reason: 'Күчтүү щелочтук чөйрөдө универсал индикатор кочкул көк/сыя болот.'
      };
    } else {
      return {
        liquidColor: 'bg-emerald-500',
        colorName: 'Ачык жашыл (pH 7)',
        reason: 'Таза суу бейтарап жашыл түстү берет.'
      };
    }
  };

  const reaction = getReactionResult();

  // Biology Specimens data
  const specimens = {
    onion: {
      titleKy: 'Пияздын кабыгынын клеткалары (Өсүмдүк)',
      structures: ['Клетка кабыгы (целлюлоза)', 'Ядро (генетикалык борбор)', 'Вакуоль (клетка ширеси)', 'Цитоплазма'],
      visualBg: 'from-amber-100 to-emerald-100',
      descriptionKy: 'Өсүмдүк клеткасынын классикалык үлгүсү. Тунук клеткалык дубалдар жана ачык көрүнгөн ядролор.',
      pisaQuestion: 'Эмне үчүн жаныбар клеткасында өсүмдүктүкүндөй калың клетка кабыгы (cell wall) жок?'
    },
    blood: {
      titleKy: 'Адамдын каны (Эритроциттер)',
      structures: ['Эритроциттер (эки жагы ийилген дисктер)', 'Гемоглобин пигменти', 'Лейкоциттер (коргоочу клеткалар)'],
      visualBg: 'from-rose-100 to-red-200',
      descriptionKy: 'Кычкылтек ташуучу ядросуз эритроциттер жана организмди микробдордон коргогон ак кан клеткалары.',
      pisaQuestion: 'Эритроциттердин ядросунун жоктугу алардын кычкылтек ташуусуна кандай артыкчылык берет?'
    },
    bacteria: {
      titleKy: 'Сенная палочка (Bacillus subtilis)',
      structures: ['Прокариоттук клетка', 'Нуклеоид (шакекче ДНК)', 'Капсула жана шапалакчалар'],
      visualBg: 'from-teal-100 to-slate-200',
      descriptionKy: 'Ядросу калыптанбаган жөнөкөй микроорганизм. Бинардык бөлүнүү жолу менен тез көбөйөт.',
      pisaQuestion: 'Бактериялардын спора пайда кылуу жөндөмү алардын катаал чөйрөдө жашоосуна кандай таасир этет?'
    },
    leaf: {
      titleKy: 'Жалбырактын мезофилли жана хлоропласттары',
      structures: ['Хлоропласттар (жашыл пластиддер)', 'Стомата (устьица - дем алуу тешикчеси)', 'Ксилема түтүкчөлөрү'],
      visualBg: 'from-emerald-200 to-green-300',
      descriptionKy: 'Фотосинтез процесси жүрүүчү жашыл фабрика. Жарык энергиясын химиялык энергияга айландырат.',
      pisaQuestion: 'Күндүз стомата тешикчелери эмне себептен ачылат, ал эми кургакчылыкта жабылат?'
    }
  };

  const currentSpecimen = specimens[selectedSpecimen];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Интерактивдүү симулятор</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Виртуалдык лаборатория
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Мектепте химиялык реагенттер же микроскоп жетишсиз болгондо, окуучуларга сабакты визуалдуу, коопсуз жана кызыктуу өткөрүү үчүн 3D тажрыйбалар.
          </p>
        </div>

        {/* Switcher Chemistry vs Biology */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            id="btn-lab-chem-tab"
            onClick={() => setActiveSubject('chemistry')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeSubject === 'chemistry'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Химия тажрыйбасы</span>
          </button>
          <button
            id="btn-lab-bio-tab"
            onClick={() => setActiveSubject('biology')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeSubject === 'biology'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span>Биология (Микроскоп)</span>
          </button>
        </div>
      </div>

      {/* 1. CHEMISTRY VIRTUAL LAB */}
      {activeSubject === 'chemistry' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                1-кадам: Эритмени тандаңыз
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(['hcl', 'naoh', 'water', 'vinegar'] as const).map((sol) => (
                  <button
                    key={sol}
                    id={`btn-solution-${sol}`}
                    onClick={() => setSelectedSolution(sol)}
                    className={`p-3 rounded-2xl text-left border transition-all text-xs cursor-pointer ${
                      selectedSolution === sol
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block truncate">{solutions[sol].nameKy}</span>
                    <span className="text-[10px] text-slate-500">{solutions[sol].type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                2-кадам: Индикаторду тамызыңыз
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'litmus', nameKy: 'Лакмус эритмеси' },
                  { id: 'phenolphthalein', nameKy: 'Фенолфталеин' },
                  { id: 'methyl-orange', nameKy: 'Метилоранж' },
                  { id: 'universal', nameKy: 'Универсал индикатор' }
                ].map((ind) => (
                  <button
                    key={ind.id}
                    id={`btn-indicator-${ind.id}`}
                    onClick={() => setSelectedIndicator(ind.id as any)}
                    className={`p-3 rounded-2xl text-left border transition-all text-xs cursor-pointer ${
                      selectedIndicator === ind.id
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{ind.nameKy}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Safety & Pedagogical Note */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Коопсуздук эрежеси (Практикантка):
              </span>
              <p className="text-[11px] leading-relaxed">
                Кислотаны сууга куюу керек, тескерисинче эмес («Сууга кислотаны куй, көзгө чачырабайт»). Реагенттердин даамын татууга тыюу салынат!
              </p>
            </div>
          </div>

          {/* Interactive Simulation Viewport */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Реакциянын жүрүшү жана pH өлчөмү
                  </h3>
                  <span className="text-xs text-slate-500">
                    {solutions[selectedSolution].formula} + {selectedIndicator}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs font-bold">
                    pH = {solutions[selectedSolution].ph}
                  </span>
                </div>
              </div>

              {/* 3D-like Test Tube Container */}
              <div className="py-6 flex flex-col items-center justify-center">
                <div className="relative w-28 h-64 border-4 border-slate-300 rounded-b-full bg-slate-50/60 p-1 flex flex-col justify-end overflow-hidden shadow-inner">
                  {/* Liquid inside test tube */}
                  <div
                    className={`w-full rounded-b-full transition-all duration-700 ${reaction.liquidColor} shadow-md flex items-center justify-center`}
                    style={{ height: '70%' }}
                  >
                    <div className="w-3 h-3 rounded-full bg-white/40 animate-ping" />
                  </div>

                  {/* Glass Reflection shine */}
                  <div className="absolute top-2 left-2 w-2 h-44 bg-white/30 rounded-full pointer-events-none" />
                </div>

                <div className="mt-4 text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                    Түстүн өзгөрүшү:
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {reaction.colorName}
                  </span>
                </div>
              </div>
            </div>

            {/* Scientific Explanation Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                <Info className="w-4 h-4 text-emerald-600" />
                Илимий түшүндүрмөсү (Окуучуларга айтып берүү үчүн):
              </span>
              <p className="text-xs leading-relaxed text-emerald-900">
                {reaction.reason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. BIOLOGY VIRTUAL MICROSCOPE */}
      {activeSubject === 'biology' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Microscope Controls */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                Микропрепаратты тандаңыз (Препараттар):
              </span>
              <div className="space-y-2">
                {(['onion', 'blood', 'bacteria', 'leaf'] as const).map((key) => (
                  <button
                    key={key}
                    id={`btn-specimen-${key}`}
                    onClick={() => setSelectedSpecimen(key)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all text-xs cursor-pointer ${
                      selectedSpecimen === key
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{specimens[key].titleKy}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Magnification Changer */}
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                Чоңойтуу даражасы (Объектив):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[10, 40, 100].map((z) => (
                  <button
                    key={z}
                    id={`btn-zoom-${z}`}
                    onClick={() => setZoomLevel(z)}
                    className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      zoomLevel === z
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {z}x
                  </button>
                ))}
              </div>
            </div>

            {/* PISA Logic Question for Students */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-indigo-900">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                PISA логикалык суроосу:
              </span>
              <p className="text-[11px] leading-relaxed text-indigo-900/90 font-medium">
                «{currentSpecimen.pisaQuestion}»
              </p>
            </div>
          </div>

          {/* Microscope Field of View (Circular Viewport) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {currentSpecimen.titleKy}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Окулярдык талаа • Чоңойтуусу: {zoomLevel * 10}x эсе
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{zoomLevel}x объектив</span>
                </div>
              </div>

              {/* Circular Eyepiece */}
              <div className="py-4 flex justify-center">
                <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-slate-800 bg-slate-950 p-2 shadow-2xl relative overflow-hidden flex items-center justify-center">
                  {/* Slide background simulation */}
                  <div
                    className={`w-full h-full rounded-full bg-gradient-to-br ${currentSpecimen.visualBg} flex items-center justify-center relative overflow-hidden transition-transform duration-500`}
                    style={{ transform: `scale(${zoomLevel === 10 ? 1 : zoomLevel === 40 ? 1.3 : 1.7})` }}
                  >
                    {/* Cellular pattern mesh */}
                    <div className="w-full h-full opacity-40 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Cellular Organelle structures */}
                    <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 p-6">
                      <div className="w-12 h-12 rounded-full bg-emerald-700/60 border-2 border-emerald-900 flex items-center justify-center shadow-lg">
                        <span className="text-[8px] font-bold text-white">Ядро</span>
                      </div>
                      <div className="w-16 h-10 rounded-2xl bg-teal-600/50 border border-teal-800 flex items-center justify-center shadow-md">
                        <span className="text-[8px] font-bold text-white">Вакуоль</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-800/70 border border-emerald-950 flex items-center justify-center shadow-md">
                        <span className="text-[7px] font-bold text-white">Ядро 2</span>
                      </div>
                    </div>
                  </div>

                  {/* Crosshairs & lens glare */}
                  <div className="absolute inset-0 pointer-events-none border border-slate-700/40 rounded-full" />
                  <div className="absolute top-4 left-6 w-16 h-8 bg-white/20 rounded-full rotate-45 blur-sm pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Specimen Description and Structures */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block text-xs">
                Көрүнүп турган органеллалар жана түзүлүштөр:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentSpecimen.structures.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-medium text-[11px]"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Trainee STEM Resource Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 text-white border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
            <Microscope className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-white">
                Мамлекеттик STEM Билим берүү порталы (stem.edu.gov.kg)
              </h4>
              <span className="text-[10px] bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 px-2 py-0.5 rounded-full font-bold">
                КР ББИМ
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              Практика өтөп жаткан студенттер үчүн кошумча 3D виртуалдык тажрыйбалар, физика, химия, биология симуляциялары жана STEM сабактарынын конспектилери.
            </p>
          </div>
        </div>

        <a
          id="btn-virtual-lab-stem-portal"
          href="https://stem.edu.gov.kg"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
        >
          <span>stem.edu.gov.kg сайтына өтүү</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
