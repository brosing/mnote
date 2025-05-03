<script lang="ts">
  import cn from "clsx";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { PersistedState, useDebounce } from "runed";
  import Note from "$lib/components/note.svelte";
  import PomodoroTimer from "$lib/components/pomodoro-timer.svelte";
  import {
    noteHistory,
    type NoteHistoryItemStore,
  } from "$lib/store/note-history-store";
  import NoteHistory from "$lib/components/note-history.svelte";
  import Options from "$lib/components/options.svelte";
  import Dialog from "$lib/components/dialog.svelte";
  import NoteSearch from "$lib/components/note-search.svelte";

  const DEFAULT_ID = "NEW_NOTE";
  const EMPTY_CONTENT = "<p><br></p>";

  const noteID = new PersistedState("note-id", DEFAULT_ID, {
    storage: "local",
  });
  const noteText = new PersistedState("note-content", "", { storage: "local" });

  let history = $state<NoteHistoryItemStore[]>([]);
  let isFocus = $state(false);
  let isSidebarOpen = $state(false);
  let isFindNoteOpen = $state(false);

  const handleKeydown = (e: KeyboardEvent) => {
    // Check for Cmd/Ctrl + F
    if ((e.metaKey || e.ctrlKey) && e.key === "f") {
      e.preventDefault();
      isFindNoteOpen = !isFindNoteOpen;
    }
  };

  onMount(() => {
    noteHistory.load().then((value) => {
      if (value) history = value;
    });

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  const updateHistoryNote = useDebounce(async () => {
    history = await noteHistory.update(noteID.current, noteText.current);
  }, 1000);

  function resetNote() {
    noteText.current = "";
    noteID.current = DEFAULT_ID;
  }

  function handleContentNote(text: string) {
    if (noteText.current === text) return;
    noteText.current = text;
    updateHistoryNote();
  }

  async function handleNewNote() {
    if (!noteText.current.trim().replace(EMPTY_CONTENT, "")) return;

    if (noteID.current === DEFAULT_ID) {
      history = await noteHistory.add(noteText.current);
    } else {
      history = await noteHistory.update(noteID.current, noteText.current);
    }
    resetNote();
  }

  async function handleChangeNote(note: NoteHistoryItemStore) {
    if (
      noteID.current === DEFAULT_ID &&
      noteText.current.trim().replace(EMPTY_CONTENT, "")
    ) {
      history = await noteHistory.add(noteText.current);
    }

    noteID.current = note.id;
    noteText.current = note.content;
  }

  async function handleDeleteNote(id: string) {
    history = await noteHistory.delete(id);
    if (noteID.current === id) resetNote();
  }
</script>

<!-- Draggable title bar -->
<div class="drag-region" data-tauri-drag-region></div>

<!-- Find Note -->
<Dialog bind:open={isFindNoteOpen}>
  {#snippet content()}
    <NoteSearch
      {history}
      onSelectNote={(note) => {
        handleChangeNote(note);
        isFindNoteOpen = false;
      }}
    />
  {/snippet}
</Dialog>

<!-- Container -->
<div class="flex gap-12 h-screen overflow-x-hidden">
  {#if isSidebarOpen}
    <div
      transition:fade={{ duration: 200 }}
      class="fixed inset-0 bg-black/35 backdrop-blur-sm z-10"
    ></div>
  {/if}

  <!-- Folder & History dialog 336 = 320 + 16 -->
  <div
    class="flex-1 group relative z-20"
    role="dialog"
    tabindex="0"
    aria-label="Note history sidebar"
    onmouseenter={() => !isFocus && (isSidebarOpen = true)}
    onmouseleave={() => (isSidebarOpen = false)}
  >
    <div
      class={cn(
        "h-[calc(100%-52px)] w-[340px] absolute top-9 -left-[340px] overflow-y-auto no-scrollbar",
        "bg-zinc-100 dark:bg-zinc-800 choco:bg-amber-100 p-4 rounded-lg transition duration-200 ease-out",
        isFocus ? "" : "group-hover:translate-x-[356px]",
        isSidebarOpen ? "shadow-2xl" : ""
      )}
    >
      <NoteHistory
        {history}
        noteID={noteID.current}
        {handleChangeNote}
        {handleDeleteNote}
      />
    </div>
  </div>

  <!-- Main content -->
  <div class="w-[600px] h-screen">
    <Note
      content={noteText.current}
      handleContent={handleContentNote}
      noteID={noteID.current}
    />

    <!-- Bottom menu: height & bottom position should follow BOTTOM_BAR_HEIGHT -->
    <!-- adding before to handle chocolate variant that need to have opacity on the background -->
    <div
      class={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 py-2 pl-6 pr-2 shadow-xl overflow-y-auto no-scrollbar bg-white dark:bg-zinc-800 choco:bg-white before:absolute before:-inset-1 choco:before:bg-amber-600/40 before:rounded-full before:-z-10",
        "flex gap-10 justify-between items-center rounded-full transform duration-300 ease-in-out hover:opacity-100",
        isFocus || isSidebarOpen ? "opacity-0" : "opacity-100"
      )}
    >
      <PomodoroTimer bind:isFocus />

      <button
        class="transition-colors text-nowrap hover:bg-zinc-100 dark:hover:bg-zinc-700 choco:hover:bg-amber-700/10 py-1.5 px-4 rounded-full"
        onclick={handleNewNote}
      >
        new note
      </button>
    </div>
  </div>

  <!-- Options dialog -->
  <div
    class="flex-1 group relative z-20"
    role="dialog"
    tabindex="0"
    aria-label="Option sidebar"
    onmouseenter={() => !isFocus && (isSidebarOpen = true)}
    onmouseleave={() => (isSidebarOpen = false)}
  >
    <div
      class={cn(
        "h-[calc(100%-52px)] w-[340px] absolute top-9 -right-[340px]",
        "bg-zinc-100 dark:bg-zinc-800 choco:bg-amber-100 p-4 rounded-lg transition duration-200 ease-out",
        isFocus ? "" : "group-hover:-translate-x-[356px]",
        isSidebarOpen ? "shadow-2xl" : ""
      )}
    >
      <Options />
    </div>
  </div>
</div>

<!-- <style>
  @reference "tailwindcss";
</style> -->
