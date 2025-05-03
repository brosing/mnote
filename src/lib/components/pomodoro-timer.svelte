<script lang="ts">
  import { onDestroy } from "svelte";
  import { Slider } from "bits-ui";
  import cn from "clsx";

  type Props = {
    isFocus: boolean;
    onDone: () => void;
  };

  let { isFocus = $bindable(), onDone }: Props = $props();

  const DEFAULT_FOCUS_TIME = 25 * 60;
  const MAX_FOCUS_TIME = 40 * 60;
  const MIN_FOCUS_TIME = 1 * 60;
  let focusTime = $state(DEFAULT_FOCUS_TIME);
  let lastFocusTime = $state(DEFAULT_FOCUS_TIME);

  let interval: ReturnType<typeof setInterval> | null = null;

  function formatTime(n: number) {
    return n.toString().padStart(2, "0");
  }

  function tick() {
    if (focusTime <= 0) {
      isFocus = false;
      clearInterval(interval!);
      interval = null;
      onDone();
      focusTime = lastFocusTime;
      return;
    }
    focusTime -= 1;
  }

  function toggleTimer() {
    if (focusTime <= 0) {
      resetTimer();
      return;
    }

    if (isFocus) {
      isFocus = false;
      clearInterval(interval!);
      interval = null;
    } else {
      isFocus = true;
      if (!interval) {
        interval = setInterval(() => {
          tick();
        }, 1000);
      }
    }
  }

  function resetTimer() {
    isFocus = false;
    clearInterval(interval!);
    interval = null;
    focusTime = DEFAULT_FOCUS_TIME;
  }

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  let minutes = $derived(Math.floor(focusTime / 60));
  let seconds = $derived(focusTime % 60);
</script>

<div class="flex gap-3 items-center w-60">
  <button
    class={`z-20 flex-center cursor-pointer transition-transform active:scale-110 font-mono ${isFocus ? "opacity-100" : "opacity-80"}`}
    onclick={toggleTimer}
    ondblclick={resetTimer}
    tabindex="0"
    aria-label="Pomodoro Timer"
  >
    {formatTime(minutes)}:{formatTime(seconds)}
  </button>

  <Slider.Root
    type="single"
    value={focusTime}
    onValueChange={(val) => {
      if (isFocus) return;
      focusTime = val;
      lastFocusTime = val;
    }}
    max={MAX_FOCUS_TIME}
    min={MIN_FOCUS_TIME}
    step={60}
    disabled={isFocus}
    class={cn(
      "relative flex w-full touch-none select-none items-center",
      isFocus ? "opacity-100" : "opacity-50"
    )}
  >
    {#snippet children()}
      <span
        class="bg-zinc-500 dark:bg-zinc-500 choco:bg-amber-800/30 relative h-1 w-full grow cursor-pointer overflow-hidden rounded-full"
      >
        <Slider.Range class="bg-zinc-900 dark:bg-zinc-100 choco:bg-amber-800 absolute h-full" />
      </span>
      <Slider.Thumb
        index={0}
        disabled={isFocus}
        class={cn(
          "dark:bg-zinc-100 block size-[8px] rounded-full transition-transform hover:scale-[1.2] active:scale-[1.2] focus:outline-none",
          isFocus ? "cursor-not-allowed" : "cursor-pointer"
        )}
      />
    {/snippet}
  </Slider.Root>
</div>
