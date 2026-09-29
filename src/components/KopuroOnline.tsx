import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  MessageSquare, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ThumbsUp, 
  User, 
  HelpCircle,
  Copy,
  Check,
  Bot
} from 'lucide-react';
import { Language, OnlineQuestion, UserRole } from '../types';
import { translations } from '../locales/translations';

interface KopuroOnlineProps {
  lang: Language;
  role: UserRole;
  questions: OnlineQuestion[];
  onAskQuestion: (question: string, isAnonymous: boolean, authorName: string, category: string) => void;
  onAnswerQuestion: (questionId: string, answerText: string, authorRole: 'teacher' | 'dean_office' | 'student_mentor') => void;
  onLikeQuestion: (questionId: string) => void;
}

export const KopuroOnline: React.FC<KopuroOnlineProps> = ({
  lang,
  role,
  questions,
  onAskQuestion,
  onAnswerQuestion,
  onLikeQuestion
}) => {
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  // Question form
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState('academic');

  // Answer form state
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerInputText, setAnswerInputText] = useState('');

  // AI Helper State
  const [aiDraftInput, setAiDraftInput] = useState('');
  const [aiGeneratedOutput, setAiGeneratedOutput] = useState('');
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredQuestions = questions.filter(q => {
    const textMatch = (lang === 'ky' ? q.questionKy : q.questionRu).toLowerCase().includes(searchTerm.toLowerCase());
    const catMatch = selectedCat === 'all' || q.category === selectedCat;
    return textMatch && catMatch;
  });

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    onAskQuestion(
      newQuestionText.trim(),
      isAnon,
      isAnon ? '' : (authorName.trim() || (lang === 'ky' ? 'Студент' : 'Студент')),
      category
    );

    setNewQuestionText('');
    setAuthorName('');
    setShowAskModal(false);
  };

  const handleAnswerSubmit = (qId: string) => {
    if (!answerInputText.trim()) return;

    onAnswerQuestion(
      qId,
      answerInputText.trim(),
      role === 'teacher' ? 'teacher' : 'student_mentor'
    );

    setAnswerInputText('');
    setAnsweringQuestionId(null);
  };

  // AI Formulation generator
  const handleGenerateAiMessage = () => {
    if (!aiDraftInput.trim()) return;
    setAiIsLoading(true);

    setTimeout(() => {
      let generated = '';
      if (lang === 'ky') {
        generated = `Саламатсызбы, урматтуу [Окутуучунун Аты-Жөнү] агай / эжей!

Менин атым [Сиздин Атыңыз], [Группаңыздын аты / 2-курс] тобунун студенти болом.

Сизге кайрылуумдун себеби: ${aiDraftInput.trim()}

Бул маселени сиздин ачык кабыл алуу саатыңызда («Ачык саатта») же сизге ыңгайлуу болгон убакытта кыскача талкуулап алууга уруксат бересизби? Сиздин баалуу кеңешиңиз мен үчүн өтө маанилүү.

Урматым менен,
[Сиздин Атыңыз], тел: [Номериңиз]`;
      } else {
        generated = `Здравствуйте, уважаемый(-ая) [Имя Отчество преподавателя]!

Меня зовут [Ваше Имя], студент(-ка) группы [Номер группы / Курс].

Обращаюсь к Вам со следующим вопросом: ${aiDraftInput.trim()}

Подскажите, пожалуйста, будет ли у Вас возможность уделить несколько минут во время «Открытых часов» или в удобное для Вас время, чтобы прояснить этот момент? 

Буду очень благодарен(-на) за обратную связь и совет.

С уважением,
[Ваше Имя], контакты: [Ваш телефон/почта]`;
      }

      setAiGeneratedOutput(generated);
      setAiIsLoading(false);
    }, 600);
  };

  const handleCopyAiOutput = () => {
    navigator.clipboard.writeText(aiGeneratedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Globe className="w-3.5 h-3.5 text-sky-200" />
            {t.online.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {t.online.title}
          </h2>
          <p className="text-sm sm:text-base text-sky-100 font-normal leading-relaxed">
            {t.online.subtitle}
          </p>
        </div>
      </div>

      {/* AI Polite Advisor Tool Section */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-sky-50/50 to-white rounded-3xl p-6 border border-sky-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.online.aiHelperTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.online.aiHelperDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          <div>
            <textarea
              rows={4}
              value={aiDraftInput}
              onChange={(e) => setAiDraftInput(e.target.value)}
              placeholder={t.online.aiInputPlaceholder}
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-sky-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none shadow-xs"
            />
            <button
              id="btn-generate-ai-text"
              onClick={handleGenerateAiMessage}
              disabled={aiIsLoading || !aiDraftInput.trim()}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiIsLoading ? (lang === 'ky' ? 'Түзүлүүдө...' : 'Генерация...') : t.online.aiGenerateBtn}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-sky-200 relative flex flex-col justify-between shadow-xs">
            {aiGeneratedOutput ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wide">
                      {lang === 'ky' ? 'Даяр сылык билдирүү' : 'Готовый текст обращения'}
                    </span>
                    <button
                      onClick={handleCopyAiOutput}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-700 hover:text-cyan-900 font-semibold"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? (lang === 'ky' ? 'Көчүрүлдү!' : 'Скопировано!') : (lang === 'ky' ? 'Көчүрүп алуу' : 'Копировать')}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {aiGeneratedOutput}
                  </pre>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic">
                  {lang === 'ky' ? '* [Кашаанын] ичиндеги маалыматтарды өзүңүздүкү менен алмаштырып, жөнөтүңүз.' : '* Замените данные в [скобках] на свои и отправляйте в почту или мессенджер.'}
                </p>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-1">
                <Sparkles className="w-6 h-6 text-sky-300" />
                <span className="text-xs font-medium">
                  {lang === 'ky' ? 'Сол жактагы талаага оюн жазып, баскычты басыңыз' : 'Опишите своими словами слева, и AI составит идеальный текст'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Questions Search and Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.online.searchQuestions}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white"
          >
            <option value="all">{t.online.allCategories}</option>
            <option value="academic">{t.categories.academic}</option>
            <option value="ethics">{t.categories.ethics}</option>
            <option value="infrastructure">{t.categories.infrastructure}</option>
          </select>
        </div>

        <button
          id="btn-ask-online-q"
          onClick={() => setShowAskModal(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-all shrink-0 active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.online.askQuestionBtn}</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-sky-300 transition-all"
          >
            {/* Question Author & Date */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-800">
                  {q.isAnonymous ? (lang === 'ky' ? 'Анонимдүү студент' : 'Анонимный студент') : q.authorName}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{q.authorFaculty}</span>
              </div>
              <span className="text-[10px] text-slate-400">{q.date}</span>
            </div>

            {/* Question Body */}
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {lang === 'ky' ? q.questionKy : q.questionRu}
            </h3>

            {/* Verified Answers List */}
            {q.answers.length > 0 && (
              <div className="space-y-3 pt-2">
                {q.answers.map((ans) => (
                  <div
                    key={ans.id}
                    className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 space-y-1.5 text-xs text-sky-950"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="font-bold text-slate-900">{ans.authorName}</span>
                        {ans.isVerified && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-200 text-sky-800 font-bold">
                            {t.online.verifiedAnswer}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{ans.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed pt-1">
                      {lang === 'ky' ? ans.answerKy : ans.answerRu}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Footer with upvotes and answer trigger */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => onLikeQuestion(q.id)}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-sky-600 font-bold transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{q.likes}</span>
              </button>

              <div>
                {answeringQuestionId === q.id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={answerInputText}
                      onChange={(e) => setAnswerInputText(e.target.value)}
                      placeholder={lang === 'ky' ? 'Жообуңузду жазыңыз...' : 'Напишите ответ...'}
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 w-64"
                    />
                    <button
                      onClick={() => handleAnswerSubmit(q.id)}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold text-xs"
                    >
                      {lang === 'ky' ? 'Жөнөтүү' : 'Ответить'}
                    </button>
                    <button
                      onClick={() => setAnsweringQuestionId(null)}
                      className="text-xs text-slate-400"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAnsweringQuestionId(q.id)}
                    className="text-sky-700 font-bold hover:underline"
                  >
                    {lang === 'ky' ? '+ Жооп кошуу' : '+ Добавить ответ'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              {t.online.askQuestionBtn}
            </h3>

            <form onSubmit={handleAskSubmit} className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-700">
                  {lang === 'ky' ? 'Анонимдүү узатуу' : 'Задать анонимно'}
                </span>
                <input
                  type="checkbox"
                  checked={isAnon}
                  onChange={(e) => setIsAnon(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600"
                />
              </div>

              {!isAnon && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ky' ? 'Аты-жөнүңүз' : 'Ваше имя'}
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={lang === 'ky' ? 'Мисалы: Айдар (2-курс)' : 'Например: Айдар (2 курс)'}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'ky' ? 'Категория' : 'Категория'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="academic">{t.categories.academic}</option>
                  <option value="ethics">{t.categories.ethics}</option>
                  <option value="infrastructure">{t.categories.infrastructure}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'ky' ? 'Суроонун мазмуну' : 'Суть вопроса'}
                </label>
                <textarea
                  rows={4}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder={lang === 'ky' ? 'Сурооңузду так жана түшүнүктүү жазыңыз...' : 'Опишите ваш вопрос...'}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500"
                >
                  {lang === 'ky' ? 'Жокко чыгаруу' : 'Отмена'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 shadow-xs"
                >
                  {lang === 'ky' ? 'Жарыялоо' : 'Опубликовать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
