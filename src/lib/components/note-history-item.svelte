<script lang="ts">
  import { Trash2 } from "@lucide/svelte";
  import type { NoteHistoryItemStore } from "$lib/store/note-history-store";
  import Dialog from "./dialog.svelte";

  interface Props {
    item: NoteHistoryItemStore;
    onSelect: (item: NoteHistoryItemStore) => void;
    onDelete: (id: string) => void;
  }
  let { item, onSelect, onDelete }: Props = $props();
</script>

<button
  class="relative block w-full mb-2 py-2 pl-3 pr-6 rounded-lg transition-colors bg-zinc-700 hover:bg-zinc-600 text-zinc-100 hover:text-white text-xs text-left group"
  onclick={() => onSelect(item)}
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <span
    class="absolute top-1 right-1 opacity-10 hover:opacity-100 transition-opacity cursor-pointer text-red-500 p-1"
    title="Delete note"
    role="button"
    tabindex="0"
  >
    <Dialog title="Confirmation">
      {#snippet trigger()}
        <Trash2 class="h-[14px] w-[14px]" />
      {/snippet}

      {#snippet content()}
        <div class="text-sm text-center">
          Are you sure you want to delete this note? This action cannot be undone.

          <div class="mt-6 text-center">
            <button
              class="rounded-md bg-red-500 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              onclick={() => onDelete(item.id)}
            >
              Delete
            </button>
          </div>
        </div>
      {/snippet}
    </Dialog>
  </span>

  <div class="truncate mb-2">
    {item.content.slice(0, 100).replace(/(<([^>]+)>)/gi, " ")}
  </div>
  <div class="text-zinc-300 text-[10px]">
    {new Date(item.createdAt)
      .toLocaleString()
      .split(":")
      .slice(0, 2)
      .join(":")
      .replace(", ", " - ")}
  </div>
</button>
