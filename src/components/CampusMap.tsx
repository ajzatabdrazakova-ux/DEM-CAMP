import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Compass, 
  Clock, 
  Phone, 
  CheckCircle2, 
  Layers, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Building2, 
  BookOpen, 
  Coffee, 
  Home, 
  HeartPulse, 
  Trophy, 
  Sparkles, 
  MessageSquarePlus, 
  ArrowRight, 
  Footprints, 
  Info,
  Calendar,
  X,
  Share2,
  Accessibility,
  ExternalLink
} from 'lucide-react';
import { Language, CampusLocation, ActiveTab } from '../types';
import { campusLocations } from '../data/campusLocations';
import campusMapImg from '../assets/images/campus_map_isometric_1789402995511.jpg';

interface CampusMapProps {
  lang: Language;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickFeedback: () => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  lang,
  setActiveTab,
  onOpenQuickFeedback
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(campusLocations[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeFloor, setActiveFloor] = useState<number>(1);
  const [mapMode, setMapMode] = useState<'3d' | 'schematic' | 'google'>('3d');
  
  // Route Navigation state
  const [isRoutingMode, setIsRoutingMode] = useState<boolean>(false);
  const [routeFromId, setRouteFromId] = useState<string>(campusLocations[6].id); // default from Dormitory
  const [routeToId, setRouteToId] = useState<string>(campusLocations[0].id); // default to Main building
  const [routeActive, setRouteActive] = useState<boolean>(false);

  const categories = [
    { id: 'all', labelKy: 'Бардыгы', labelRu: 'Все', icon: Compass },
    { id: 'building', labelKy: 'Корпустар', labelRu: 'Корпуса', icon: Building2 },
    { id: 'library', labelKy: 'Китепкана', labelRu: 'Библиотека', icon: BookOpen },
    { id: 'food', labelKy: 'Ашкана & Кафе', labelRu: 'Питание', icon: Coffee },
    { id: 'dorm', labelKy: 'Жатакана', labelRu: 'Общежития', icon: Home },
    { id: 'health', labelKy: 'Медпункт & Психолог', labelRu: 'Медпункт', icon: HeartPulse },
    { id: 'sport', labelKy: 'Спорткомплекс', labelRu: 'Спорт', icon: Trophy },
    { id: 'hub', labelKy: 'DEM-CAMP Хаб', labelRu: 'Хаб диалога', icon: Sparkles }
  ];

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return campusLocations.filter(loc => {
      const matchCategory = selectedCategory === 'all' || loc.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchCategory;

      const name = (lang === 'ky' ? loc.nameKy : loc.nameRu).toLowerCase();
      const code = loc.code.toLowerCase();
      const desc = (lang === 'ky' ? loc.descriptionKy : loc.descriptionRu).toLowerCase();
      const features = (lang === 'ky' ? loc.featuresKy : loc.featuresRu).join(' ').toLowerCase();

      return matchCategory && (name.includes(query) || code.includes(query) || desc.includes(query) || features.includes(query));
    });
  }, [selectedCategory, searchQuery, lang]);

  const routeFrom = useMemo(() => campusLocations.find(l => l.id === routeFromId) || campusLocations[0], [routeFromId]);
  const routeTo = useMemo(() => campusLocations.find(l => l.id === routeToId) || campusLocations[1], [routeToId]);

  // Route calculation
  const routeStats = useMemo(() => {
    if (!routeFrom || !routeTo) return { dist: 250, time: 3 };
    const dx = routeTo.xPercent - routeFrom.xPercent;
    const dy = routeTo.yPercent - routeFrom.yPercent;
    const distNorm = Math.sqrt(dx * dx + dy * dy);
    const approxMeters = Math.round(distNorm * 6 + 40);
    const approxMinutes = Math.max(1, Math.round(approxMeters / 70));
    return { dist: approxMeters, time: approxMinutes };
  }, [routeFrom, routeTo]);

  const handleSelectLocation = (loc: CampusLocation) => {
    setSelectedLocation(loc);
    setActiveFloor(1);
    if (isRoutingMode) {
      setRouteToId(loc.id);
      setRouteActive(true);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'building': return Building2;
      case 'library': return BookOpen;
      case 'food': return Coffee;
      case 'dorm': return Home;
      case 'health': return HeartPulse;
      case 'sport': return Trophy;
      case 'hub': return Sparkles;
      default: return MapPin;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Banner with Innovation Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {lang === 'ky' ? 'Кошумча инновациялык функциялар • 1. Campus Map' : 'Инновационные функции • 1. Campus Map'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            {lang === 'ky' ? 'Интерактивдүү Кампус Картасы (3D)' : 'Интерактивная карта кампуса (3D)'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {lang === 'ky'
              ? 'Университеттин бардык аудиторияларын, окутуучулардын ачык саат кабинеттерин, китепкананы, ишеним кутуларын жана жатакананы оңой таап, түз маршрут куруңуз.'
              : 'Легко ориентируйтесь в университетском городке: находите аудитории, кабинеты открытых часов преподавателей, столовую, ящики доверия и стройте удобные маршруты.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              id="map-btn-route-toggle"
              onClick={() => {
                setIsRoutingMode(!isRoutingMode);
                setRouteActive(true);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isRoutingMode
                  ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/30'
                  : 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>{lang === 'ky' ? 'Маршрут куруу' : 'Построить маршрут'}</span>
            </button>

            <a
              id="map-btn-google-maps-link"
              href="https://maps.app.goo.gl/Bj7ke88AEYEiKcv67"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-slate-950" />
              <span>{lang === 'ky' ? 'Google Maps (ОшМПУ)' : 'Google Карты (ОшГПУ)'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-900" />
            </a>

            <button
              id="map-btn-trust-box"
              onClick={() => {
                const trustLoc = campusLocations.find(l => l.hasTrustBox);
                if (trustLoc) setSelectedLocation(trustLoc);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-cyan-300" />
              <span>{lang === 'ky' ? 'Ишеним кутуларын табуу (3 чекит)' : 'Где ящики доверия?'}</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Search & Category Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="map-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ky' 
                ? 'Аудитория, мугалимдин кабинети, деканат, китепкана же спорткомплекс издөө...' 
                : 'Поиск аудитории, кабинета преподавателя, деканата или общежития...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Map View Mode & Quick Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                id="btn-map-mode-3d"
                onClick={() => setMapMode('3d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mapMode === '3d' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {lang === 'ky' ? '3D Аэро' : '3D Аэро'}
              </button>
              <button
                id="btn-map-mode-schematic"
                onClick={() => setMapMode('schematic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mapMode === 'schematic' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {lang === 'ky' ? 'Схема' : 'Схема'}
              </button>
              <button
                id="btn-map-mode-google"
                onClick={() => setMapMode('google')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  mapMode === 'google' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps</span>
              </button>
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                id="btn-map-zoom-in"
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Жакындатуу"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                id="btn-map-zoom-out"
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Алыстатуу"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                id="btn-map-zoom-reset"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Баштапкы өлчөм"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-chip-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-slate-500'}`} />
                <span>{lang === 'ky' ? cat.labelKy : cat.labelRu}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Route Planner Bar (when Routing Mode is active) */}
      {isRoutingMode && (
        <div className="rounded-2xl bg-gradient-to-r from-cyan-50 via-sky-50 to-indigo-50 border border-cyan-200/80 p-4 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  A
                </span>
                <select
                  id="route-select-from"
                  value={routeFromId}
                  onChange={(e) => {
                    setRouteFromId(e.target.value);
                    setRouteActive(true);
                  }}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500"
                >
                  {campusLocations.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.code} • {lang === 'ky' ? l.nameKy : l.nameRu}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-cyan-600 font-bold text-xs flex items-center gap-1">
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  B
                </span>
                <select
                  id="route-select-to"
                  value={routeToId}
                  onChange={(e) => {
                    setRouteToId(e.target.value);
                    setRouteActive(true);
                  }}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500"
                >
                  {campusLocations.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.code} • {lang === 'ky' ? l.nameKy : l.nameRu}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Walking info pill */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-cyan-200 text-slate-800 text-xs shadow-xs">
                <Footprints className="w-4 h-4 text-cyan-600" />
                <span className="font-bold text-cyan-700">~{routeStats.time} {lang === 'ky' ? 'мүнөт жөө' : 'мин пешком'}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">~{routeStats.dist} {lang === 'ky' ? 'метр' : 'метров'}</span>
              </div>

              <button
                id="btn-close-route"
                onClick={() => {
                  setIsRoutingMode(false);
                  setRouteActive(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/60 rounded-lg cursor-pointer"
                title="Жабуу"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Stage: Interactive Map Canvas (Left) + Detail Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Map Viewer Container */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800/80 shadow-xl overflow-hidden relative min-h-[500px] flex flex-col">
          {/* Top Canvas Bar */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-slate-900/90 text-cyan-300 border border-slate-700/80 backdrop-blur-md text-xs font-semibold shadow-md">
              📍 {filteredLocations.length} {lang === 'ky' ? 'жай табылды' : 'локаций'}
            </span>
            {selectedLocation?.hasTrustBox && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md text-xs font-semibold shadow-md flex items-center gap-1">
                <MessageSquarePlus className="w-3 h-3" />
                <span>Ишеним кутусу #</span>
              </span>
            )}
          </div>

          {/* Interactive Map Surface */}
          {mapMode === 'google' ? (
            <div className="relative w-full h-[520px] sm:h-[580px] bg-slate-900 flex flex-col">
              <div className="p-3.5 sm:p-4 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm block text-white">
                      {lang === 'ky' ? 'Ош мамлекеттик педагогикалык университети (ОшМПУ)' : 'Ошский государственный педагогический университет'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'ky' ? 'Ош ш., Исанов көчөсү, 73 • 40.4927° N, 72.8292° E' : 'г. Ош, ул. Исанова, 73'}
                    </span>
                  </div>
                </div>
                <a
                  id="btn-google-maps-live-link"
                  href="https://maps.app.goo.gl/Bj7ke88AEYEiKcv67"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>{lang === 'ky' ? 'Google Картыдан ачуу' : 'Открыть в Google Картах'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="flex-1 w-full h-full relative">
                <iframe
                  title="Ош мамлекеттик педагогикалык университети Google Maps"
                  src="https://maps.google.com/maps?q=40.492723,72.829250&hl=ky&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          ) : (
          <div 
            className="relative w-full h-[520px] sm:h-[580px] overflow-hidden bg-slate-900 cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
            style={{ touchAction: 'none' }}
          >
            <div 
              className="relative w-full h-full transition-transform duration-300 ease-out origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Map Base Graphic */}
              {mapMode === '3d' ? (
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={campusMapImg} 
                    alt="Campus Map 3D" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter saturate-105 brightness-95"
                  />
                  {/* Gentle darkening overlay for pins contrast */}
                  <div className="absolute inset-0 bg-slate-950/25 pointer-events-none" />
                </div>
              ) : (
                /* Schematic Blueprint View */
                <div className="absolute inset-0 w-full h-full bg-slate-900 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
                  {/* Schematic Campus Paths SVG */}
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Ring road */}
                    <path d="M 15 50 Q 50 15 85 30 T 75 75 Q 45 85 15 50" fill="none" stroke="#334155" strokeWidth="4" />
                    {/* Internal Walkways */}
                    <line x1="49" y1="44" x2="29" y2="49" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="49" y1="44" x2="62" y2="37" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="49" y1="44" x2="43" y2="65" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="49" y1="44" x2="55" y2="56" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="62" y1="37" x2="82" y2="33" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="43" y1="65" x2="74" y2="63" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  </svg>
                </div>
              )}

              {/* Route Overlay Path SVG (when Routing is active) */}
              {routeActive && routeFrom && routeTo && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Curved Path */}
                  <path
                    d={`M ${routeFrom.xPercent} ${routeFrom.yPercent} Q ${(routeFrom.xPercent + routeTo.xPercent) / 2 + 5} ${(routeFrom.yPercent + routeTo.yPercent) / 2 - 8} ${routeTo.xPercent} ${routeTo.yPercent}`}
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className="animate-pulse"
                    filter="url(#glow)"
                  />

                  {/* Start / End Points */}
                  <circle cx={routeFrom.xPercent} cy={routeFrom.yPercent} r="2.5" fill="#10b981" />
                  <circle cx={routeTo.xPercent} cy={routeTo.yPercent} r="2.5" fill="#06b6d4" />
                </svg>
              )}

              {/* Interactive Location Markers (Pins) */}
              {filteredLocations.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                const isRouteStart = isRoutingMode && routeFromId === loc.id;
                const isRouteEnd = isRoutingMode && routeToId === loc.id;
                const Icon = getCategoryIcon(loc.category);

                return (
                  <div
                    key={loc.id}
                    id={`map-pin-${loc.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLocation(loc);
                    }}
                    style={{
                      left: `${loc.xPercent}%`,
                      top: `${loc.yPercent}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  >
                    {/* Ripple animation when selected */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />
                    )}

                    {/* Pin Pill Container */}
                    <div className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all transform group-hover:scale-115 shadow-xl ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/30 scale-110 z-30 font-black'
                        : isRouteStart
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-400/30 scale-105 z-30'
                        : isRouteEnd
                        ? 'bg-sky-500 text-white ring-4 ring-sky-400/30 scale-105 z-30'
                        : 'bg-slate-900/90 text-white border border-slate-600/80 backdrop-blur-md hover:border-cyan-400 hover:text-cyan-300'
                    }`}>
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-mono text-[11px]">{loc.code}</span>
                      {loc.hasTrustBox && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Ишеним кутусу" />
                      )}
                    </div>

                    {/* Floating Title Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block pointer-events-none whitespace-nowrap z-40">
                      <div className="bg-slate-950/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700 shadow-2xl">
                        {lang === 'ky' ? loc.nameKy : loc.nameRu}
                        {loc.hasTrustBox && (
                          <span className="block text-cyan-400 text-[10px] font-normal">
                            📮 DEM-CAMP Ишеним кутусу бар
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Map Legend */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>{lang === 'ky' ? 'Тандалган' : 'Выбран'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>{lang === 'ky' ? 'Ишеним кутусу' : 'Ящик доверия'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Accessibility className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'ky' ? 'Пандус / Лифт' : 'Доступная среда'}</span>
                </span>
              </div>
              <span className="text-slate-400 hidden sm:inline font-mono">
                {lang === 'ky' ? 'Каалаган чекитти басып көрүңүз' : 'Кликните на маркер для инфо'}
              </span>
            </div>
          </div>
          )}
        </div>

        {/* Right: Location Detail Sheet / Inspector */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6">
          {selectedLocation ? (
            <>
              {/* Header: Code & Category */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-100 text-cyan-800 text-xs font-black font-mono">
                    {selectedLocation.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {lang === 'ky' ? selectedLocation.categoryLabelKy : selectedLocation.categoryLabelRu}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {lang === 'ky' ? selectedLocation.nameKy : selectedLocation.nameRu}
                </h3>
              </div>

              {/* Working Hours & Phone */}
              <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span className="font-semibold">{selectedLocation.workingHours}</span>
                </div>

                {selectedLocation.phone && (
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono">{selectedLocation.phone}</span>
                  </div>
                )}

                {selectedLocation.accessibleForDisabled && (
                  <div className="flex items-center gap-2.5 text-emerald-700 font-medium">
                    <Accessibility className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{lang === 'ky' ? 'Мүмкүнчүлүгү чектелгендер үчүн ыңгайлуу (пандус/лифт)' : 'Оборудовано пандусами и лифтами'}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'ky' ? selectedLocation.descriptionKy : selectedLocation.descriptionRu}
              </p>

              {/* Trust Box Callout (if present) */}
              {selectedLocation.hasTrustBox && (
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
                    📮
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-amber-900 mb-0.5">
                      {lang === 'ky' ? 'DEM-CAMP Ишеним кутусу жайгашкан' : 'Здесь установлен «Ящик доверия»'}
                    </h4>
                    <p className="text-[11px] text-amber-800/80 mb-2 leading-tight">
                      {selectedLocation.trustBoxLocation}
                    </p>
                    <button
                      id="inspector-btn-trust-box"
                      onClick={() => setActiveTab('your-voice')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <MessageSquarePlus className="w-3 h-3" />
                      <span>{lang === 'ky' ? 'Анонимдүү сунуш жазуу' : 'Написать обращение'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Floor Navigator Tabs (if floors exist) */}
              {selectedLocation.floors && selectedLocation.floors.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{lang === 'ky' ? 'Кабаттар планы' : 'План этажей'}</span>
                    </span>
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                      {selectedLocation.floors.map(fl => (
                        <button
                          key={fl.floor}
                          id={`floor-tab-${fl.floor}`}
                          onClick={() => setActiveFloor(fl.floor)}
                          className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            activeFloor === fl.floor
                              ? 'bg-cyan-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {fl.floor}-{lang === 'ky' ? 'кабат' : 'эт'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active floor rooms detail */}
                  {(() => {
                    const currentFl = selectedLocation.floors?.find(f => f.floor === activeFloor);
                    if (!currentFl) return null;
                    return (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <p className="text-xs font-medium text-slate-700">
                          {lang === 'ky' ? currentFl.descriptionKy : currentFl.descriptionRu}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {currentFl.rooms.map((room, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-800"
                            >
                              {room}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Related Teacher Office Hours (if any) */}
              {selectedLocation.relatedOfficeHoursTeachers && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-900 block">
                      {lang === 'ky' ? 'Ачык сааттар кабинети бар:' : 'Кабинет открытых часов:'}
                    </span>
                    <span className="text-xs text-indigo-700 font-medium">
                      {selectedLocation.relatedOfficeHoursTeachers.join(', ')}
                    </span>
                  </div>
                  <button
                    id="inspector-btn-office-hours"
                    onClick={() => setActiveTab('office-hours')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shrink-0 cursor-pointer"
                  >
                    {lang === 'ky' ? 'Жазылуу' : 'Запись'}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  id="inspector-btn-route-here"
                  onClick={() => {
                    setIsRoutingMode(true);
                    setRouteToId(selectedLocation.id);
                    setRouteActive(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'ky' ? 'Бул жерге маршрут түзүү' : 'Построить маршрут сюда'}</span>
                </button>

                <a
                  id="inspector-btn-google-maps"
                  href="https://maps.app.goo.gl/Bj7ke88AEYEiKcv67"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ky' ? 'ОшМПУ Google Картыда (Исанов 73)' : 'ОшГПУ на Google Картах (Исанова 73)'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <MapPin className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">
                {lang === 'ky' ? 'Картадан каалаган имаратты тандаңыз' : 'Выберите объект на карте для просмотра'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
