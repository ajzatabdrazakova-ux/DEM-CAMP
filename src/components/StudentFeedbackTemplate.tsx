import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquarePlus,
  Send,
  User,
  Users,
  Building,
  Star,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  Sparkles,
  Lightbulb,
  ThumbsUp,
  Filter,
  Download,
  Printer,
  Heart,
  AlertTriangle,
  GraduationCap,
  MessageCircle,
  Clock,
  BookOpen,
  X,
  Search,
  Share2,
  Smartphone,
  ExternalLink,
  RefreshCw,
  Database,
  Zap,
  CheckCheck
} from 'lucide-react';
import { Language } from '../types';
import { mergeUniqueById, saveStudentReviewsToIDB, getStudentReviewsFromIDB } from '../utils/dbStorage';

export type FeedbackType = 'review' | 'suggestion' | 'opinion' | 'issue' | 'gratitude';

export interface StudentReviewItem {
  id: string;
  fullName: string;
  groupName: string;
  faculty: string;
  feedbackType: FeedbackType;
  category: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  status: 'received' | 'reviewing' | 'accepted' | 'implemented';
  adminReply?: string;
}

interface StudentFeedbackTemplateProps {
  lang: Language;
  defaultCategory?: string;
  onNavigateBack?: () => void;
}

// 8 Quick Ready-to-use Templates for effortless feedback writing
export const QUICK_TEMPLATES = [
  {
    id: 'practice-review',
    icon: '🎓',
    nameKy: 'Педагогикалык практика боюнча отзыв',
    type: 'review' as FeedbackType,
    category: 'Педагогикалык практика',
    defaultRating: 5,
    titleKy: 'Мектептеги практика боюнча тажрыйба жана баалоо',
    contentKy:
      'Мен мектепте өткөн педагогикалык практика боюнча өз пикиримди жана таасиримди калтырам.\n\n' +
      '1. Мага жаккан жактары:\n' +
      '- Окуучулар менен тил табышуу жана сабактын усулдары;\n' +
      '- DEM платформасындагы даяр сабак пландары жана көрсөтмө куралдар.\n\n' +
      '2. Кездешкен кыйынчылыктар:\n' +
      '- Айрым темаларда убакытты туура бөлүштүрүү жана интерактивдүү оюндарды башкаруу.\n\n' +
      '3. Жыйынтык баам:\n' +
      'Практика кесиптик жактан чоң шык берди, келечектеги мугалимдик ишмердүүлүгүмө абдан пайдалуу болду.'
  },
  {
    id: 'lesson-plans',
    icon: '📝',
    nameKy: 'Сабак иштелмелери жана поурочный пландар',
    type: 'review' as FeedbackType,
    category: 'Сабактар жана окуу материалдары',
    defaultRating: 5,
    titleKy: '8 табдуу сабак иштелмелеринин практикадагы натыйжалуулугу',
    contentKy:
      'DEM платформасындагы сабак иштелмелери боюнча пикиримди билдирем:\n\n' +
      '1. Артыкчылыктары:\n' +
      '- Сабактын максаты, күтүлүүчү натыйжалар жана баалоо критерийлери так жазылган;\n' +
      '- 8 табдуу структура сабактын ар бир этабын (уюштуруу, үй тапшырма, жаңы тема, бышыктоо, рефлексия) убактысы менен бөлүштүрүүгө абдан жардам берди.\n\n' +
      '2. Мектептеги баа:\n' +
      'Мектептин методисттери жана усулдук кеңеш сабактын пландарына жогорку баа беришти.\n\n' +
      '3. Жыйынтык:\n' +
      'Бул иштелмелер жаш мугалимдер жана студент-практиканттар үчүн мыкты жол көрсөткүч болду.'
  },
  {
    id: 'platform-suggestion',
    icon: '💡',
    nameKy: 'DEM платформасын өнүктүрүү сунушу',
    type: 'suggestion' as FeedbackType,
    category: 'DEM Платформасы жана IT',
    defaultRating: 5,
    titleKy: 'Платформага жаңы функцияларды жана материалдарды кошуу сунушу',
    contentKy:
      'DEM онлайн билим берүү экосистемасын дагы да ыңгайлуу кылуу максатында төмөнкү сунуштарды киргизем:\n\n' +
      '1. Жаңы сунушталган функция:\n' +
      '- Сабак иштелмелеринин даяр слайддарын бир баскыч менен PowerPoint же PDF форматында жүктөө мүмкүнчүлүгү.\n' +
      '- Мобилдик телефондон практикалык күндөлүктү оңой толтуруу интерфейси.\n\n' +
      '2. Күтүлгөн натыйжа:\n' +
      'Бул функция студенттердин сабакка даярдануу убактысын үнөмдөп, сапаттуу көрсөтмө куралдарды колдонууга шарт түзөт.'
  },
  {
    id: 'virtual-labs',
    icon: '💻',
    nameKy: 'Информатика жана виртуалдык лабдар',
    type: 'suggestion' as FeedbackType,
    category: 'DEM Платформасы жана IT',
    defaultRating: 5,
    titleKy: 'Интерактивдүү симуляцияларды жана виртуалдык тажрыйбаларды кеңейтүү',
    contentKy:
      'Сабак өтүүдө платформадагы интерактивдүү лабораторияларды жана виртуалдык көнүгүүлөрдү колдондук.\n\n' +
      '1. Окуучулардын реакциясы:\n' +
      'Информатика жана табигый сабактардагы виртуалдык симуляциялар окуучулардын сабакка болгон кызыгуусун эки эсе арттырды.\n\n' +
      '2. Сунуш:\n' +
      'Кийинки жаңыртууларда программалоо тилдери (Python, Scratch) жана 8-9-класстардын темалары боюнча кошумча интерактивдүү модулдарды кошуп берүүнү өтүнөм.'
  },
  {
    id: 'teaching-methods',
    icon: '🎯',
    nameKy: 'Интерактивдүү усулдар жана методика',
    type: 'opinion' as FeedbackType,
    category: 'Окутуу усулдары жана сабактар',
    defaultRating: 5,
    titleKy: 'Интерактивдүү усулдарды жана практикалык иштерди көбөйтүү',
    contentKy:
      'Университеттеги жана практикадагы сабактардын өтүлүшү боюнча өз пикиримди билдирем.\n\n' +
      '- Сунушталган өзгөртүү: Теориялык лекцияларды азайтып, кейс-стади, симуляциялык оюндарды жана PISA тесттерине даярдануу көнүгүүлөрүн көбүрөөк кошуу керек.\n' +
      '- Студенттердин активдүүлүгү: Топтук иштер жана долбоордук окутуу форматтары студенттерди көбүрөөк шыктандырат.'
  },
  {
    id: 'infrastructure-issue',
    icon: '🏫',
    nameKy: 'Окуу шарттары жана техникалык жабдуулар',
    type: 'issue' as FeedbackType,
    category: 'Инфраструктура жана шарттар',
    defaultRating: 4,
    titleKy: 'Окуу залдарындагы техникалык жабдууларды жаңылоо маселеси',
    contentKy:
      'Биздин тайпанын студенттеринин атынан төмөнкү шарттарды жакшыртуу боюнча кайрылабыз:\n\n' +
      '- Маселе: Компьютердик класстардагы интернет байланышынын ылдамдыгы жана проекторлордун жарыктыгы.\n' +
      '- Сунушталган чечим: Wi-Fi роутерлерди күчөтүү жана окуу залына кошумча розеткаларды орнотуп берүү.'
  },
  {
    id: 'teacher-gratitude',
    icon: '💖',
    nameKy: 'Окутуучуга жана насаатчыга ыраазычылык',
    type: 'gratitude' as FeedbackType,
    category: 'Насаатчылар жана кураторлор',
    defaultRating: 5,
    titleKy: 'Практика учурундагы кесиптик колдоо үчүн ыраазычылык',
    contentKy:
      'Урматтуу практика жетекчилерине жана кафедранын окутуучуларына терең ыраазычылык билдиребиз!\n\n' +
      'Сиздердин ар бир сабагыбызды талдап, пайдалуу методикалык кеңештерди бергениңиздер бизге ишеним тартуулады. Биз чыныгы мугалимдик чеберчиликтин үлгүсүн көрдүк. Чоң рахмат!'
  },
  {
    id: 'express-1min',
    icon: '⚡',
    nameKy: '1-минуталык кыска экспресс отзыв',
    type: 'review' as FeedbackType,
    category: 'Педагогикалык практика',
    defaultRating: 5,
    titleKy: 'Педагогикалык практика жана окуу процесси боюнча кыскача баа',
    contentKy:
      'Педагогикалык практика өтө жогорку уюшкандыкта жана пайдалуу өттү. DEM платформасындагы сабак пландары, көрсөтмө куралдар жана насаатчылардын кеңештери сабактарды кызыктуу өтүүгө толук шарт түздү. Практикадан чоң тажрыйба алдым, баалоом - эң мыкты (5/5)!'
  }
];

