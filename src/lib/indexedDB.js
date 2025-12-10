// IndexedDB для локального хранения данных студентов

const DB_NAME = 'StudentManagementDB';
const DB_VERSION = 1;

// Названия хранилищ
const STORES = {
  APPLICATIONS: 'applications',
  MILITARY_RECORDS: 'military_records',
};

let db = null;

/**
 * Инициализация базы данных
 */
export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Создаем хранилище для заявок
      if (!database.objectStoreNames.contains(STORES.APPLICATIONS)) {
        const applicationStore = database.createObjectStore(STORES.APPLICATIONS, {
          keyPath: 'id',
          autoIncrement: true,
        });
        // Индексы для быстрого поиска
        applicationStore.createIndex('lastName', 'lastName', { unique: false });
        applicationStore.createIndex('firstName', 'firstName', { unique: false });
        applicationStore.createIndex('faculty', 'faculty', { unique: false });
        applicationStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Создаем хранилище для военных учетов
      if (!database.objectStoreNames.contains(STORES.MILITARY_RECORDS)) {
        const militaryStore = database.createObjectStore(STORES.MILITARY_RECORDS, {
          keyPath: 'id',
          autoIncrement: true,
        });
        // Индексы для быстрого поиска
        militaryStore.createIndex('lastName', 'lastName', { unique: false });
        militaryStore.createIndex('firstName', 'firstName', { unique: false });
        militaryStore.createIndex('organization', 'organization', { unique: false });
        militaryStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

/**
 * Получить экземпляр базы данных
 */
async function getDB() {
  if (!db) {
    await initDB();
  }
  return db;
}

// ============= ЗАЯВКИ (APPLICATIONS) =============

/**
 * Добавить заявку
 */
export async function addApplication(data) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.APPLICATIONS], 'readwrite');
    const store = transaction.objectStore(STORES.APPLICATIONS);
    const dataWithTimestamp = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const request = store.add(dataWithTimestamp);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Получить все заявки
 */
export async function getAllApplications() {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.APPLICATIONS], 'readonly');
    const store = transaction.objectStore(STORES.APPLICATIONS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Получить заявку по ID
 */
export async function getApplicationById(id) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.APPLICATIONS], 'readonly');
    const store = transaction.objectStore(STORES.APPLICATIONS);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Обновить заявку
 */
export async function updateApplication(id, data) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.APPLICATIONS], 'readwrite');
    const store = transaction.objectStore(STORES.APPLICATIONS);
    const dataWithTimestamp = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    const request = store.put(dataWithTimestamp);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Удалить заявку
 */
export async function deleteApplication(id) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.APPLICATIONS], 'readwrite');
    const store = transaction.objectStore(STORES.APPLICATIONS);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Поиск заявок по фамилии
 */
export async function searchApplicationsByLastName(lastName) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.APPLICATIONS], 'readonly');
    const store = transaction.objectStore(STORES.APPLICATIONS);
    const index = store.index('lastName');
    const request = index.getAll(IDBKeyRange.only(lastName));

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ============= ВОЕННЫЕ УЧЕТЫ (MILITARY RECORDS) =============

/**
 * Добавить военный учет
 */
export async function addMilitaryRecord(data) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.MILITARY_RECORDS], 'readwrite');
    const store = transaction.objectStore(STORES.MILITARY_RECORDS);
    const dataWithTimestamp = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const request = store.add(dataWithTimestamp);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Получить все военные учеты
 */
export async function getAllMilitaryRecords() {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.MILITARY_RECORDS], 'readonly');
    const store = transaction.objectStore(STORES.MILITARY_RECORDS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Получить военный учет по ID
 */
export async function getMilitaryRecordById(id) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.MILITARY_RECORDS], 'readonly');
    const store = transaction.objectStore(STORES.MILITARY_RECORDS);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Обновить военный учет
 */
export async function updateMilitaryRecord(id, data) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.MILITARY_RECORDS], 'readwrite');
    const store = transaction.objectStore(STORES.MILITARY_RECORDS);
    const dataWithTimestamp = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    const request = store.put(dataWithTimestamp);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Удалить военный учет
 */
export async function deleteMilitaryRecord(id) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.MILITARY_RECORDS], 'readwrite');
    const store = transaction.objectStore(STORES.MILITARY_RECORDS);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Поиск военных учетов по фамилии
 */
export async function searchMilitaryRecordsByLastName(lastName) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.MILITARY_RECORDS], 'readonly');
    const store = transaction.objectStore(STORES.MILITARY_RECORDS);
    const index = store.index('lastName');
    const request = index.getAll(IDBKeyRange.only(lastName));

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ============= УТИЛИТЫ =============

/**
 * Очистить все данные (для тестирования)
 */
export async function clearAllData() {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      [STORES.APPLICATIONS, STORES.MILITARY_RECORDS],
      'readwrite'
    );

    transaction.objectStore(STORES.APPLICATIONS).clear();
    transaction.objectStore(STORES.MILITARY_RECORDS).clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Получить статистику базы данных
 */
export async function getDBStats() {
  const [applications, militaryRecords] = await Promise.all([
    getAllApplications(),
    getAllMilitaryRecords(),
  ]);

  return {
    totalApplications: applications.length,
    totalMilitaryRecords: militaryRecords.length,
    totalRecords: applications.length + militaryRecords.length,
  };
}
