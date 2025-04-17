<script lang="ts">
  import Note from "$lib/note.svelte";
  import PomodoroTimer from "$lib/pomodoro-timer.svelte";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { useDebounce } from "runed";
  import { onDestroy } from "svelte";

  let isFocus = $state(false);
  let isCursorOnBottom = $state(false);

  const pad = new Tween(64, { duration: 360, easing: cubicOut });
  $effect(() => {
    pad.set(isFocus ? 0 : 64);
  });

  // Watch this mouse handler, it may affect performance
  const handleMouseMove = useDebounce((e: MouseEvent) => {
    const threshold = 64;
    const windowHeight = window.innerHeight;
    isCursorOnBottom = windowHeight - e.clientY <= threshold;
  }, 140)

  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", handleMouseMove);
  }
  onDestroy(() => {
    window.removeEventListener("mousemove", handleMouseMove);
  });
</script>

<!-- Draggable title bar -->
<div class="drag-region" data-tauri-drag-region></div>

<!-- Main content -->
<div
  class="max-w-2xl mx-auto h-screen px-4"
  style="padding-top:{pad.current}px; padding-bottom:{pad.current}px;"
>
  <Note />

  <!-- Bottom menu  -->
  <div
    class={`
    fixed inset-x-0 h-16 p-4 flex justify-center items-center bg-zinc-50 dark:bg-zinc-900 
    transform duration-300 ease-in-out ${isFocus && !isCursorOnBottom ? "-bottom-16 opacity-0" : "bottom-0 opacity-100"}
    `}
  >
    <PomodoroTimer bind:isFocus />
  </div>
</div>

<!-- <style>
  @reference "tailwindcss";
</style> -->