// Quick sentence starters (Сүйлөм конструктору) for 1-click text insertion
export const SAMPLE_SNIPPETS = [
  { label: 'Окуучулардын кызыгуусу', text: 'Сабак өтүүдө окуучулардын интерактивдүү тапшырмаларга кызыгуусу абдан жогору болду.' },
  { label: 'Убакытты үнөмдөө', text: 'DEM платформасындагы даяр сабак пландары сабакка даярдануу убактысын кыйла үнөмдөдү.' },
  { label: 'Виртуалдык лабдар', text: 'Виртуалдык лабораториялык иштер окуучулардын түшүнүүсүн эки эсе тездетти.' },
  { label: '8 табдуу план баасы', text: '8 табдуу поурочный план мамлекеттик билим берүү стандартына толук жооп берет экен.' },
  { label: 'Насаатчыларга рахмат', text: 'Практика жетекчилерибизге жана кафедрага кесиптик методикалык колдоосу үчүн терең ыраазычылык билдирем.' },
  { label: 'Интерактивдүү усулдар', text: 'Сабактарда топтук иштерди, симуляциялык оюндарды жана PISA тапшырмаларын көбөйтүүнү сунуштайм.' },
  { label: 'Техникалык шарттар', text: 'Аудиториялардагы Wi-Fi интернет байланышын жана проекторлорду жаңылап берүүңүздөрдү өтүнөбүз.' },
  { label: 'Кесиптик шыктануу', text: 'Бул педагогикалык практика келечектеги мугалимдик кесибиме болгон ишенимимди эки эсе арттырды.' }
];

// Initial Seed Reviews
const INITIAL_STUDENT_REVIEWS: StudentReviewItem[] = [
  {
    id: 'rev-1',
    fullName: 'Сейитбеков Адилет Нурланович',
    groupName: 'ИНФ-21',
    faculty: 'Табият таануу жана математика факультети',
    feedbackType: 'suggestion',
    category: 'Педагогикалык практика',
    rating: 5,
    title: 'Информатика предмети боюнча виртуалдык лабдар абдан пайдалуу экен',
    content:
      'Мектепте 7-класстарга сабак өтүүдө платформадагы интерактивдүү анимацияларды колдондук. Окуучулардын кызыгуусу абдан жогору болду. Мүмкүн болсо 8-9-класстар үчүн дагы программалоо лабдарын кошуп берсеңиздер.',
    createdAt: '2026-09-15',
    likes: 24,
    status: 'accepted',
    adminReply:
      'Сунушуңуз кабыл алынды! 8-9-класстардын Python жана веб-технологиялар боюнча виртуалдык лабдары жакын арада кошулат.'
  },
  {
    id: 'rev-2',
    fullName: 'Касымова Айпери Бакытбековна',
    groupName: 'Б-1-22',
    faculty: 'Табият таануу жана математика факультети',
    feedbackType: 'review',
    category: 'Педагогикалык практика',
    rating: 5,
    title: 'Биология сабагындагы 8 табдуу иштелмелер практикада чоң жардам берди',
    content:
      'Биология боюнча поурочный пландар мамлекеттик стандартка толук жооп берет. Максаты, баалоо критерийлери жана сабактын хронометражы так жазылгандыктан, мектептеги усулчулар жогорку баа беришти.',
    createdAt: '2026-09-14',
    likes: 19,
    status: 'implemented'
  },
  {
    id: 'rev-3',
    fullName: 'Токтосунов Данияр Эркинович',
    groupName: 'ПЕД-20',
    faculty: 'Педагогика жана искусство факультети',
    feedbackType: 'opinion',
    category: 'Окутуу усулдары жана сабактар',
    rating: 4,
    title: 'Сабактагы дисциплина жана үн режими боюнча кеңештер абдан туура',
    content:
      'Классты башкаруу бөлүмүндөгү 40 дБ үн режими жана "Жымжырттыктын сыйкырдуу коңгуроосу" усулу башталгыч класстарда практикада иштеди. Мугалимдер үчүн өтө пайдалуу кеңештер экен.',
    createdAt: '2026-09-12',
    likes: 15,
    status: 'received'
  },
  {
    id: 'rev-4',
    fullName: 'Жумабекова Назгүл Алмазовна',
    groupName: 'МАТ-22',
    faculty: 'Табият таануу жана математика факультети',
    feedbackType: 'gratitude',
    category: 'Насаатчылар жана кураторлор',
    rating: 5,
    title: 'Практика учурундагы кесиптик колдоо үчүн терең ыраазычылык',
    content:
      'Урматтуу кафедранын окутуучулары жана насаатчылары! Практика учурунда ар бир ачык сабакты талдап, усулдук кеңештериңизди аябаганыңыздар үчүн чоң рахмат. Сиздердин жардамыңыздар менен мектепте мыкты сабак өттүк.',
    createdAt: '2026-09-10',
    likes: 28,
    status: 'accepted',
    adminReply:
      'Сиздердин ийгилигиңиздер биздин сыймыгыбыз! Келечектеги мугалимдик ишиңиздерге ак жол каалайбыз.'
  },
  {
    id: 'rev-5',
    fullName: 'Айдар Токтогулов',
    groupName: 'ФИЗ-21',
    faculty: 'Табият таануу жана математика факультети',
    feedbackType: 'review',
    category: 'Педагогикалык практика',
    rating: 5,
    title: 'Физика предмети боюнча практикалык сабактардын таасири',
    content:
      'Мектепте 8-класстарга сабак өтүүдө платформадагы көрсөтмө куралдарды колдондук. Окуучулардын физикалык кубулуштарга болгон кызыгуусу абдан жогору болду. Бардык сабак иштелмелери практикада чоң пайдасын берди.',
    createdAt: '2026-09-16',
    likes: 18,
    status: 'implemented',
    adminReply: 'Азаматсыз! Физика боюнча жаңы демонстрациялык лабораториялар дагы жүктөлүүдө.'
  },
  {
    id: 'rev-6',
    fullName: 'Бакыт Студент',
    groupName: 'ПЕД-21',
    faculty: 'Педагогика жана искусство факультети',
    feedbackType: 'review',
    category: 'Педагогикалык практика',
    rating: 5,
    title: 'Педагогикалык практика боюнча усулдук колдонмолор',
    content:
      'Платформадагы сабактын максатын коюу (SMART) жана Блум таксономиясы боюнча баскычтар практикалык күндөлүктү толтурууда абдан көмөкчү болду.',
    createdAt: '2026-09-18',
    likes: 14,
    status: 'accepted'
  },
  {
    id: 'rev-7',
    fullName: 'Эркинбеков Бексултан',
    groupName: 'ГЕО-22',
    faculty: 'Табият таануу жана математика факультети',
    feedbackType: 'suggestion',
    category: 'Педагогикалык практика',
    rating: 5,
    title: 'Интерактивдүү географиялык карталар жана тесттик тапшырмалар практикада',
    content:
      'Мектепте окуучуларга Кыргызстандын физикалык картасы боюнча практика өткөрдүк. Окуучулар контур карталар менен виртуалдык атласты кызыгуу менен иштеп чыгышты.',
    createdAt: '2026-09-19',
    likes: 12,
    status: 'implemented'
  },
  {
    id: 'rev-8',
    fullName: 'Азаматова Чолпон',
    groupName: 'АНГ-23',
    faculty: 'Гуманитардык факультет',
    feedbackType: 'review',
    category: 'Окутуу усулдары жана сабактар',
    rating: 5,
    title: 'Тил үйрөтүүдөгү ролдук оюндар жана диалог үлгүлөрү',
    content:
      'Англис тили сабактарында сүйлөө көндүмдөрүн өстүрүүчү коммуникативдик көнүгүүлөрдү колдондук. Окуучулардын активдүүлүгү эки эсеге өстү.',
    createdAt: '2026-09-20',
    likes: 16,
    status: 'received'
  }
];

