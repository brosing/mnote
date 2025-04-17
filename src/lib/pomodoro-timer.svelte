<script lang="ts">
  import { onDestroy } from 'svelte';

  let { isFocus = $bindable() } = $props();
  let minutes = $state(25);
  let seconds = $state(0);
  let interval: ReturnType<typeof setInterval> | null = null;

  function formatTime(n: number) {
    return n.toString().padStart(2, '0');
  }

  function tick() {
    if (minutes === 0 && seconds === 0) {
      isFocus = false;
      clearInterval(interval!);
      interval = null;
      return;
    }
    if (seconds === 0) {
      minutes -= 1;
      seconds = 59;
    } else {
      seconds -= 1;
    }
  }

  function toggleTimer() {
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
    minutes = 25;
    seconds = 0;
  }

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<button
  class={`z-20 flex-center select-none cursor-pointer font-mono hover:opacity-100 ${isFocus ? 'opacity-100' : 'opacity-40'}`}
  onclick={toggleTimer}
  ondblclick={resetTimer}
  tabindex="0"
  aria-label="Pomodoro Timer"
>
  {formatTime(minutes)}:{formatTime(seconds)}
</button>