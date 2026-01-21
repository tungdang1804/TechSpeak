
/**
 * Audio Storage Service
 * Quản lý Persistent Cache sử dụng IndexedDB
 */

const DB_NAME = 'TechSpeakAudioDB';
const STORE_NAME = 'audio_blobs';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getCachedAudio = async (key: string): Promise<Uint8Array | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch { return null; }
};

export const setCachedAudio = async (key: string, data: Uint8Array): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(data, key);
  } catch (e) { 
    console.error("Audio Cache Save Failed", e); 
  }
};
