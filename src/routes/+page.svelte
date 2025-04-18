<script lang="ts">
  import Note from "$lib/note.svelte";
  import PomodoroTimer from "$lib/pomodoro-timer.svelte";
  import cn from "clsx";

  // import { Tween } from "svelte/motion";
  // import { cubicOut } from "svelte/easing";
  // import { useDebounce } from "runed";
  // import { onDestroy } from "svelte";
  // let isCursorOnBottom = $state(false);
  // const BOTTOM_BAR_HEIGHT = 80;

  // const pad = new Tween(BOTTOM_BAR_HEIGHT, { duration: 360, easing: cubicOut });
  // $effect(() => {
  //   pad.set(isFocus ? 0 : BOTTOM_BAR_HEIGHT);
  // });
  // Watch this mouse handler, it may affect performance
  // const handleMouseMove = useDebounce((e: MouseEvent) => {
  //   const windowHeight = window.innerHeight;
  //   isCursorOnBottom = windowHeight - e.clientY <= BOTTOM_BAR_HEIGHT;
  // }, 140);

  // if (typeof window !== "undefined") {
  //   window.addEventListener("mousemove", handleMouseMove);
  // }
  // onDestroy(() => {
  //   window.removeEventListener("mousemove", handleMouseMove);
  // });

  let isFocus = $state(false);
</script>

<!-- Draggable title bar -->
<div class="drag-region" data-tauri-drag-region></div>

<!-- Main content -->
<div class="max-w-2xl mx-auto h-screen">
  <Note {isFocus} />

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
      class="transition-colors dark:hover:bg-zinc-800 py-1.5 px-4 rounded-full opacity-75 hover:opacity-100"
    >
      new note
    </button>
  </div>
</div>

<!-- <style>
  @reference "tailwindcss";
</style> -->
