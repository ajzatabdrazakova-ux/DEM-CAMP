import React, { useState } from 'react';
import {
  Presentation,
  Video,
  Download,
  Copy,
  Check,
  Play,
  Film,
  Sparkles,
  Layers
} from 'lucide-react';
import { Language } from '../../types';

interface PresentationsVideoViewProps {
  lang: Language;
}

export const PresentationsVideoView: React.FC<PresentationsVideoViewProps> = ({ lang }) => {
  const [filterType, setFilterType] = useState<'all' | 'presentation' | 'video'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mediaItems = [
    {
      id: 'media-1',
      type: 'presentation',
      titleKy: 'Интерактивдүү сабактын структурасы (1-11-класс)',
      categoryKy: 'Презентация шаблону',
      slidesCount: 16,
      format: 'PPTX / Google Slides',
      descriptionKy: 'Саламдашуудан рефлексияга чейинки даяр дизайн жана визуалдык макеттер.',
      accent: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'media-2',
      type: 'video',
      titleKy: 'Мастер-класс: «Окуучулардын 100% көңүлүн буруунун 5 ыкмасы»',
      categoryKy: 'Видео сабак',
      duration: '18:30 мин',
      format: 'Full HD Video',
      descriptionKy: 'ОшМПУнун тажрыйбалуу педагог-методистинин реалдуу класстагы практикалык сабагы.',
      accent: 'from-blue-600 to-indigo-700'
    },
    {
      id: 'media-3',
      type: 'presentation',
      titleKy: 'STEAM жана PISA тапшырмаларын слайдда чагылдыруу',
      categoryKy: 'Дидактикалык слайддар',
      slidesCount: 22,
      format: 'PPTX',
      descriptionKy: 'Графиктер, диаграммалар, логикалык сыноолор жана визуалдык инфографикалар.',
      accent: 'from-amber-500 to-orange-600'
    },
    {
      id: 'media-4',
      type: 'video',
      titleKy: 'Мектепке чейинки билим берүү: Кыймылдуу оюндар жана эртең мененки көнүгүү',
      categoryKy: 'Бала бакча видеосу',
      duration: '14:15 мин',
      format: 'Full HD Video',
      descriptionKy: 'Кичинекей балдар менен иштөөдө эмоцияны жана кыймыл-аракетти координациялоо.',
      accent: 'from-pink-500 to-rose-600'
    },
    {
      id: 'media-5',
      type: 'presentation',
      titleKy: 'Башталгыч класс: «Алиппе жана жомоктор дүйнөсү»',
      categoryKy: 'Анимациялык слайддар',
      slidesCount: 28,
      format: 'PPTX',
      descriptionKy: 'Түстүү иллюстрациялар, тамгалар жана шар окуу көнүгүүлөрү.',
      accent: 'from-teal-600 to-emerald-700'
    },
    {
      id: 'media-6',
      type: 'video',
      titleKy: 'Физика жана Химия лабораториясында коопсуздук эрежелери',
      categoryKy: 'Инструктаж видеосу',
      duration: '11:40 мин',
      format: 'Full HD Video',
      descriptionKy: 'Практиканттар жана мектеп окуучулары үчүн реактивдер менен иштөө эрежеси.',
      accent: 'from-purple-600 to-indigo-700'
    }
  ];

  const filteredMedia = mediaItems.filter((m) => {
    if (filterType === 'all') return true;
    return m.type === filterType;
  });

  const handleCopyLink = (id: string, title: string) => {
    navigator.clipboard.writeText(`МАТЕРИАЛ: ${title} (ОшМПУ Педагогикалык практика базасы)`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>Медиатека жана Дидактика</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Видео жана презентациялар
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Сабактарды интерактивдүү доскада өтүү үчүн даяр түстүү слайддар жана алдыңкы мугалимдердин видео сабактары.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Бардыгы
          </button>
          <button
            onClick={() => setFilterType('presentation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'presentation' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Презентациялар
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'video' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Видео сабактар
          </button>
        </div>
      </div>

      {/* Grid of Media Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMedia.map((item) => {
          const isVideo = item.type === 'video';

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Media preview banner */}
                <div
                  className={`w-full h-36 rounded-2xl bg-gradient-to-br ${item.accent} text-white flex items-center justify-center relative overflow-hidden mb-4 shadow-inner`}
                >
                  {isVideo ? (
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  ) : (
                    <Presentation className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
                  )}

                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-mono text-white">
                    {isVideo ? item.duration : `${item.slidesCount} Слайд`}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-100">
                    {item.categoryKy}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.format}</span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  {item.titleKy}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal mb-4">
                  {item.descriptionKy}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(item.id, item.titleKy)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Шилтеме көчүрүлдү' : isVideo ? 'Видео көрүү' : 'Презентацияны алуу'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
