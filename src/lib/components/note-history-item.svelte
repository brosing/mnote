<script lang="ts">
  import { Trash2 } from "@lucide/svelte";
  import { decode } from "html-entities";
  import cn from "clsx";
  import type { NoteHistoryItemStore } from "$lib/store/note-history-store";
  import Dialog from "./dialog.svelte";

  interface Props {
    item: NoteHistoryItemStore;
    onSelect: (item: NoteHistoryItemStore) => void;
    onDelete: (id: string) => void;
    isSelected: boolean;
  }
  let { item, onSelect, onDelete, isSelected }: Props = $props();
  const encodedContent = decode(item.content)
    .slice(0, 100)
    .replace(/(<([^>]+)>)/gi, " ")
    .trim();
  const parsedTime = new Date(item.createdAt)
    .toLocaleString()
    .split(":")
    .slice(0, 2)
    .join(":")
    .replace(", ", " - ");
</script>

<button
  class={cn(
    'relative block w-full mb-2 py-2 pl-3 pr-6 rounded-lg transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-600 text-xs text-left group',
     isSelected ? 'bg-zinc-300 dark:bg-zinc-600 border border-zinc-600 dark:border-zinc-300' : 'bg-zinc-200 dark:bg-zinc-700'
  )}
  onclick={() => onSelect(item)}
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <span
    class="absolute top-1 right-1 opacity-10 hover:opacity-100 transition-opacity cursor-pointer text-red-500 p-1"
    title="Delete note"
    role="button"
    tabindex="0"
    onclick={(e) => e.stopPropagation()}
  >
    <Dialog title="Confirmation">
      {#snippet trigger()}
        <Trash2 class="h-[14px] w-[14px]" />
      {/snippet}

      {#snippet content()}
        <div class="text-sm text-center">
          Are you sure you want to delete this note? This action cannot be
          undone.

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

  <div class="truncate mb-2 font-medium">
    {encodedContent || "(Empty)"}
  </div>
  <div class="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono">
    {parsedTime}
  </div>
</button>
