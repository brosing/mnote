<script lang="ts">
  import cn from "clsx";
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';
  import { PersistedState, useDebounce } from "runed";
  import { Label, Switch } from "bits-ui";
  import Note from "$lib/components/note.svelte";
  import PomodoroTimer from "$lib/components/pomodoro-timer.svelte";
  import {
    noteHistory,
    type NoteHistoryItemStore,
  } from "$lib/store/note-history-store";
  import NoteHistoryItem from "$lib/components/note-history-item.svelte";

  const DEFAULT_ID = "NEW_NOTE";
  const EMPTY_CONTENT = "<p><br></p>";
  let isFocus = $state(false);
  let history = $state<NoteHistoryItemStore[]>([]);
  let sortOrder = $state<"created-newest" | "created-oldest" | "updated-newest">("updated-newest");
  let isSidebarOpen = $state(false);
  let isDarkMode = new PersistedState("dark-mode", true, { storage: "local" });
  const noteID = new PersistedState("note-id", DEFAULT_ID, {
    storage: "local",
  });
  const noteText = new PersistedState("note-content", "", { storage: "local" });

  $effect(() => {
    if (isDarkMode.current) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  onMount(async () => {
    const loadedVal = await noteHistory.load();
    if (loadedVal) {
      history = loadedVal;
    }
  });

  const updateHistoryNote = useDebounce(async () => {
    history = await noteHistory.update(noteID.current, noteText.current);
  }, 1000);

  function handleContentNote(text: string) {
    if (noteText.current === text) return;
    noteText.current = text;
    updateHistoryNote();
  }

  function resetNote() {
    noteText.current = "";
    noteID.current = DEFAULT_ID;
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

  function toggleSortOrder() {
    if (sortOrder === "created-newest") sortOrder = "created-oldest";
    else if (sortOrder === "created-oldest") sortOrder = "updated-newest";
    else sortOrder = "created-newest";
  }
</script>

<!-- Draggable title bar -->
<div class="drag-region" data-tauri-drag-region></div>

<!-- Container -->
<div class="flex gap-12 h-screen overflow-x-hidden">
  {#if isSidebarOpen}
    <div transition:fade={{ duration: 200 }} class="fixed inset-0 bg-black/35 backdrop-blur-sm z-10"></div>
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
        "h-[calc(100%-52px)] w-80 absolute top-9 -left-80 overflow-y-auto no-scrollbar",
        isFocus ? "" : "group-hover:translate-x-[336px]",
        "bg-zinc-100 dark:bg-zinc-800 shadow-2xl p-4 rounded-lg transition duration-200 ease-out"
      )}
    >
      <h3 class="font-bold mb-4 flex items-center justify-between">
        History
        <button
          class="ml-2 px-2 py-1 rounded-lg font-medium text-xs hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
          onclick={toggleSortOrder}
        >
          {sortOrder === "created-newest" ? "Created ↓" : null}
          {sortOrder === "created-oldest" ? "Created ↑" : null}
          {sortOrder === "updated-newest" ? "Updated ↓" : null}
        </button>
      </h3>
      {#each [...history].sort((a, b) => {
        if (sortOrder === "created-newest") return b.createdAt - a.createdAt;
        if (sortOrder === "created-oldest") return a.createdAt - b.createdAt;
        return b.updatedAt - a.updatedAt;
      }) as item (item.id)}
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
      noteID={noteID.current}
    />

    <!-- Bottom menu: height & bottom position should follow BOTTOM_BAR_HEIGHT -->
    <div
      class={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 py-2 pl-6 pr-2 shadow-xl overflow-y-auto no-scrollbar bg-white dark:bg-zinc-800",
        "flex gap-10 justify-between items-center rounded-full transform duration-300 ease-in-out hover:opacity-100",
        isFocus || isSidebarOpen ? "opacity-0" : "opacity-100"
      )}
    >
      <PomodoroTimer bind:isFocus />

      <button
        class="transition-colors text-nowrap hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 py-1.5 px-4 rounded-full"
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
        "h-[calc(100%-52px)] w-80 absolute top-9 -right-80",
        isFocus ? "" : "group-hover:-translate-x-[336px]",
        "bg-zinc-100 dark:bg-zinc-800 shadow-2xl p-4 rounded-lg transition duration-200 ease-out"
      )}
    >
      <h3 class="font-bold mb-4 flex items-center justify-between">Options</h3>

      <div class="flex items-center justify-between space-x-3">
        <Label.Root for="dark-mode" class="text-sm font-medium">
          Dark Mode
        </Label.Root>
        <Switch.Root
          id="dark-mode"
          name="hello"
          class={`
            focus-visible:ring-white focus-visible:ring-offset-zinc-900 data-[state=checked]:bg-white data-[state=unchecked]:bg-zinc-400
            dark:data-[state=checked]:bg-zinc-300 focus-visible:outline-hidden peer inline-flex h-[24px] min-h-[24px] w-[40px] shrink-0 cursor-pointer items-center rounded-full
            transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          `}
          bind:checked={isDarkMode.current}
        >
          <Switch.Thumb
            class="bg-zinc-600 dark:border-zinc-900/30 dark:bg-white pointer-events-none block size-[24px] shrink-0 rounded-full transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 dark:border dark:data-[state=unchecked]:border"
          />
        </Switch.Root>
      </div>
    </div>
  </div>
</div>

<!-- <style>
  @reference "tailwindcss";
</style> -->
