import { load as loadStore, Store } from '@tauri-apps/plugin-store';

export type NoteHistoryItem = {
  id: string;
  content: string;
  createdAt: number;
};

const STORE_KEY = "NOTE_HISTORY"; 

function createNoteHistory() {
  let store: Store | null = null;

  async function load() {
    if (!store) {
      store = await loadStore('store.json');
    }
    let value = await store.get<NoteHistoryItem[]>(STORE_KEY);
    if (!value) {
      value = [];
      await store.set(STORE_KEY, value);
      await store.save();
    }
    return value;
  }

  async function get() {
    if (!store) {
      store = await loadStore('store.json');
    }
    return (await store.get<NoteHistoryItem[]>(STORE_KEY)) ?? [];
  }

  async function add(content: string) {
    const items = await get();
    const newItems = [
      {
        id: crypto.randomUUID(),
        content,
        createdAt: Date.now(),
      },
      ...items,
    ];
    if (!store) {
      throw new Error("store is not initialized");
    }
    await store.set(STORE_KEY, newItems);
    await store.save();
    return newItems;
  }

  async function update(id: string, newContent: string) {
    const items = await get();
    const newItems = items.map((item) =>
      item.id === id ? { ...item, content: newContent } : item
    );
    if (!store) {
      throw new Error("store is not initialized");
    }
    await store.set(STORE_KEY, newItems);
    await store.save();
    return newItems;
  }

  async function clear() {
    if (!store) {
      throw new Error("store is not initialized");
    }
    await store.set(STORE_KEY, []);
    await store.save();
    return [];
  }

  async function deleteById(id: string) {
    const items = await get();
    const newItems = items.filter(item => item.id !== id);
    if (!store) {
      throw new Error("store is not initialized");
    }
    await store.set(STORE_KEY, newItems);
    await store.save();
    return newItems;
  }

  return {
    load,
    get,
    add,
    update,
    clear,
    delete: deleteById,
  };
}

export const noteHistory = createNoteHistory();