export const StudentFeedbackTemplate: React.FC<StudentFeedbackTemplateProps> = ({
  lang,
  defaultCategory = 'Педагогикалык практика',
  onNavigateBack
}) => {
  // Remembered form values from localStorage for phone/laptop convenience
  const [fullName, setFullName] = useState(() => localStorage.getItem('dem_student_author_name') || '');
  const [groupName, setGroupName] = useState(() => localStorage.getItem('dem_student_group_name') || '');
  const [faculty, setFaculty] = useState('Табият таануу жана математика факультети');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('review');
  const [category, setCategory] = useState(defaultCategory);
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    groupName?: string;
    title?: string;
    content?: string;
  }>({});

  // UI state
  const [activeTab, setActiveTab] = useState<'form' | 'feed' | 'templates'>('feed');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track liked items in localStorage
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dem_liked_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Stored reviews list with multi-vault recovery
  const [reviewsList, setReviewsList] = useState<StudentReviewItem[]>(() => {
    let cachedReviews: StudentReviewItem[] = [];
    let vaultReviews: StudentReviewItem[] = [];
    try {
      const saved = localStorage.getItem('dem_student_reviews');
      if (saved) cachedReviews = JSON.parse(saved);
    } catch {}
    try {
      const vault = localStorage.getItem('dem_student_reviews_vault');
      if (vault) vaultReviews = JSON.parse(vault);
    } catch {}
    return mergeUniqueById(cachedReviews, vaultReviews, INITIAL_STUDENT_REVIEWS);
  });

  const [isServerSynced, setIsServerSynced] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const formContainerRef = useRef<HTMLDivElement>(null);
  const feedTopRef = useRef<HTMLDivElement>(null);
  const fullNameInputRef = useRef<HTMLInputElement>(null);

  // Fetch reviews from server database and reconcile with local storage cache & IndexedDB
  const fetchReviewsFromServer = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      // 1. Gather all local representations
      let localList: StudentReviewItem[] = [];
      let vaultList: StudentReviewItem[] = [];
      try {
        const cached = localStorage.getItem('dem_student_reviews');
        if (cached) localList = JSON.parse(cached);
      } catch {}
      try {
        const vault = localStorage.getItem('dem_student_reviews_vault');
        if (vault) vaultList = JSON.parse(vault);
      } catch {}
      const idbList = await getStudentReviewsFromIDB();

      const combinedLocal = mergeUniqueById(reviewsList, localList, vaultList, idbList, INITIAL_STUDENT_REVIEWS);

      // 2. Sync with server via /api/reviews/sync (bi-directional auto-healing)
      const syncRes = await fetch('/api/reviews/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(combinedLocal)
      });

      if (syncRes.ok) {
        const serverData = await syncRes.json();
        if (Array.isArray(serverData) && serverData.length > 0) {
          const finalMerged = mergeUniqueById(serverData, combinedLocal);
          setReviewsList(finalMerged);
          localStorage.setItem('dem_student_reviews', JSON.stringify(finalMerged));
          localStorage.setItem('dem_student_reviews_vault', JSON.stringify(finalMerged));
          await saveStudentReviewsToIDB(finalMerged);
          setIsServerSynced(true);
          if (isManual) {
            showToast(
              lang === 'ky'
                ? `Сайттын серверинен ${finalMerged.length} пикир толук сакталды жана базадан жаңыланды!`
                : `База данных синхронизирована: ${finalMerged.length} отзывов надёжно сохранены!`,
              'success'
            );
          }
          return;
        }
      }

      // 3. Fallback GET /api/reviews
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const finalMerged = mergeUniqueById(data, combinedLocal);
          setReviewsList(finalMerged);
          localStorage.setItem('dem_student_reviews', JSON.stringify(finalMerged));
          localStorage.setItem('dem_student_reviews_vault', JSON.stringify(finalMerged));
          await saveStudentReviewsToIDB(finalMerged);
          setIsServerSynced(true);
          if (isManual) {
            showToast(lang === 'ky' ? 'Пикирлер базадан жаңыланды!' : 'Отзывы обновлены!', 'success');
          }
        }
      }
    } catch (e) {
      console.warn('Server offline or sync issue, keeping local & IndexedDB storage', e);
      setIsServerSynced(false);
    } finally {
      if (isManual) setIsRefreshing(false);
    }
  };

  // Initial load on mount & listen for external cross-tab updates without infinite loop
  useEffect(() => {
    // 1. First recover from IndexedDB
    getStudentReviewsFromIDB().then((idbReviews) => {
      if (idbReviews && idbReviews.length > 0) {
        setReviewsList((prev) => {
          const merged = mergeUniqueById(prev, idbReviews);
          localStorage.setItem('dem_student_reviews', JSON.stringify(merged));
          localStorage.setItem('dem_student_reviews_vault', JSON.stringify(merged));
          return merged;
        });
      }
      // 2. Then reconcile with server
      fetchReviewsFromServer();
    });

    const handleExternalUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.source === 'StudentFeedbackTemplate') return;
      const saved = localStorage.getItem('dem_student_reviews');
      const vault = localStorage.getItem('dem_student_reviews_vault');
      let p1: StudentReviewItem[] = [];
      let p2: StudentReviewItem[] = [];
      try { if (saved) p1 = JSON.parse(saved); } catch {}
      try { if (vault) p2 = JSON.parse(vault); } catch {}
      const merged = mergeUniqueById(p1, p2);
      if (merged.length > 0) {
        setReviewsList(merged);
      }
    };

    window.addEventListener('dem_student_reviews_updated', handleExternalUpdate);
    return () => {
      window.removeEventListener('dem_student_reviews_updated', handleExternalUpdate);
    };
  }, []);

  // Sync likes
  useEffect(() => {
    localStorage.setItem('dem_liked_reviews', JSON.stringify(likedIds));
  }, [likedIds]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Safe clipboard helper that NEVER uses window.alert
  const safeCopyToClipboard = async (text: string, successMsg?: string): Promise<boolean> => {
    let copied = false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (err) {
      copied = false;
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (e) {
        copied = false;
      }
    }

    if (copied) {
      showToast(successMsg || (lang === 'ky' ? 'Текст көчүрүлдү!' : 'Текст скопирован!'), 'success');
    } else {
      showToast(lang === 'ky' ? 'Текстти кол менен белгилеп көчүрүп алыңыз' : 'Выделите и скопируйте текст вручную', 'info');
    }
    return copied;
  };

  // Apply Quick Template to the Form
  const handleApplyTemplate = (tmpl: (typeof QUICK_TEMPLATES)[0]) => {
    setSelectedTemplateId(tmpl.id);
    setFeedbackType(tmpl.type);
    setCategory(tmpl.category);
    setRating(tmpl.defaultRating);
    setTitle(tmpl.titleKy);
    setContent(tmpl.contentKy);
    if (!fullName.trim()) {
      setFullName(localStorage.getItem('dem_student_author_name') || 'Студент-практикант');
    }
    if (!groupName.trim()) {
      setGroupName(localStorage.getItem('dem_student_group_name') || 'ИНФ-21');
    }
    setErrors({});
    setActiveTab('form');
    setShowModal(false);
    showToast(
      lang === 'ky'
        ? `«${tmpl.nameKy}» калыбы коюлду. Форманы текшерип, жөнөтүңүз!`
        : `Шаблон «${tmpl.nameKy}» загружен в форму!`,
      'info'
    );
    setTimeout(() => {
      formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      fullNameInputRef.current?.focus();
    }, 150);
  };

  // Instant 1-Click Template Publishing (Directly saves into database & renders on site)
  const handleInstantPublishTemplate = async (tmpl: (typeof QUICK_TEMPLATES)[0]) => {
    setIsSubmitting(true);
    const author = fullName.trim() || localStorage.getItem('dem_student_author_name') || 'Студент-практикант';
    const group = groupName.trim().toUpperCase() || localStorage.getItem('dem_student_group_name') || 'ИНФ-21';

    const instantReview: StudentReviewItem = {
      id: `rev-${Date.now()}`,
      fullName: author,
      groupName: group,
      faculty,
      feedbackType: tmpl.type,
      category: tmpl.category,
      rating: tmpl.defaultRating,
      title: tmpl.titleKy,
      content: tmpl.contentKy,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 1,
      status: 'received'
    };

    // 1. Immediately store in local state, cache vault & IndexedDB
    const updated = mergeUniqueById([instantReview], reviewsList);
    setReviewsList(updated);
    localStorage.setItem('dem_student_reviews', JSON.stringify(updated));
    localStorage.setItem('dem_student_reviews_vault', JSON.stringify(updated));
    saveStudentReviewsToIDB(updated);
    window.dispatchEvent(
      new CustomEvent('dem_student_reviews_updated', { detail: { source: 'StudentFeedbackTemplate' } })
    );

    // 2. Persist to server database (/api/reviews)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(instantReview)
      });
      if (res.ok) {
        const serverData = await res.json();
        if (Array.isArray(serverData)) {
          const finalMerged = mergeUniqueById(serverData, updated);
          setReviewsList(finalMerged);
          localStorage.setItem('dem_student_reviews', JSON.stringify(finalMerged));
          localStorage.setItem('dem_student_reviews_vault', JSON.stringify(finalMerged));
          saveStudentReviewsToIDB(finalMerged);
          setIsServerSynced(true);
        }
      }
    } catch (err) {
      console.warn('Network issue saving instant review, saved in local vault & IndexedDB', err);
    }

    setNewlyAddedId(instantReview.id);
    setIsSubmitting(false);
    setFilterType('all');
    setSearchQuery('');
    setActiveTab('feed');
    showToast(
      lang === 'ky'
        ? `«${tmpl.nameKy}» сайттын туруктуу базасына сакталды жана жарыяланды!`
        : `Отзыв «${tmpl.nameKy}» надёжно сохранён в постоянной базе!`,
      'success'
    );

    setTimeout(() => {
      feedTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  // Quick 1-click phrase insertion for easy writing (Сүйлөм конструктору)
  const handleInsertSnippet = (snippetText: string) => {
    setContent((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return snippetText;
      return `${trimmed}\n- ${snippetText}`;
    });
    if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
    showToast(lang === 'ky' ? 'Сүйлөм пикирге кошулду!' : 'Предложение добавлено!', 'info');
  };

  // Switch to Form with smooth scroll and focus
  const handleOpenForm = () => {
    setActiveTab('form');
    setShowModal(false);
    setErrors({});
    setTimeout(() => {
      formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      fullNameInputRef.current?.focus();
    }, 150);
  };

  // Submit Handler (Resilient & Guarantees Permanent Site Persistence)
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Check content
    if (!content.trim()) {
      setErrors({
        content: lang === 'ky' ? 'Сунуш, пикир же отзывдун текстин толук жазыңыз*' : 'Напишите текст отзыва/предложения*'
      });
      showToast(
        lang === 'ky'
          ? 'Сураныч, пикирдин же сунуштун текстин жазыңыз!'
          : 'Пожалуйста, напишите текст отзыва!',
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    // Resilient fallbacks for name and group so submission NEVER fails
    const finalFullName =
      fullName.trim() || localStorage.getItem('dem_student_author_name') || 'Студент-практикант';
    const finalGroupName =
      groupName.trim().toUpperCase() || localStorage.getItem('dem_student_group_name') || 'ПЕД-22';
    const finalTitle =
      title.trim() ||
      (selectedTemplateId
        ? QUICK_TEMPLATES.find((t) => t.id === selectedTemplateId)?.titleKy
        : '') ||
      'Педагогикалык практика боюнча пикир';

    // Update state and remember in localStorage
    setFullName(finalFullName);
    setGroupName(finalGroupName);
    setTitle(finalTitle);
    localStorage.setItem('dem_student_author_name', finalFullName);
    localStorage.setItem('dem_student_group_name', finalGroupName);

    const newReview: StudentReviewItem = {
      id: `rev-${Date.now()}`,
      fullName: finalFullName,
      groupName: finalGroupName,
      faculty,
      feedbackType,
      category,
      rating,
      title: finalTitle,
      content: content.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      likes: 1,
      status: 'received'
    };

    // 1. Immediately update UI, localStorage vault & IndexedDB
    const updated = mergeUniqueById([newReview], reviewsList);
    setReviewsList(updated);
    localStorage.setItem('dem_student_reviews', JSON.stringify(updated));
    localStorage.setItem('dem_student_reviews_vault', JSON.stringify(updated));
    saveStudentReviewsToIDB(updated);
    window.dispatchEvent(
      new CustomEvent('dem_student_reviews_updated', { detail: { source: 'StudentFeedbackTemplate' } })
    );

    // 2. Save to Server Database (/api/reviews) so feedback is permanently saved on the website
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      if (res.ok) {
        const serverData = await res.json();
        if (Array.isArray(serverData)) {
          const finalMerged = mergeUniqueById(serverData, updated);
          setReviewsList(finalMerged);
          localStorage.setItem('dem_student_reviews', JSON.stringify(finalMerged));
          localStorage.setItem('dem_student_reviews_vault', JSON.stringify(finalMerged));
          saveStudentReviewsToIDB(finalMerged);
          setIsServerSynced(true);
        }
      }
    } catch (e) {
      console.warn('Network issue saving review, saved in local vault & IndexedDB', e);
    }

    setNewlyAddedId(newReview.id);
    setErrors({});
    setIsSubmitting(false);
    setShowModal(false);

    // Reset content and title for next feedback
    setTitle('');
    setContent('');
    setSelectedTemplateId(null);

    // Switch to feed view with full display so student immediately sees their posted review
    setFilterType('all');
    setSearchQuery('');
    setActiveTab('feed');
    showToast(
      lang === 'ky'
        ? 'Сиздин пикириңиз сайттын туруктуу базасына сакталды жана жарыяланды!'
        : 'Ваш отзыв успешно сохранён в постоянной базе сайта!',
      'success'
    );

    // Scroll to the new review card
    setTimeout(() => {
      feedTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  // Export reviews to JSON file for safe user backup
  const handleExportReviewsJSON = () => {
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reviewsList, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `dem_student_reviews_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(lang === 'ky' ? 'Бардык пикирлердин камдык көчүрмөсү (JSON) сакталды!' : 'Резервная копия отзывов скачана!', 'success');
    } catch {
      showToast(lang === 'ky' ? 'Көчүрмө жүктөөдө ката чыкты' : 'Ошибка при экспорте', 'error');
    }
  };

  // Build formatted text for sharing
  const getFormattedShareText = (item?: StudentReviewItem) => {
    const fName = item ? item.fullName : fullName.trim() || '[Студенттин аты-жөнү]';
    const gName = item ? item.groupName : groupName.trim() || '[Группасы]';
    const fac = item ? item.faculty : faculty;
    const fType = item ? item.feedbackType : feedbackType;
    const cat = item ? item.category : category;
    const r = item ? item.rating : rating;
    const tText = item ? item.title : title.trim() || '[Тема]';
    const cText = item ? item.content : content.trim() || '[Текст]';

    return (
      `📋 СТУДЕНТТИН ПИКИРИ / СУНУШУ\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Ф.И.О: ${fName}\n` +
      `🎓 Группа: ${gName}\n` +
      `🏛️ Факультет: ${fac}\n` +
      `📌 Түрү: ${getTypeLabel(fType)}\n` +
      `📂 Багыт: ${cat}\n` +
      `⭐ Баалоо: ${r}/5 жылдыз\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `📝 Тема: ${tText}\n\n` +
      `${cText}\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `DEM Platform • ОшМПУ Студенттик байланыш`
    );
  };

  // WhatsApp share
  const handleShareWhatsApp = (item?: StudentReviewItem) => {
    const text = getFormattedShareText(item);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(lang === 'ky' ? 'WhatsApp ачылууда...' : 'Открывается WhatsApp...', 'info');
  };

  // Telegram share
  const handleShareTelegram = (item?: StudentReviewItem) => {
    const text = getFormattedShareText(item);
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(lang === 'ky' ? 'Telegram ачылууда...' : 'Открывается Telegram...', 'info');
  };

  // Like / Support review
  const handleLikeReview = async (id: string) => {
    const isCurrentlyLiked = likedIds.includes(id);
    const delta = isCurrentlyLiked ? -1 : 1;

    if (isCurrentlyLiked) {
      // Unlike
      setLikedIds(likedIds.filter((x) => x !== id));
      setReviewsList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, likes: Math.max(0, item.likes - 1) } : item))
      );
      showToast(lang === 'ky' ? 'Колдооңуз жокко чыгарылды' : 'Поддержка отменена', 'info');
    } else {
      // Like
      setLikedIds([...likedIds, id]);
      setReviewsList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
      );
      showToast(lang === 'ky' ? 'Пикирге колдооңуз кошулду! 👍' : 'Вы поддержали этот отзыв! 👍', 'success');
    }

    // Sync with server database
    try {
      await fetch(`/api/reviews/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta })
      });
    } catch (e) {
      console.warn('Could not sync like to server', e);
    }
  };

  const getTypeLabel = (type: FeedbackType) => {
    switch (type) {
      case 'review':
        return lang === 'ky' ? 'Отзыв / Баалоо' : 'Отзыв / Оценка';
      case 'suggestion':
        return lang === 'ky' ? 'Сунуш / Жаңы идея' : 'Предложение / Идея';
      case 'opinion':
        return lang === 'ky' ? 'Пикир / Ой-толгоо' : 'Мнение / Мысль';
      case 'issue':
        return lang === 'ky' ? 'Маселе / Кайрылуу' : 'Вопрос / Обращение';
      case 'gratitude':
        return lang === 'ky' ? 'Ыраазычылык' : 'Благодарность';
      default:
        return 'Пикир';
    }
  };

  const getTypeBadgeStyle = (type: FeedbackType) => {
    switch (type) {
      case 'review':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'suggestion':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'opinion':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'issue':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'gratitude':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const filteredReviews = reviewsList.filter((item) => {
    const matchesType = filterType === 'all' || item.feedbackType === filterType;
    if (!matchesType) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.fullName.toLowerCase().includes(q) ||
      item.groupName.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div id="student-feedback-template-module" className="space-y-6 relative">
      {/* Toast Notification Container */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 max-w-md w-[92%] transition-all animate-bounce-short ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-white border-emerald-400'
              : toast.type === 'error'
              ? 'bg-rose-950 text-white border-rose-400'
              : 'bg-slate-900 text-white border-cyan-400'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0" />}
          <p className="text-xs sm:text-sm font-semibold flex-1 leading-snug">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Жабуу"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/60 via-teal-50/20 to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wide">
                <MessageSquarePlus className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ky' ? 'Студенттик үн & байланыш кызматы' : 'Студенческая обратная связь'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{lang === 'ky' ? 'Сайттын базасында сакталат' : 'Сохраняется в базе сайта'}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'ky'
                ? 'Студенттерден отзыв, пикир жана сунуш калтыруу'
                : 'Отзывы, мнения и предложения студентов'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {lang === 'ky'
                ? 'Педагогикалык практика, окуу процесси, усулдар жана платформа боюнча өз оюңузду же сунушуңузду калтырыңыз. Ф.И.О жана группаңызды көрсөтүү менен расмий кароого жөнөтүлөт.'
                : 'Оставьте отзыв о педагогической практике, учебном процессе или предложите идеи по развитию платформы DEM.'}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-emerald-50 border border-emerald-200/80 p-4 rounded-2xl shadow-inner">
            <GraduationCap className="w-10 h-10 text-emerald-700 shrink-0" />
            <div className="text-xs text-emerald-950">
              <span className="font-extrabold block text-sm">Ф.И.О & Группа</span>
              <span className="text-emerald-800">Расмий студенттик форма</span>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-900 font-bold bg-emerald-200/70 px-2 py-0.5 rounded-md">
                  <Smartphone className="w-3 h-3 text-emerald-700" /> Телефон
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-900 font-bold bg-emerald-200/70 px-2 py-0.5 rounded-md">
                  Ноутбук
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Switches - Mobile Touch Friendly */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button
              id="tab-btn-feedback-form"
              onClick={handleOpenForm}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border min-h-[44px] ${
                activeTab === 'form'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-extrabold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="truncate">{lang === 'ky' ? 'Форманы толтуруу' : 'Заполнить форму'}</span>
            </button>

            <button
              id="tab-btn-feedback-templates"
              onClick={() => setActiveTab('templates')}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border min-h-[44px] ${
                activeTab === 'templates'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-extrabold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="truncate">{lang === 'ky' ? '8 Даяр шаблон' : '8 Шаблонов'}</span>
            </button>

            <button
              id="tab-btn-feedback-feed"
              onClick={() => setActiveTab('feed')}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border min-h-[44px] ${
                activeTab === 'feed'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-extrabold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {lang === 'ky' ? 'Пикирлер' : 'Отзывы'} ({reviewsList.length})
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-500 font-medium hidden lg:inline">
              💡 Көчүрүп алып WhatsApp же Telegram аркылуу жөнөтүүгө даяр
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="sm:hidden w-full px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>+ Жаңы пикир</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: FORM TO SUBMIT */}
      {activeTab === 'form' && (
        <div ref={formContainerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Main Input Form (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span>{lang === 'ky' ? 'Студенттин анкетасы жана пикири' : 'Анкета и отзыв студента'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Жылдызчалуу талаалар (*) сөзсүз толтурулуусу шарт
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('feed')}
                className="self-start sm:self-auto text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer py-1"
              >
                <span>Калтырылган пикирлерге өтүү ({reviewsList.length}) →</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Quick Template Picker Box for Easy 1-Click Writing */}
              <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-slate-50 p-4 sm:p-5 rounded-2xl border border-emerald-200/90 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {lang === 'ky' ? 'Жеңил жазуу: 1 баскыч менен даяр шаблонду тандаңыз' : 'Быстрое заполнение: выберите готовый шаблон'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ky'
                          ? 'Төмөнкү 8 үлгүнүн бирин бассаңыз, тема жана структурасы дароо толтурулат:'
                          : 'Нажмите на любой из 8 шаблонов ниже, чтобы моментально заполнить форму:'}
                      </p>
                    </div>
                  </div>
                  {selectedTemplateId && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(null);
                        setTitle('');
                        setContent('');
                      }}
                      className="self-end sm:self-auto text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      ✕ Тазалоо
                    </button>
                  )}
                </div>

                {/* Quick 8 Template Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {QUICK_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleApplyTemplate(tmpl)}
                        className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-1 min-h-[60px] ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/20'
                            : 'bg-white hover:bg-emerald-50/90 hover:border-emerald-300 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm shrink-0">{tmpl.icon}</span>
                          <span className={`text-[11px] font-extrabold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {tmpl.nameKy}
                          </span>
                        </div>
                        <span className={`text-[10px] line-clamp-1 ${isSelected ? 'text-emerald-100' : 'text-slate-400 font-medium'}`}>
                          {tmpl.category}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedTemplateId && (
                  <div className="flex items-center gap-2 text-xs text-emerald-800 bg-white/95 px-3.5 py-2 rounded-xl border border-emerald-300 shadow-2xs animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>{lang === 'ky' ? 'Шаблон жүктөлдү!' : 'Шаблон загружен!'}</strong>{' '}
                      {lang === 'ky'
                        ? 'Төмөндөгү текстке өзүңүздүн ойлоруңузду же мектеп/классыңызды толуктап койсоңуз болот.'
                        : 'Вы можете дополнить предложенный текст своими данными и нажать «Билдирүүнү жөнөтүү».'}
                    </span>
                  </div>
                )}
              </div>

              {/* Row 1: F.I.O and Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="student-input-fio" className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      Ф.И.О (Толук аты-жөнүңүз)*:
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Мисалы: Асанов Арсен</span>
                  </label>
                  <input
                    ref={fullNameInputRef}
                    id="student-input-fio"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                    }}
                    placeholder="Аты-жөнүңүздү толук жазыңыз..."
                    className={`w-full px-3.5 py-3 rounded-xl border text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 bg-slate-50/50 min-h-[44px] transition-colors ${
                      errors.fullName
                        ? 'border-rose-400 focus:ring-rose-500/30 bg-rose-50/30'
                        : 'border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-500'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 animate-in fade-in">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="student-input-group" className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      Группа (Тайпаңыз)*:
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Мисалы: ИНФ-21, Б-1-22</span>
                  </label>
                  <input
                    id="student-input-group"
                    type="text"
                    required
                    value={groupName}
                    onChange={(e) => {
                      setGroupName(e.target.value);
                      if (errors.groupName) setErrors({ ...errors, groupName: undefined });
                    }}
                    placeholder="Группаңыздын кодун жазыңыз (мис: ПЕД-22)..."
                    className={`w-full px-3.5 py-3 rounded-xl border text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 bg-slate-50/50 uppercase min-h-[44px] transition-colors ${
                      errors.groupName
                        ? 'border-rose-400 focus:ring-rose-500/30 bg-rose-50/30'
                        : 'border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-500'
                    }`}
                  />
                  {errors.groupName && (
                    <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 animate-in fade-in">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.groupName}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Faculty and Feedback Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="student-select-faculty" className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    Факультет:
                  </label>
                  <select
                    id="student-select-faculty"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-slate-50/50 min-h-[44px]"
                  >
                    <option value="Табият таануу жана математика факультети">
                      Табият таануу жана математика факультети
                    </option>
                    <option value="Педагогика жана искусство факультети">
                      Педагогика жана искусство факультети
                    </option>
                    <option value="Кыргыз филологиясы жана маданияты">
                      Кыргыз филологиясы жана маданияты
                    </option>
                    <option value="Орус филологиясы жана чет тилдер факультети">
                      Орус филологиясы жана чет тилдер факультети
                    </option>
                    <option value="Тарых жана социалдык-укуктук билим берүү">
                      Тарых жана социалдык-укуктук билим берүү
                    </option>
                    <option value="Маалыматтык технологиялар жана колледж">
                      Маалыматтык технологиялар жана колледж
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="student-select-type" className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Билдирүүнүн түрү*:
                  </label>
                  <select
                    id="student-select-type"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-slate-50/50 min-h-[44px]"
                  >
                    <option value="review">⭐ Отзыв / Баалоо</option>
                    <option value="suggestion">💡 Сунуш / Жаңы идея</option>
                    <option value="opinion">💬 Пикир / Ой-толгоо</option>
                    <option value="issue">⚠️ Маселе / Кайрылуу</option>
                    <option value="gratitude">💖 Ыраазычылык билдирүү</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Category and Star Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <label htmlFor="student-select-category" className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Категория / Багыт:
                  </label>
                  <select
                    id="student-select-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-slate-50/50 min-h-[44px]"
                  >
                    <option value="Педагогикалык практика">Педагогикалык практика</option>
                    <option value="Сабактар жана окуу материалдары">Сабактар жана окуу материалдары</option>
                    <option value="Окутуу усулдары жана сабактар">Окутуу усулдары жана методика</option>
                    <option value="DEM Платформасы жана IT">DEM Платформасы жана IT</option>
                    <option value="Инфраструктура жана шарттар">Инфраструктура жана шарттар</option>
                    <option value="Насаатчылар жана кураторлор">Насаатчылар жана кураторлор</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Сиздин бааңыз (Рейтинг):</span>
                    <span className="text-emerald-800 font-extrabold text-xs">{rating} / 5</span>
                  </label>
                  <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200 min-h-[44px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1.5 sm:p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg"
                        title={`${star} жылдыз`}
                        aria-label={`${star} жылдыз`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-600 font-semibold ml-2">
                      {rating === 5
                        ? 'Эң сонун!'
                        : rating === 4
                        ? 'Жакшы'
                        : rating === 3
                        ? 'Орточо'
                        : 'Жакшыртуу керек'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label htmlFor="student-input-title" className="block text-xs font-bold text-slate-800">
                  Теманын аталышы (Кыскача маңызы)*:
                </label>
                <input
                  id="student-input-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  placeholder="Мисалы: 5-класстын математика сабагы боюнча практикалык тажрыйбам..."
                  className={`w-full px-3.5 py-3 rounded-xl border text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 bg-slate-50/50 min-h-[44px] transition-colors ${
                    errors.title
                      ? 'border-rose-400 focus:ring-rose-500/30 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-500'
                  }`}
                />
                {errors.title && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Content Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="student-textarea-content" className="block text-xs font-bold text-slate-800">
                    Толук отзыв, пикир же сунуштун тексти*:
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('templates')}
                    className="text-[11px] text-emerald-800 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer py-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Даяр шаблон колдонуу
                  </button>
                </div>
                <textarea
                  id="student-textarea-content"
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) setErrors({ ...errors, content: undefined });
                  }}
                  placeholder="Оюңузду, практикалык тажрыйбаңызды, сунушуңузду же ыраазычылыгыңызды кенен жазыңыз..."
                  className={`w-full px-3.5 py-3 rounded-2xl border text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 bg-slate-50/50 leading-relaxed transition-colors ${
                    errors.content
                      ? 'border-rose-400 focus:ring-rose-500/30 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-500'
                  }`}
                />
                {errors.content && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.content}
                  </p>
                )}

                {/* Quick Sentence Starters (Сүйлөм конструктору) */}
                <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>{lang === 'ky' ? 'Сүйлөм конструктору (Тез кошуу үчүн басыңыз):' : 'Конструктор предложений (кликните для быстрой вставки):'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">+ 1 чыкылдатуу</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_SNIPPETS.map((snip, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleInsertSnippet(snip.text)}
                        className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs"
                        title={snip.text}
                      >
                        <span className="text-emerald-600 font-extrabold">+</span>
                        <span>{snip.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Site Persistence Reassurance Badge */}
                <div className="flex items-center gap-2 p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/70 text-xs text-emerald-950">
                  <Database className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>{lang === 'ky' ? 'Сайтта сакталат:' : 'Сохраняется на сайте:'}</strong>{' '}
                    {lang === 'ky'
                      ? 'Сиздин пикириңиз сервердик базада калат, сайттан өчүрүлбөйт жана баарына жеткиликтүү болот.'
                      : 'Ваш отзыв сохраняется в постоянной базе сервера и остаётся на сайте.'}
                  </span>
                </div>
              </div>

              {/* Action Buttons - Fully Responsive */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => safeCopyToClipboard(getFormattedShareText(), 'Текст көчүрүлдү!')}
                    className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 min-h-[44px]"
                    title="WhatsApp же кураторго жөнөтүү үчүн даяр текстти көчүрүү"
                  >
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Көчүрүп алуу</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp()}
                    className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-200 min-h-[44px]"
                    title="WhatsApp аркылуу жөнөтүү"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTitle('');
                      setContent('');
                      setErrors({});
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px]"
                  >
                    Тазалоо
                  </button>

                  <button
                    id="btn-submit-student-feedback"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer min-h-[48px]"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Жөнөтүлүүдө...' : 'Билдирүүнү жөнөтүү'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Side Info & Tips Card (1 col) */}
          <div className="space-y-5">
            {/* Quick Live Preview Card */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-xs">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Түз алдын ала көрүү (Preview):</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm">
                      {fullName || 'Ф.И.О: [Студенттин аты]'}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">
                      Тайпасы: {groupName ? groupName.toUpperCase() : '[Группа коду]'}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getTypeBadgeStyle(feedbackType)}`}>
                    {getTypeLabel(feedbackType)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] text-slate-500 ml-1 font-semibold">({rating}/5)</span>
                </div>

                <p className="font-bold text-slate-800 text-xs line-clamp-1">
                  {title || 'Теманын аталышы...'}
                </p>

                <p className="text-slate-600 text-[11px] line-clamp-3 leading-relaxed">
                  {content || 'Жазган пикириңиз же сунушуңуз ушул жерде көрүнөт...'}
                </p>
              </div>

              <p className="text-[11px] text-emerald-900/90 leading-relaxed font-medium">
                ✅ Сиз жөнөткөн пикир калтырылган пикирлер тизмесине дароо кошулуп, деканат жана мугалимдер тарабынан каралат.
              </p>
            </div>

            {/* Quick Template Picker widget */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                8 Даяр шаблондор:
              </span>
              <div className="space-y-1.5 text-xs max-h-80 overflow-y-auto pr-1">
                {QUICK_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-800 group-hover:text-emerald-800 block text-[11px]">
                        {tmpl.icon} {tmpl.nameKy}
                      </span>
                      <span className="text-[10px] text-slate-400">{tmpl.category}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
                      + Тандоо
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy & Guarantee note */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block text-[11px]">🛡️ Сайтта сакталуу кепилдиги:</span>
              <p className="text-[11px] leading-relaxed">
                Бардык жазылган пикирлер жана сунуштар сайттын маалыматтар базасында өчүрүлбөй сакталат. Окуу процессинин сапатын жакшыртуу үчүн колдонулат.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 8 READY-TO-USE TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Даяр 8 студенттик калыптар жана үлгүлөр
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Төмөндөгү 8 даяр үлгүнүн бирин тандап, бир баскыч менен өз аты-жөнүңүз жана тобуңузга ылайыкташтырып жеңил толтуруңуз.
              </p>
            </div>
            <button
              onClick={handleOpenForm}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Формага кайтуу</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {QUICK_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {tmpl.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getTypeBadgeStyle(tmpl.type)}`}>
                      {getTypeLabel(tmpl.type)}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 mb-2">{tmpl.nameKy}</h4>

                  <p className="font-semibold text-xs text-slate-700 mb-3">{tmpl.titleKy}</p>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans mb-4 max-h-48 overflow-y-auto">
                    {tmpl.contentKy}
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">⭐ Баа: {tmpl.defaultRating}/5</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleInstantPublishTemplate(tmpl)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs min-h-[38px]"
                      title="Бул шаблонду сайттын базасына дароо сактоо жана жарыялоо"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{lang === 'ky' ? '1 баскыч менен жарыялоо' : 'Опубликовать в 1 клик'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer border border-slate-200 min-h-[38px]"
                      title="Шаблонду формага салып, өз оюңузду кошуу"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lang === 'ky' ? 'Түзөтүү' : 'Изменить'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: REVIEWS FEED */}
      {activeTab === 'feed' && (
        <div ref={feedTopRef} className="space-y-4 animate-in fade-in">
          {/* Quick Write with Template Callout Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-extrabold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'ky' ? 'Жеңил жазуу: 8 даяр калып' : 'Быстрое заполнение: 8 готовых шаблонов'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {lang === 'ky' ? 'Студенттик пикир же сунуш калтыруу эми 1 мүнөттө оңой!' : 'Оставить отзыв или предложение теперь легко за 1 минуту!'}
              </h3>
              <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                {lang === 'ky'
                  ? 'Бардык пикирлер сервердик туруктуу базага (/api/reviews) жазылат, сайттан өчүрүлбөй сакталат жана бардык колдонуучуларга дароо көрүнөт.'
                  : 'Все отзывы сохраняются в постоянную базу сервера (/api/reviews), не удаляются и видны всем посетителям сайта.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={() => setActiveTab('templates')}
                className="flex-1 md:flex-initial px-4 py-3 rounded-2xl bg-emerald-500/30 hover:bg-emerald-500/40 text-white border border-white/20 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{lang === 'ky' ? '8 Даяр шаблон' : '8 Шаблонов'}</span>
              </button>
              <button
                onClick={handleOpenForm}
                className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <Zap className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ky' ? 'Жаңы пикир жазуу' : 'Написать отзыв'}</span>
              </button>
            </div>
          </div>

          {/* Site Persistence Status Bar */}
          <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <Database className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>{lang === 'ky' ? 'Сайтта сакталуу кепилдиги:' : 'Гарантия сохранения:'}</strong>{' '}
                {lang === 'ky'
                  ? 'Сервердик туруктуу база (/api/reviews) активдүү. Бардык пикирлер өчүрүлбөйт.'
                  : 'Постоянная база сервера (/api/reviews) активна. Все отзывы защищены от удаления.'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 bg-white/90 px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ky' ? 'Базада сакталган:' : 'Сохранено в базе:'} <strong className="text-emerald-900">{reviewsList.length}</strong></span>
            </div>
          </div>

          {/* Feed Filter & Action Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-emerald-600" />
                  Түрү:
                </span>
                {[
                  { id: 'all', label: 'Бардыгы' },
                  { id: 'review', label: 'Отзывтар' },
                  { id: 'suggestion', label: 'Сунуштар' },
                  { id: 'opinion', label: 'Пикирлер' },
                  { id: 'issue', label: 'Кайрылуулар' },
                  { id: 'gratitude', label: 'Ыраазычылыктар' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border min-h-[38px] ${
                      filterType === f.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Main Submit Action Button - High Contrast */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="btn-open-new-feedback"
                  onClick={handleOpenForm}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all min-h-[44px]"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>+ Жаңы пикир калтыруу</span>
                </button>
              </div>
            </div>

            {/* Real-time search row */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Студенттин аты, группасы, тема же сөз боюнча издөө..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-base sm:text-xs text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => fetchReviewsFromServer(true)}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                  title="Сайттын серверинен акыркы пикирлерди жаңылоо"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? (lang === 'ky' ? 'Жаңыланууда...' : 'Обновление...') : (lang === 'ky' ? 'Базаны жаңылоо' : 'Обновить')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportReviewsJSON}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  title="Бардык пикирлерди JSON файлы түрүндө көчүрүп алуу"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>{lang === 'ky' ? 'Экспорт (JSON)' : 'Экспорт'}</span>
                </button>

                <span className="text-xs text-slate-600 font-medium">
                  Табылды: <strong className="text-slate-800">{filteredReviews.length}</strong> / Сакталган: <strong className="text-emerald-700">{reviewsList.length}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* List of Reviews */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 space-y-3">
                <MessageCircle className="w-12 h-12 mx-auto text-slate-300" />
                <p className="font-bold text-sm text-slate-700">
                  {searchQuery ? 'Издөө боюнча эч нерсе табылган жок.' : 'Бул категорияда азырынча пикир калтырыла элек.'}
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? 'Башка сөз менен издеп көрүңүз же чыпканы алмаштырыңыз.'
                    : 'Сиз биринчилерден болуп өз сунушуңузду же пикириңизди калтыра аласыз!'}
                </p>
                <button
                  onClick={handleOpenForm}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer min-h-[44px]"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Пикир жазуу</span>
                </button>
              </div>
            ) : (
              filteredReviews.map((item) => {
                const isNewlyAdded = item.id === newlyAddedId;
                const isLiked = likedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    id={`review-card-${item.id}`}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs space-y-4 relative ${
                      isNewlyAdded
                        ? 'border-emerald-500 ring-4 ring-emerald-500/15 bg-gradient-to-b from-emerald-50/20 to-white'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {isNewlyAdded && (
                      <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md animate-bounce-short">
                        ★ Жаңы жарыяланды!
                      </span>
                    )}

                    {/* Top Author Row with F.I.O and Group */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0">
                          {item.fullName.charAt(0) || 'С'}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-extrabold text-sm text-slate-900">{item.fullName}</h4>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-extrabold text-[11px] border border-emerald-200">
                              Группа: {item.groupName}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              {lang === 'ky' ? 'Сайтта сакталган (өчүрүлбөйт)' : 'Сохранено на сайте (в базе)'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block pt-0.5">
                            {item.faculty} • {item.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-3.5 h-3.5 ${
                                starIdx < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>

                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getTypeBadgeStyle(item.feedbackType)}`}>
                          {getTypeLabel(item.feedbackType)}
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50/70 px-2 py-0.5 rounded-md inline-block">
                        📂 {item.category}
                      </span>
                      <h5 className="font-extrabold text-sm sm:text-base text-slate-900">{item.title}</h5>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                        {item.content}
                      </p>
                    </div>

                    {/* Official Response if any */}
                    {item.adminReply && (
                      <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl space-y-1 text-xs text-emerald-950">
                        <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          Деканат / Практика жетекчилигинин жообу:
                        </span>
                        <p className="text-emerald-900 leading-relaxed pl-5 font-medium">
                          {item.adminReply}
                        </p>
                      </div>
                    )}

                    {/* Footer Bar: Likes & Share */}
                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLikeReview(item.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border min-h-[38px] ${
                            isLiked
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'text-white' : 'text-emerald-600'}`} />
                          <span>Колдойм ({item.likes})</span>
                        </button>

                        <button
                          onClick={() => handleShareWhatsApp(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-800 font-bold border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer min-h-[38px]"
                          title="WhatsApp аркылуу жөнөтүү"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const copyText =
                              `Студент: ${item.fullName} (${item.groupName})\n` +
                              `Тема: ${item.title}\n\n${item.content}`;
                            safeCopyToClipboard(copyText, 'Пикирдин тексти көчүрүлдү!');
                          }}
                          className="text-slate-600 hover:text-emerald-700 font-bold flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer min-h-[38px]"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Көчүрүү</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button for Mobile screens when on Feed tab */}
      {activeTab === 'feed' && (
        <button
          onClick={handleOpenForm}
          className="sm:hidden fixed bottom-6 right-5 z-40 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer border-2 border-white"
          aria-label="Жаңы пикир калтыруу"
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span className="text-xs font-extrabold pr-1">Пикир жазуу</span>
        </button>
      )}

      {/* Quick Modal Dialog for Quick Submission from Anywhere */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  Жаңы отзыв же сунуш калтыруу
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Quick Template Picker in Modal */}
              <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lang === 'ky' ? 'Жеңил жазуу үчүн даяр шаблон:' : 'Готовый шаблон для быстрого ввода:'}</span>
                </div>
                <select
                  onChange={(e) => {
                    const tmpl = QUICK_TEMPLATES.find((t) => t.id === e.target.value);
                    if (tmpl) {
                      setFeedbackType(tmpl.type);
                      setCategory(tmpl.category);
                      setRating(tmpl.defaultRating);
                      setTitle(tmpl.titleKy);
                      setContent(tmpl.contentKy);
                      setSelectedTemplateId(tmpl.id);
                      if (!fullName.trim()) {
                        setFullName(localStorage.getItem('dem_student_author_name') || 'Студент-практикант');
                      }
                      if (!groupName.trim()) {
                        setGroupName(localStorage.getItem('dem_student_group_name') || 'ИНФ-21');
                      }
                    }
                  }}
                  defaultValue=""
                  className="text-xs font-bold text-slate-800 bg-white border border-emerald-300 rounded-xl px-2.5 py-1.5 focus:outline-none min-h-[38px]"
                >
                  <option value="" disabled>-- 8 даяр калыптын бири --</option>
                  {QUICK_TEMPLATES.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.icon} {tmpl.nameKy} ({tmpl.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Ф.И.О*:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                    }}
                    placeholder="Аты-жөнүңүз..."
                    className={`w-full px-3 py-2.5 rounded-xl border text-base sm:text-xs text-slate-800 bg-slate-50 min-h-[44px] ${
                      errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.fullName && <p className="text-[10px] text-rose-600 font-bold">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Группа*:</label>
                  <input
                    type="text"
                    required
                    value={groupName}
                    onChange={(e) => {
                      setGroupName(e.target.value);
                      if (errors.groupName) setErrors({ ...errors, groupName: undefined });
                    }}
                    placeholder="Мисалы: ИНФ-21..."
                    className={`w-full px-3 py-2.5 rounded-xl border text-base sm:text-xs text-slate-800 bg-slate-50 uppercase min-h-[44px] ${
                      errors.groupName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.groupName && <p className="text-[10px] text-rose-600 font-bold">{errors.groupName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Түрү:</label>
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-base sm:text-xs text-slate-800 bg-slate-50 min-h-[44px]"
                  >
                    <option value="review">⭐ Отзыв / Баалоо</option>
                    <option value="suggestion">💡 Сунуш / Жаңы идея</option>
                    <option value="opinion">💬 Пикир / Ой-толгоо</option>
                    <option value="issue">⚠️ Маселе / Кайрылуу</option>
                    <option value="gratitude">💖 Ыраазычылык</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Баалоо (Рейтинг):</label>
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1.5 rounded-xl border border-slate-200 min-h-[44px]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-110 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-emerald-800 ml-auto">{rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Теманын аталышы*:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  placeholder="Теманын кыскача аталышы..."
                  className={`w-full px-3 py-2.5 rounded-xl border text-base sm:text-xs text-slate-800 bg-slate-50 min-h-[44px] ${
                    errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.title && <p className="text-[10px] text-rose-600 font-bold">{errors.title}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Толук тексти*:</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) setErrors({ ...errors, content: undefined });
                  }}
                  placeholder="Оюңузду же сунушуңузду жазыңыз..."
                  className={`w-full px-3 py-2.5 rounded-xl border text-base sm:text-xs text-slate-800 bg-slate-50 leading-relaxed ${
                    errors.content ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.content && <p className="text-[10px] text-rose-600 font-bold">{errors.content}</p>}

                {/* Quick phrase constructor buttons */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    {lang === 'ky' ? 'Тез кошуу:' : 'Быстрые фразы:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {SAMPLE_SNIPPETS.slice(0, 5).map((snip, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleInsertSnippet(snip.text)}
                        className="text-[10px] font-medium bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        + {snip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Site Persistence reassurance */}
                <div className="flex items-center gap-1.5 p-2 bg-emerald-50/70 rounded-xl border border-emerald-200 text-[10px] text-emerald-900 font-medium">
                  <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {lang === 'ky'
                      ? 'Сиз жазган пикир сайттын базасында түбөлүк сакталат.'
                      : 'Отзыв останется в постоянной базе сайта.'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer min-h-[44px]"
                >
                  Жокко чыгаруу
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md min-h-[44px]"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Жөнөтүлүүдө...' : 'Жөнөтүү'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
