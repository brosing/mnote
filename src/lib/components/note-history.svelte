<script lang="ts">
  import type { NoteHistoryItemStore } from "$lib/store/note-history-store";
  import NoteHistoryItem from "./note-history-item.svelte";

  type SortOrder = "created-newest" | "created-oldest" | "updated-newest";

  interface Props {
    history: NoteHistoryItemStore[];
    noteID: string;
    handleChangeNote: (note: NoteHistoryItemStore) => void;
    handleDeleteNote: (id: string) => void;
  }

  let { history, noteID, handleChangeNote, handleDeleteNote }: Props = $props();
  let sortOrder = $state<SortOrder>("updated-newest");
  
  function toggleSortOrder() {
    if (sortOrder === "created-newest") sortOrder = "created-oldest";
    else if (sortOrder === "created-oldest") sortOrder = "updated-newest";
    else sortOrder = "created-newest";
  }
</script>

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
    isSelected={item.id === noteID}
  />
{/each}