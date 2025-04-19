import { writable } from "svelte/store";

export type NoteHistoryItem = {
  id: string;
  content: string;
  createdAt: number;
};

function createNoteHistory() {
  // TODO store to tauri storage
  const { subscribe, set, update } = writable<NoteHistoryItem[]>([]);

  return {
    subscribe,
    add: (content: string) =>
      update((items) => [
        {
          id: crypto.randomUUID(),
          content,
          createdAt: Date.now(),
        },
        ...items,
      ]),
    update: (id: string, newContent: string) =>
      update((items) =>
        items.map((item) =>
          item.id === id ? { ...item, content: newContent } : item
        )
      ),
    clear: () => set([]),
  };
}

export const noteHistory = createNoteHistory();