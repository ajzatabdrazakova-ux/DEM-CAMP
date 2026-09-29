import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.join(process.cwd(), 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'student_reviews.json');
const REVIEWS_BACKUP_FILE = path.join(DATA_DIR, 'student_reviews_backup.json');
const TRUST_FEEDBACKS_FILE = path.join(DATA_DIR, 'trust_feedbacks.json');
const TRUST_FEEDBACKS_BACKUP_FILE = path.join(DATA_DIR, 'trust_feedbacks_backup.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed reviews
const SEED_REVIEWS = [
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

const SEED_TRUST_FEEDBACKS = [
  {
    id: 'fb-1',
    trackingCode: '#DEM-4821',
    isAnonymous: true,
    faculty: 'Маалыматтык технологиялар факультети',
    category: 'infrastructure',
    title: '3-корпустагы китепканада розеткалар жана Wi-Fi ылдамдыгы жетишсиз',
    message: 'Студенттер ноутбук менен сабак даярдаган учурда розеткалар тартыш болуп, Wi-Fi бат-бат үзүлүп жатат. Кошумча узартуучу зымдар жана күчтүүрөөк роутер коюп берүүнү суранабыз.',
    urgency: 'medium',
    status: 'resolved',
    submittedAt: '2026-09-02',
    officialResponse: {
      responderName: 'Алмазбеков С. Т.',
      responderRole: 'ИТ жана Чарба департаментинин башчысы',
      responseText: 'Кайрылуу боюнча чара көрүлдү: Китепкананын окуу залына 24 кошумча розетка орнотулду жана жаңы 5GHz Wi-Fi мүмкүндүк түйүнү ишке киргизилди.',
      respondedAt: '2026-09-08'
    },
    upvotes: 43
  },
  {
    id: 'fb-2',
    trackingCode: '#DEM-5014',
    isAnonymous: false,
    studentName: 'Адилет Сейитбеков (3-курс)',
    faculty: 'Экономика жана Башкаруу факультети',
    category: 'academic',
    title: 'Силлабустардагы адабияттардын электрондук варианттарын алдын ала берүү',
    message: 'Айрым предметтер боюнча сунушталган китептер китепканада саналуу гана нускада. Силлабуска алардын PDF же онлайн китепкана шилтемелерин дароо кошуу мүмкүнбү?',
    urgency: 'medium',
    status: 'reviewing',
    submittedAt: '2026-09-09',
    officialResponse: {
      responderName: 'Окуу-усулдук кеңеш',
      responderRole: 'Академиялык саясат комитети',
      responseText: 'Сунуш кафедраларга жөнөтүлдү. Бардык окутуучуларга Moodle системасында электрондук окуу куралдарынын түз шилтемелерин жайгаштыруу милдеттендирилүүдө.',
      respondedAt: '2026-09-12'
    },
    upvotes: 29
  },
  {
    id: 'fb-3',
    trackingCode: '#DEM-5190',
    isAnonymous: true,
    faculty: 'Гуманитардык факультет',
    category: 'assessment',
    title: 'Модулдук текшерүү иштерин баалоо критерийлеринин ачыктыгы',
    message: 'Аралык текшерүүдө эмне үчүн упай кемитилгени боюнча толук пикир (feedback) берилсе дейбиз. Жөн гана сан коюп койгондо катабызды түшүнбөй калабыз.',
    urgency: 'high',
    status: 'received',
    submittedAt: '2026-09-13',
    officialResponse: {
      responderName: 'Деканат',
      responderRole: 'Окуу бөлүмү',
      responseText: 'Окутуучуларга модулдук иштердин критерийлерин алдын ала тааныштыруу жана каталарды талдоо боюнча сунуштама берилди.',
      respondedAt: '2026-09-16'
    },
    upvotes: 67
  },
  {
    id: 'fb-4',
    trackingCode: '#DEM-5320',
    isAnonymous: false,
    studentName: 'Касымова Айпери (4-курс)',
    faculty: 'Табият таануу жана математика факультети',
    category: 'academic',
    title: 'Педагогикалык практикада 8 табдуу иштелмелерди колдонуу боюнча кошумча мастер-класс',
    message: 'Мектептерде практика өтөөдө көрсөтмө куралдарды жана санариптик симуляцияларды колдонуу боюнча студенттерге дагы практикалык тренингдер уюштурулса жакшы болот эле.',
    urgency: 'medium',
    status: 'resolved',
    submittedAt: '2026-09-18',
    officialResponse: {
      responderName: 'Практика жетекчиси',
      responderRole: 'Педагогика кафедрасы',
      responseText: 'Сунуш колдоого алынды. Ар бейшемби күнү саат 15:00дө виртуалдык лабдар жана санарип сабактар боюнча ачык мастер-класстар өткөрүлүп турат.',
      respondedAt: '2026-09-20'
    },
    upvotes: 38
  }
];

// In-memory cache to guarantee persistence across requests even in serverless/container environments
let memoryReviewsCache: any[] = [];
let memoryFeedbacksCache: any[] = [];

/**
 * Merge lists of records by ID without losing data.
 * Merges attributes such as likes, adminReply, status.
 */
function mergeListById(master: any[], ...others: any[][]): any[] {
  const map = new Map<string, any>();
  const all = [master, ...others];
  for (const list of all) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (!item || !item.id) continue;
      const existing = map.get(item.id);
      if (!existing) {
        map.set(item.id, { ...item });
      } else {
        map.set(item.id, {
          ...existing,
          ...item,
          likes: Math.max(Number(existing.likes) || 0, Number(item.likes) || 0),
          adminReply: item.adminReply || existing.adminReply,
          status:
            item.status === 'accepted' || item.status === 'implemented' || item.status === 'resolved'
              ? item.status
              : existing.status || item.status
        });
      }
    }
  }
  return Array.from(map.values());
}

