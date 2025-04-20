<script lang="ts">
  import { Trash2 } from "@lucide/svelte";
  import type { NoteHistoryItemStore } from "$lib/store/note-history-store";

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
    onclick={(e) => {
      e.stopPropagation();
      onDelete(item.id);
    }}
    title="Delete note"
    role="button"
    tabindex="0"
  >
    <Trash2 class="h-[14px] w-[14px]" />
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
