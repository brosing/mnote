<script lang="ts">
  import { onDestroy } from "svelte";

  type Props = {
    isFocus: boolean;
    focusTime: number;
    defaultFocusTime: number;
  };

  let {
    isFocus = $bindable(),
    focusTime = $bindable(),
    defaultFocusTime,
  }: Props = $props();

  let interval: ReturnType<typeof setInterval> | null = null;

  function formatTime(n: number) {
    return n.toString().padStart(2, "0");
  }

  function tick() {
    if (focusTime <= 0) {
      isFocus = false;
      clearInterval(interval!);
      interval = null;
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
    focusTime = defaultFocusTime;
  }

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  let minutes = $derived(Math.floor(focusTime / 60));
  let seconds = $derived(focusTime % 60);
</script>

<button
  class={`z-20 flex-center select-none cursor-pointer font-mono hover:opacity-100 ${isFocus ? "opacity-100" : "opacity-40"}`}
  onclick={toggleTimer}
  ondblclick={resetTimer}
  tabindex="0"
  aria-label="Pomodoro Timer"
>
  {formatTime(minutes)}:{formatTime(seconds)}
</button>