function readReviews(): any[] {
  let fileReviews: any[] = [];
  let backupReviews: any[] = [];

  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const data = fs.readFileSync(REVIEWS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) fileReviews = parsed;
    }
  } catch (e) {
    console.error('Error reading REVIEWS_FILE:', e);
  }

  try {
    if (fs.existsSync(REVIEWS_BACKUP_FILE)) {
      const data = fs.readFileSync(REVIEWS_BACKUP_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) backupReviews = parsed;
    }
  } catch (e) {
    console.error('Error reading REVIEWS_BACKUP_FILE:', e);
  }

  // Self-healing merge of primary file, backup file, in-memory cache, and seeds
  const merged = mergeListById(fileReviews, backupReviews, memoryReviewsCache, SEED_REVIEWS);
  memoryReviewsCache = merged;

  // Auto-repair files if any review was missing from disk
  if (fileReviews.length < merged.length) {
    writeReviews(merged);
  }

  return merged;
}

function writeReviews(reviews: any[]) {
  try {
    memoryReviewsCache = reviews;
    const jsonStr = JSON.stringify(reviews, null, 2);

    // Atomic write to primary file
    const tmpPrimary = `${REVIEWS_FILE}.tmp`;
    fs.writeFileSync(tmpPrimary, jsonStr, 'utf-8');
    fs.renameSync(tmpPrimary, REVIEWS_FILE);

    // Atomic write to backup vault
    const tmpBackup = `${REVIEWS_BACKUP_FILE}.tmp`;
    fs.writeFileSync(tmpBackup, jsonStr, 'utf-8');
    fs.renameSync(tmpBackup, REVIEWS_BACKUP_FILE);
  } catch (e) {
    console.error('Error writing reviews:', e);
  }
}

function readTrustFeedbacks(): any[] {
  let fileFeedbacks: any[] = [];
  let backupFeedbacks: any[] = [];

  try {
    if (fs.existsSync(TRUST_FEEDBACKS_FILE)) {
      const data = fs.readFileSync(TRUST_FEEDBACKS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) fileFeedbacks = parsed;
    }
  } catch (e) {
    console.error('Error reading TRUST_FEEDBACKS_FILE:', e);
  }

  try {
    if (fs.existsSync(TRUST_FEEDBACKS_BACKUP_FILE)) {
      const data = fs.readFileSync(TRUST_FEEDBACKS_BACKUP_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) backupFeedbacks = parsed;
    }
  } catch (e) {
    console.error('Error reading TRUST_FEEDBACKS_BACKUP_FILE:', e);
  }

  const merged = mergeListById(fileFeedbacks, backupFeedbacks, memoryFeedbacksCache, SEED_TRUST_FEEDBACKS);
  memoryFeedbacksCache = merged;

  if (fileFeedbacks.length < merged.length) {
    writeTrustFeedbacks(merged);
  }

  return merged;
}

