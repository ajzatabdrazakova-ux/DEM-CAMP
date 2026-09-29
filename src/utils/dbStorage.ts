import { FeedbackSubmission } from '../types';
import { StudentReviewItem } from '../components/StudentFeedbackTemplate';

const DB_NAME = 'DemKopuroPlatformDB';
const DB_VERSION = 1;
const STORE_REVIEWS = 'student_reviews';
const STORE_FEEDBACKS = 'trust_feedbacks';

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_REVIEWS)) {
          db.createObjectStore(STORE_REVIEWS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_FEEDBACKS)) {
          db.createObjectStore(STORE_FEEDBACKS, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB could not be opened, using local storage fallback');
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB error:', e);
      resolve(null);
    }
  });
}

/**
 * Merge multiple lists of objects with unique IDs without losing any records.
 * If duplicate IDs exist, properties like adminReply, likes, status are preserved/merged.
 */
export function mergeUniqueById<T extends { id: string }>(...lists: (T[] | undefined | null)[]): T[] {
  const map = new Map<string, T>();

  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (!item || !item.id) continue;
      const existing = map.get(item.id);
      if (!existing) {
        map.set(item.id, { ...item });
      } else {
        // Merge properties intelligently
        map.set(item.id, {
          ...existing,
          ...item,
          // Preserve higher likes
          likes: Math.max((existing as any).likes || 0, (item as any).likes || 0),
          // Preserve adminReply if present in either
          adminReply: (item as any).adminReply || (existing as any).adminReply,
          // Keep completed or accepted status over received
          status:
            (item as any).status === 'accepted' || (item as any).status === 'implemented' || (item as any).status === 'resolved'
              ? (item as any).status
              : (existing as any).status || (item as any).status
        });
      }
    }
  }

  return Array.from(map.values());
}

/**
 * Persist student reviews to IndexedDB
 */
export async function saveStudentReviewsToIDB(reviews: StudentReviewItem[]): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_REVIEWS, 'readwrite');
      const store = tx.objectStore(STORE_REVIEWS);

      for (const item of reviews) {
        if (item && item.id) {
          store.put(item);
        }
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Retrieve student reviews from IndexedDB
 */
export async function getStudentReviewsFromIDB(): Promise<StudentReviewItem[]> {
  const db = await openDatabase();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_REVIEWS, 'readonly');
      const store = tx.objectStore(STORE_REVIEWS);
      const req = store.getAll();

      req.onsuccess = () => {
        resolve(Array.isArray(req.result) ? req.result : []);
      };
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

/**
 * Persist trust feedbacks to IndexedDB
 */
export async function saveTrustFeedbacksToIDB(feedbacks: FeedbackSubmission[]): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_FEEDBACKS, 'readwrite');
      const store = tx.objectStore(STORE_FEEDBACKS);

      for (const item of feedbacks) {
        if (item && item.id) {
          store.put(item);
        }
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Retrieve trust feedbacks from IndexedDB
 */
export async function getTrustFeedbacksFromIDB(): Promise<FeedbackSubmission[]> {
  const db = await openDatabase();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_FEEDBACKS, 'readonly');
      const store = tx.objectStore(STORE_FEEDBACKS);
      const req = store.getAll();

      req.onsuccess = () => {
        resolve(Array.isArray(req.result) ? req.result : []);
      };
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}
