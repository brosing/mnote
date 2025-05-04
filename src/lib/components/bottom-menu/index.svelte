<script lang="ts">
  import cn from "clsx";
  import { fade } from "svelte/transition";
  import PomodoroTimer from "./pomodoro-timer.svelte";

  interface Props {
    isFocus: boolean;
    isSidebarOpen: boolean;
    onNewNote: () => void;
  }

  let { 
    isFocus = $bindable(),
    isSidebarOpen,
    onNewNote
  }: Props = $props();

  let showComplete = $state(false);
  
  function handlePomodoroComplete() {
    showComplete = true;
    setTimeout(() => {
      showComplete = false;
    }, 2000);
  }
</script>

<div
  class={cn(
    "fixed bottom-4 left-1/2 -translate-x-1/2 p-2 pl-6 shadow-xl overflow-y-auto no-scrollbar bg-white dark:bg-zinc-800 choco:bg-white before:absolute before:-inset-1 choco:before:bg-amber-600/40 before:rounded-full before:-z-10",
    "flex gap-6 justify-between items-center rounded-full transform duration-300 ease-in-out hover:opacity-100",
    isFocus || isSidebarOpen ? "opacity-0" : "opacity-100",
    showComplete && "scale-110"
  )}
>
  {#if showComplete}
    <div 
      class="absolute inset-0 flex items-center justify-center bg-green-500/20 dark:bg-green-500/30 choco:bg-green-500/50 backdrop-blur-sm rounded-full z-50"
      transition:fade={{ duration: 200 }}
    >
      <span class="text-lg font-bold text-green-700 dark:text-green-300">Done! 🎉</span>
    </div>
  {/if}
  
  <PomodoroTimer 
    bind:isFocus 
    onDone={handlePomodoroComplete}
  />

  <button
    class="py-2 px-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700 choco:hover:bg-amber-700/30 rounded-full opacity-90"
    onclick={onNewNote}
  >
    <span class="-mt-0.5 block text-nowrap font-medium">new note</span>
  </button>
</div>