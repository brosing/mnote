<script lang="ts">
  import { ListChecks } from "phosphor-svelte";
  import cn from "clsx";
  import type { NoteHistoryItemStore } from "$lib/store/note-history-store";
  import NoteHistoryItem from "./note-history-item.svelte";
  import Dialog from "./dialog.svelte";

  type SortOrder = "created-newest" | "created-oldest" | "updated-newest";

  interface Props {
    history: NoteHistoryItemStore[];
    noteID: string;
    handleChangeNote: (note: NoteHistoryItemStore) => void;
    handleDeleteNotes: (id: string | string[]) => void;
  }

  let { history, noteID, handleChangeNote, handleDeleteNotes }: Props =
    $props();
  let sortOrder = $state<SortOrder>("updated-newest");
  let isSelectionMode = $state(false);
  let selectedItems = $state<string[]>([]);

  function toggleSortOrder() {
    if (sortOrder === "created-newest") sortOrder = "created-oldest";
    else if (sortOrder === "created-oldest") sortOrder = "updated-newest";
    else sortOrder = "created-newest";
  }

  function toggleSelectionMode() {
    isSelectionMode = !isSelectionMode;
    if (!isSelectionMode) {
      selectedItems = [];
    }
  }

  function toggleItemSelection(id: string) {
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter((item) => item !== id);
    } else {
      selectedItems = [...selectedItems, id];
    }
  }
</script>

<div class="mb-4 flex items-center justify-between">
  <div class="flex gap-3">
    <h3 class="font-bold">History</h3>

    <button
      class={cn(
        "flex gap-1 items-center px-2 py-1 rounded-lg font-medium text-xs hover:bg-zinc-300 dark:hover:bg-zinc-600 choco:hover:bg-amber-700/20 transition",
        isSelectionMode && "bg-zinc-300 dark:bg-zinc-600 choco:bg-amber-700/20"
      )}
      onclick={toggleSelectionMode}
    >
      {#if isSelectionMode && selectedItems.length > 0}
        <div class="mx-1">
          {selectedItems.length}/{history.length}
        </div>
      {/if}
      <ListChecks size={14} class="inline-block" />
    </button>

    {#if isSelectionMode && selectedItems.length > 0}
      <Dialog title="Confirmation">
        {#snippet trigger()}
          <button
            class="p-2 rounded-lg font-medium text-white text-xs bg-red-500 dark:bg-red-600 transition"
          >
            Delete
          </button>
        {/snippet}

        {#snippet content()}
          <div class="text-sm text-center">
            Are you sure you want to delete some of those notes? <br />
            This action cannot be undone.

            <div class="mt-6 text-center">
              <button
                class="rounded-md bg-red-500 px-6 py-2 font-semibold text-white hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                onclick={() => {
                  handleDeleteNotes(selectedItems);
                  toggleSelectionMode();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        {/snippet}
      </Dialog>
    {/if}
  </div>

  <button
    class="ml-2 px-2 py-1 rounded-lg font-medium text-xs hover:bg-zinc-300 dark:hover:bg-zinc-600 choco:hover:bg-amber-700/20 transition"
    onclick={toggleSortOrder}
  >
    {sortOrder === "created-newest" ? "Created ↓" : null}
    {sortOrder === "created-oldest" ? "Created ↑" : null}
    {sortOrder === "updated-newest" ? "Updated ↓" : null}
  </button>
</div>
{#each [...history].sort((a, b) => {
  if (sortOrder === "created-newest") return b.createdAt - a.createdAt;
  if (sortOrder === "created-oldest") return a.createdAt - b.createdAt;
  return b.updatedAt - a.updatedAt;
}) as item (item.id)}
  <NoteHistoryItem
    {item}
    onSelect={handleChangeNote}
    onDelete={handleDeleteNotes}
    isNoteSelected={item.id === noteID}
    {isSelectionMode}
    isItemSelected={selectedItems.includes(item.id)}
    onToggleSelection={toggleItemSelection}
  />
{/each}
