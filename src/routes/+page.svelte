<script lang="ts">
  import cn from "clsx";
  import { onMount } from "svelte";
  import { PersistedState, useDebounce } from "runed";
  import Note from "$lib/components/note.svelte";
  import PomodoroTimer from "$lib/components/pomodoro-timer.svelte";
  import {
    noteHistory,
    type NoteHistoryItem,
  } from "$lib/store/note-history-store";
  import { Trash2 } from "@lucide/svelte";

  let isFocus = $state(false);
  let noteID = $state("defaultID");
  let history = $state<NoteHistoryItem[]>([]);

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

  async function handleNewNote() {
    if (noteText.current.trim()) {
      history = await noteHistory.add(noteText.current);
      noteText.current = "";
    }
  }

  function handleChangeNote(note: NoteHistoryItem) {
    noteID = note.id;
    noteText.current = note.content;
  }

  async function handleDeleteNote(id: string) {
    history = await noteHistory.delete(id);
    // Optionally, reset noteID/noteText if the deleted note was selected
    if (noteID === id) {
      noteID = "";
      noteText.current = "";
    }
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
      <h3 class="font-bold text-zinc-200 mb-2">History</h3>
      {#each history as item (item.id)}
        <button
          class="relative block w-full mb-2 py-2 pl-3 pr-6 rounded-lg transition-colors bg-zinc-700 hover:bg-zinc-600 text-zinc-100 hover:text-white text-xs text-left group"
          onclick={() => handleChangeNote(item)}
        >
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <span
            class="absolute top-1 right-1 opacity-10 hover:opacity-100 transition-opacity cursor-pointer text-red-500 p-1"
            onclick={() => handleDeleteNote(item.id)}
            title="Delete note"
            role="button"
            tabindex="0"
          >
            <Trash2 class="h-[14px] w-[14px]" />
          </span>

          <div class="truncate mb-2">
            {item.content.slice(0, 100).replace(/(<([^>]+)>)/gi, "")}
          </div>
          <div class="text-zinc-300 text-[10px]">
            {new Date(item.createdAt).toLocaleString()}
          </div>
        </button>
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