function writeTrustFeedbacks(feedbacks: any[]) {
  try {
    memoryFeedbacksCache = feedbacks;
    const jsonStr = JSON.stringify(feedbacks, null, 2);

    const tmpPrimary = `${TRUST_FEEDBACKS_FILE}.tmp`;
    fs.writeFileSync(tmpPrimary, jsonStr, 'utf-8');
    fs.renameSync(tmpPrimary, TRUST_FEEDBACKS_FILE);

    const tmpBackup = `${TRUST_FEEDBACKS_BACKUP_FILE}.tmp`;
    fs.writeFileSync(tmpBackup, jsonStr, 'utf-8');
    fs.renameSync(tmpBackup, TRUST_FEEDBACKS_BACKUP_FILE);
  } catch (e) {
    console.error('Error writing trust feedbacks:', e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // --- STUDENT REVIEWS & SUGGESTIONS API ---

  // Get all reviews
  app.get('/api/reviews', (req, res) => {
    const reviews = readReviews();
    res.json(reviews);
  });

  // Create new review with resilient fallbacks
  app.post('/api/reviews', (req, res) => {
    const { fullName, groupName, faculty, feedbackType, category, rating, title, content } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ error: 'Пикирдин тексти бош болбошу керек (Content is required)' });
    }

    const reviews = readReviews();
    const cleanId = req.body.id || `rev-${Date.now()}`;
    const newReview = {
      id: cleanId,
      fullName: String(fullName || 'Студент-практикант').trim() || 'Студент-практикант',
      groupName: String(groupName || 'ПЕД-22').trim().toUpperCase() || 'ПЕД-22',
      faculty: faculty || 'Табият таануу жана математика факультети',
      feedbackType: feedbackType || 'review',
      category: category || 'Педагогикалык практика',
      rating: Number(rating) || 5,
      title: String(title || 'Педагогикалык практика боюнча отзыв').trim() || 'Педагогикалык практика боюнча отзыв',
      content: String(content).trim(),
      createdAt: req.body.createdAt || new Date().toISOString().split('T')[0],
      likes: Number(req.body.likes) || 1,
      status: req.body.status || 'received',
      adminReply: req.body.adminReply || undefined
    };

    // Prepend new review, deduplicate by ID
    const updated = [newReview, ...reviews.filter((r) => r.id !== newReview.id)];
    writeReviews(updated);
    res.status(201).json(updated);
  });

  // Bulk sync reviews from client (reconciliation & auto-healing)
  app.post('/api/reviews/sync', (req, res) => {
    const clientReviews = req.body;
    if (!Array.isArray(clientReviews)) {
      return res.status(400).json({ error: 'Expected array of reviews' });
    }
    const current = readReviews();
    const merged = mergeListById(current, clientReviews);
    writeReviews(merged);
    res.json(merged);
  });

  // Database storage health & backup status
  app.get('/api/reviews/status', (req, res) => {
    const reviews = readReviews();
    const feedbacks = readTrustFeedbacks();
    res.json({
      status: 'healthy',
      reviewsCount: reviews.length,
      feedbacksCount: feedbacks.length,
      primaryFileExists: fs.existsSync(REVIEWS_FILE),
      backupVaultExists: fs.existsSync(REVIEWS_BACKUP_FILE),
      trustFileExists: fs.existsSync(TRUST_FEEDBACKS_FILE),
      trustBackupExists: fs.existsSync(TRUST_FEEDBACKS_BACKUP_FILE),
      timestamp: new Date().toISOString()
    });
  });

  // Update review (status, reply, content)
  app.patch('/api/reviews/:id', (req, res) => {
    const { id } = req.params;
    const { status, adminReply, likes } = req.body;
    const reviews = readReviews();

    const idx = reviews.findIndex((r) => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (status !== undefined) reviews[idx].status = status;
    if (adminReply !== undefined) reviews[idx].adminReply = adminReply;
    if (likes !== undefined) reviews[idx].likes = likes;

    writeReviews(reviews);
    res.json(reviews);
  });

  // Like review (+1)
  app.post('/api/reviews/:id/like', (req, res) => {
    const { id } = req.params;
    const reviews = readReviews();
    const idx = reviews.findIndex((r) => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const increment = req.body.delta !== undefined ? Number(req.body.delta) : 1;
    reviews[idx].likes = Math.max(0, (reviews[idx].likes || 0) + increment);
    writeReviews(reviews);
    res.json({ success: true, likes: reviews[idx].likes, reviews });
  });

  // Delete review
  app.delete('/api/reviews/:id', (req, res) => {
    const { id } = req.params;
    let reviews = readReviews();
    reviews = reviews.filter((r) => r.id !== id);
    writeReviews(reviews);
    res.json(reviews);
  });

  // --- TRUST BOX FEEDBACKS API ---
  app.get('/api/trust-feedbacks', (req, res) => {
    const feedbacks = readTrustFeedbacks();
    res.json(feedbacks);
  });

  app.post('/api/trust-feedbacks', (req, res) => {
    const feedbacks = readTrustFeedbacks();
    const cleanItem = {
      ...req.body,
      id: req.body.id || `fb-${Date.now()}`
    };
    const updated = mergeListById([cleanItem], feedbacks);
    writeTrustFeedbacks(updated);
    res.status(201).json(updated);
  });

  app.post('/api/trust-feedbacks/sync', (req, res) => {
    const clientFeedbacks = req.body;
    if (!Array.isArray(clientFeedbacks)) {
      return res.status(400).json({ error: 'Expected array of feedbacks' });
    }
    const current = readTrustFeedbacks();
    const merged = mergeListById(current, clientFeedbacks);
    writeTrustFeedbacks(merged);
    res.json(merged);
  });

  app.patch('/api/trust-feedbacks/:id', (req, res) => {
    const { id } = req.params;
    const feedbacks = readTrustFeedbacks();
    const idx = feedbacks.findIndex((f) => f.id === id);
    if (idx !== -1) {
      feedbacks[idx] = { ...feedbacks[idx], ...req.body };
      writeTrustFeedbacks(feedbacks);
    }
    res.json(feedbacks);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
