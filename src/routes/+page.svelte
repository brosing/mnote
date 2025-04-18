<script lang="ts">
  import { Slider } from "bits-ui";
  import cn from "clsx";
  import Note from "$lib/note.svelte";
  import PomodoroTimer from "$lib/pomodoro-timer.svelte";
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

  const DEFAULT_FOCUS_TIME = 25 * 60;
  const MAX_FOCUS_TIME = 40 * 60;
  let isFocus = $state(false);
  let focusTime = $state(DEFAULT_FOCUS_TIME);
  // $inspect(focusTime);
</script>

<!-- Draggable title bar -->
<div class="drag-region" data-tauri-drag-region></div>

<!-- Main content -->
<div class="max-w-2xl mx-auto h-screen">
  <Note {isFocus} />

  <!-- Bottom menu: height & bottom position should follow BOTTOM_BAR_HEIGHT -->
  <div
    class={`
    fixed gap-4 inset-x-0 bottom-0 h-20 bg-zinc-50 dark:bg-zinc-900 
    transform duration-300 ease-in-out ${isFocus ? "opacity-0" : "opacity-100"} hover:opacity-100
    `}
  >
    <div class="flex h-full max-w-2xl mx-auto justify-between items-center p-4">
      <div class="flex gap-4 items-center w-60">
        <PomodoroTimer
          bind:isFocus
          bind:focusTime
          defaultFocusTime={DEFAULT_FOCUS_TIME}
        />

        <Slider.Root
          type="single"
          value={focusTime}
          onValueChange={(val) => {
            if (isFocus) return;
            focusTime = val;
          }}
          max={MAX_FOCUS_TIME}
          step={60}
          disabled={isFocus}
          class="relative flex w-full touch-none select-none items-center"
        >
          {#snippet children()}
            <span
              class="dark:bg-zinc-500 relative h-1 w-full grow cursor-pointer overflow-hidden rounded-full"
            >
              <Slider.Range class="dark:bg-zinc-100 absolute h-full" />
            </span>
            <Slider.Thumb
              index={0}
              disabled={isFocus}
              class={cn(
                "dark:bg-zinc-100 block size-[8px] rounded-full transition-transform hover:scale-[1.2] active:scale-[1.2] focus:outline-none",
                isFocus? "cursor-not-allowed" : "cursor-pointer"
              )}
            />
          {/snippet}
        </Slider.Root>
      </div>

      <button class="transition-colors dark:hover:bg-zinc-800 py-1.5 px-4 rounded-lg opacity-75 hover:opacity-100">
        new note
      </button>
    </div>
  </div>
</div>

<!-- <style>
  @reference "tailwindcss";
</style> -->
