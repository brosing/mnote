import Database from '@tauri-apps/plugin-sql';

export type NoteHistoryItemStore = {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

const DB_PATH = 'sqlite:note-history.db';

function createNoteHistory() {
  let db: Database | null = null;

  async function getDb() {
    if (!db) {
      db = await Database.load(DB_PATH);
      // Create table if not exists
      await db.execute(`
        CREATE TABLE IF NOT EXISTS note_history (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          createdAt INTEGER NOT NULL,
          updatedAt INTEGER NOT NULL
        )
      `);
    }
    return db;
  }

  async function load() {
    const db = await getDb();
    const rows = await db.select<NoteHistoryItemStore[]>(
      'SELECT * FROM note_history ORDER BY createdAt DESC'
    );
    return rows;
  }

  async function get() {
    return load();
  }

  async function add(content: string) {
    const db = await getDb();
    const id = crypto.randomUUID();
    const createdAt = Date.now();
    const updatedAt = createdAt;
    await db.execute(
      'INSERT INTO note_history (id, content, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
      [id, content, createdAt, updatedAt]
    );
    return load();
  }

  async function update(id: string, newContent: string) {
    const db = await getDb();
    const updatedAt = Date.now();
    await db.execute(
      'UPDATE note_history SET content = ?, updatedAt = ? WHERE id = ?',
      [newContent, updatedAt, id]
    );
    return load();
  }

  async function clear() {
    const db = await getDb();
    await db.execute('DELETE FROM note_history');
    return [];
  }

  async function deleteById(id: string) {
    const db = await getDb();
    await db.execute('DELETE FROM note_history WHERE id = ?', [id]);
    return load();
  }

  async function deleteByIds(ids: string[]) {
    if (!ids.length) return load();
    const db = await getDb();
    const placeholders = ids.map(() => '?').join(',');
    await db.execute(
      `DELETE FROM note_history WHERE id IN (${placeholders})`,
      ids
    );
    return load();
  }

  return {
    load,
    get,
    add,
    update,
    clear,
    delete: deleteById,
    deleteMany: deleteByIds
  };
}

export const noteHistory = createNoteHistory();