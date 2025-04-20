<script lang="ts">
  import cn from "clsx";
  import { onMount } from "svelte";
  import { PersistedState, useDebounce } from "runed";
  import Note from "$lib/components/note.svelte";
  import PomodoroTimer from "$lib/components/pomodoro-timer.svelte";
  import {
    noteHistory,
    type NoteHistoryItemStore,
  } from "$lib/store/note-history-store";
  import NoteHistoryItem from "$lib/components/note-history-item.svelte";

  const DEFAULT_ID = "NEW_NOTE";
  let isFocus = $state(false);
  let noteID = $state(DEFAULT_ID);
  let history = $state<NoteHistoryItemStore[]>([]);

  const noteText = new PersistedState("note", "", {
    storage: "local",
  });

  onMount(async () => {
    const loadedVal = await noteHistory.load();
    if (loadedVal) {
      history = loadedVal;
    }
  });

  const updateHistoryNote = useDebounce(async () => {
    history = await noteHistory.update(noteID, noteText.current);
  }, 1000);

  function handleContentNote(text: string) {
    noteText.current = text;
    updateHistoryNote();
  }

  function resetNote() {
    noteText.current = "";
    noteID = DEFAULT_ID;
  }

  async function handleNewNote() {
    if (!noteText.current.trim()) return;

    if (noteID === DEFAULT_ID) {
      history = await noteHistory.add(noteText.current);
    } else {
      history = await noteHistory.update(noteID, noteText.current);
    }
    resetNote();
  }

  function handleChangeNote(note: NoteHistoryItemStore) {
    noteID = note.id;
    noteText.current = note.content;
  }

  async function handleDeleteNote(id: string) {
    history = await noteHistory.delete(id);
    if (noteID === id) resetNote();
  }
</script>

<!-- Draggable title bar -->
<div class="drag-region" data-tauri-drag-region></div>

<!-- Container -->
<div class="flex gap-12 h-screen overflow-x-hidden">
  <!-- Folder & History dialog 336 = 320 + 16 -->
  <div class="flex-1 group relative">
    <div
      class={cn(
        "h-[calc(100%-52px)] w-80 absolute top-9 -left-80",
        isFocus ? "" : "group-hover:translate-x-[336px]",
        "bg-zinc-800 p-4 rounded-lg transition duration-200 ease-out z-10"
      )}
    >
      <h3 class="font-bold text-zinc-200 mb-3">History</h3>
      {#each history as item (item.id)}
        <NoteHistoryItem
          {item}
          onSelect={handleChangeNote}
          onDelete={handleDeleteNote}
        />
      {/each}
    </div>
  </div>

  <!-- Main content -->
  <div class="w-2xl h-screen">
    <Note
      content={noteText.current}
      handleContent={handleContentNote}
      {noteID}
    />

    <!-- Bottom menu: height & bottom position should follow BOTTOM_BAR_HEIGHT -->
    <div
      class={cn(
        "fixed bottom-3 left-1/2 -translate-x-1/2 p-4 pl-8 shadow-2xl",
        "flex gap-12 justify-between items-center bg-zinc-50 dark:bg-zinc-900",
        "rounded-full transform duration-300 ease-in-out hover:opacity-100",
        isFocus ? "opacity-0" : "opacity-100"
      )}
    >
      <PomodoroTimer bind:isFocus />

      <button
        class="transition-colors text-nowrap dark:hover:bg-zinc-800 py-1.5 px-4 rounded-full opacity-75 hover:opacity-100"
        onclick={handleNewNote}
      >
        new note
      </button>
    </div>
  </div>

  <!-- Options dialog -->
  <div class="flex-1 group relative">
    <div
      class={cn(
        "h-[calc(100%-52px)] w-80 absolute top-9 -right-80",
        isFocus ? "" : "group-hover:-translate-x-[336px]",
        "bg-zinc-800 p-4 rounded-lg transition duration-200 ease-out z-10"
      )}
    >
      Options
    </div>
  </div>
</div>

<!-- <style>
  @reference "tailwindcss";
</style> -->
