import { openDB } from 'idb';

const DATABASE_NAME = 'citycare';
const DATABASE_VERSION = 1;
// nama tabel di indexedDB
const OBJECT_STORE_NAME = 'saved-reports';

// membuka koneksi database atau membuatnya jika belum ada
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  // Fungsi upgrade dijalankan saat:
  // 1. Database baru pertama kali dibuat
  // 2. Versi database dinaikkan
  upgrade: (database) => {
    // Membuat object store baru bernama 'saved-reports' jika belum ada
    // Object store ini menyimpan data dengan key unik bernama 'id'
    database.createObjectStore(OBJECT_STORE_NAME, {
      keyPath: 'id', // primary key
    });
  },
});

const Database = {
  // Method async untuk menyimpan (insert/update) satu data report ke dalam object store
  async putReport(report) {
    // Cek apakah objek report memiliki properti 'id'
    // Jika tidak, lemparkan error karena 'id' dibutuhkan sebagai primary key
    if (!Object.hasOwn(report, 'id')) {
      throw new Error('id wajib untuk di simpan');
    }

    // Tunggu sampai koneksi ke database (dbPromise) selesai
    // Kemudian simpan (put) data report ke dalam object store 'saved-reports'
    // Jika data dengan 'id' yang sama sudah ada, maka akan diperbarui (overwrite)
    return (await dbPromise).put(OBJECT_STORE_NAME, report);
  },

  // ambil id laporan
  async getReportById(id) {
    if (!id) {
      throw Error('id is required');
    }

    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  // ambil semua laporan tersimpan
  async getAllReports() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async removeReport(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default Database;
