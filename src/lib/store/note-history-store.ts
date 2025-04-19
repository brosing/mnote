import { writable } from "svelte/store";

export type NoteHistoryItem = {
  id: string;
  content: string;
  createdAt: number;
};

function createNoteHistory() {
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
    clear: () => set([]),
  };
}

export const noteHistory = createNoteHistory();