import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Bot, 
  MapPin, 
  Sparkles,
  Heart,
  ChevronRight,
  School,
  Award,
  ExternalLink,
  Microscope
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { PracticeSubjectId } from '../data/practiceData';
import { PracticeHero } from './practice/PracticeHero';
import { PracticeSidebar, PracticeSectionId } from './practice/PracticeSidebar';
import { GradesView } from './practice/GradesView';
import { SubjectPageView } from './practice/SubjectPageView';
import { MethodologyView } from './practice/MethodologyView';
import { DocumentsView } from './practice/DocumentsView';
import { PresentationsVideoView } from './practice/PresentationsVideoView';
import { VirtualLabView } from './practice/VirtualLabView';
import { AiLessonAssistant } from './practice/AiLessonAssistant';
import { StudentFeedbackTemplate } from './StudentFeedbackTemplate';

interface PedagogicalPracticeProps {
  lang: Language;
  role: UserRole;
  onNavigateToMap?: () => void;
}

export const PedagogicalPractice: React.FC<PedagogicalPracticeProps> = ({
  lang,
  role,
  onNavigateToMap
}) => {
  // Navigation section
  const [activeSection, setActiveSection] = useState<PracticeSectionId>('subjects');

  // Deep linking between views (e.g., jump from grade to subject or from topic to AI assistant)
  const [selectedSubjectId, setSelectedSubjectId] = useState<PracticeSubjectId>('biology');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [aiPrefill, setAiPrefill] = useState<{
    subject: string;
    topic: string;
    grade: string;
  }>({
    subject: 'biology',
    topic: '',
    grade: 'grade-7'
  });

  const handleStartPractice = () => {
    setActiveSection('subjects');
  };

  const handleOpenAiAssistant = () => {
    setActiveSection('ai-assistant');
  };

  const handleSelectGrade = (gradeId: string) => {
    setGradeFilter(gradeId);
    setActiveSection('subjects');
  };

  const handleOpenAiForTopic = (subjectId: string, topicName: string, grade: string) => {
    setAiPrefill({
      subject: subjectId,
      topic: topicName,
      grade: grade
    });
    setActiveSection('ai-assistant');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumb / Platform Indicator */}
        <div className="flex items-center justify-between gap-3 text-xs mb-4">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <span className="text-emerald-800 font-bold flex items-center gap-1">
              <School className="w-4 h-4 text-emerald-700" />
              DEM Platform
            </span>
            <span>/</span>
            <span className="text-emerald-900 font-bold">Педагогикалык практика (Practice Hub)</span>
            <span>/</span>
            <span className="text-slate-600 capitalize">{activeSection}</span>
          </div>

          {onNavigateToMap && (
            <button
              onClick={onNavigateToMap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Университет картасы</span>
            </button>
          )}
        </div>

        {/* Hero Section */}
        <PracticeHero
          lang={lang}
          onStartPractice={handleStartPractice}
          onOpenAiAssistant={handleOpenAiAssistant}
        />

        {/* Main Hub Body with Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Practice Sidebar Navigation */}
          <PracticeSidebar
            lang={lang}
            activeSection={activeSection}
            onSelectSection={(sec) => setActiveSection(sec)}
            selectedSubjectName={selectedSubjectId}
          />

          {/* Dynamic Content View Area */}
          <main className="flex-1 min-w-0 w-full">
            {activeSection === 'grades' && (
              <GradesView
                lang={lang}
                onSelectGrade={handleSelectGrade}
              />
            )}

            {activeSection === 'subjects' && (
              <SubjectPageView
                lang={lang}
                initialSubjectId={selectedSubjectId}
                initialGradeFilter={gradeFilter}
                onOpenAiForTopic={handleOpenAiForTopic}
              />
            )}

            {activeSection === 'methodology' && (
              <MethodologyView lang={lang} />
            )}

            {activeSection === 'documents' && (
              <DocumentsView lang={lang} />
            )}

            {activeSection === 'media' && (
              <PresentationsVideoView lang={lang} />
            )}

            {activeSection === 'virtual-lab' && (
              <VirtualLabView lang={lang} />
            )}

            {activeSection === 'ai-assistant' && (
              <AiLessonAssistant
                lang={lang}
                prefillSubject={aiPrefill.subject}
                prefillTopic={aiPrefill.topic}
                prefillGrade={aiPrefill.grade}
              />
            )}

            {activeSection === 'student-feedback' && (
              <StudentFeedbackTemplate
                lang={lang}
                defaultCategory="Педагогикалык практика"
              />
            )}
          </main>
        </div>

        {/* Trainee Official State Portals: STEM & РИПК */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm uppercase tracking-wider text-slate-500">
              Практикант-студенттердин билимин өнүктүрүүчү расмий мамлекеттик порталдар
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: STEM Portal */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 text-white border border-cyan-500/40 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                      <Microscope className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <span className="font-extrabold text-base block text-white">КР Мамлекеттик STEM Порталы</span>
                      <span className="text-[11px] text-cyan-300/80">stem.edu.gov.kg • Инновациялык база</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                    STEM
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Мектепке практикага чыккан студенттер үчүн илим (Science), технология (Technology), инженерия (Engineering) жана математика (Math) боюнча симуляциялар, санарип лабораториялар жана сабак иштелмелери.
                </p>
              </div>

              <a
                id="btn-practice-stem-portal"
                href="https://stem.edu.gov.kg"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/25 group cursor-pointer"
              >
                <span>stem.edu.gov.kg сайтына өтүү</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Card 2: KAO PISA Portal */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-stone-950 text-white border border-amber-500/40 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <span className="font-extrabold text-base block text-white">КАО: PISA Сабаттуулук</span>
                      <span className="text-[11px] text-amber-300/80">kao.kg/pisa • КББ Академиясы</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                    PISA
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Окуучулардын функционалдык, математикалык, табигый-илимий жана окуу сабаттуулугун калыптандыруу боюнча улуттук үлгү тапшырмалар, баалоо критерийлери жана тесттик жыйнактар.
                </p>
              </div>

              <a
                id="btn-practice-kao-pisa"
                href="https://kao.kg/pisa/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/25 group cursor-pointer"
              >
                <span>kao.kg/pisa сайтына өтүү</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Card 3: RIPK Portal */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-700/50 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                      <Award className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="font-extrabold text-base block text-white">РИПК жана КДПИ Институту</span>
                      <span className="text-[11px] text-emerald-300/80">ripk.kg • Квалификация жогорулатуу</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                    КР ББИМ
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Практиканттар азыртан келечектеги педагогикалык ишмердүүлүккө даярданып, мамлекеттик билим берүү стандарттары, усулдук колдонмолор жана квалификация курстары менен таанышуусу үчүн расмий база.
                </p>
              </div>

              <a
                id="btn-practice-ripk-recommendation"
                href="https://ripk.kg"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/25 group cursor-pointer"
              >
                <span>ripk.kg сайты менен таанышуу</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* User-Requested Practice Hub Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>DEM Platform • Practice Hub</span>
          </div>
          <p className="text-sm font-semibold text-slate-700 italic">
            «Ар бир студентке ийгиликтүү практика үчүн жардамчы.»
          </p>
          <p className="text-xs text-slate-500">
            Ош мамлекеттик педагогикалык университетинин санариптик экосистемасы
          </p>
        </footer>
      </div>
    </div>
  );
};
