<script lang="ts">
  import { useDebounce } from "runed";
  import type { NoteHistoryItemStore } from "$lib/store/note-history-store";
  import { selectFirstLine } from "$lib/utils/selector";

  let {
    history,
    onSelectNote,
  }: {
    history: NoteHistoryItemStore[];
    onSelectNote: (note: NoteHistoryItemStore) => void;
  } = $props();

  let searchText = $state("");
  let filteredHistory = $state<NoteHistoryItemStore[]>([]);

  const handleSearch = useDebounce((text: string) => {
    if (!text.trim()) {
      filteredHistory = [];
      return;
    }
    
    filteredHistory = history.filter(note => {
      const firstLine = selectFirstLine(note.content)
      return firstLine.toLowerCase().includes(text.toLowerCase());
    });
  }, 300);

  function handleSearchInput(e: Event) {
    const input = e.target as HTMLInputElement;
    searchText = input.value;
    handleSearch(searchText);
  }
</script>

<div class="flex flex-col gap-2">
  <input 
    type="search" 
    class="w-full h-10 focus:outline-none px-3" 
    placeholder="Search within first paragraph of the note"
    value={searchText}
    oninput={handleSearchInput}
  />
  {#if searchText && filteredHistory.length > 0}
    <div class="max-h-[320px] overflow-y-auto">
      {#each filteredHistory as note}
        <button
          class="w-full rounded-xl text-left p-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 choco:hover:bg-amber-700/30"
          onclick={() => {
            onSelectNote(note);
            searchText = "";
            filteredHistory = [];
          }}
        >
          {selectFirstLine(note.content)}
        </button>
      {/each}
    </div>
  {:else if searchText}
    <div class="px-3 py-2 text-zinc-500">
      No matching notes found
    </div>
  {/if}
</div>