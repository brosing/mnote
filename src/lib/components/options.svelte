<script lang="ts">
  import { Label, Switch } from "bits-ui";
  import { PersistedState } from "runed";
  
  const isDarkMode = new PersistedState("dark-mode", true, { storage: "local" });

  $effect(() => {
    if (isDarkMode.current) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });
</script>

<h3 class="font-bold mb-4 flex items-center justify-between">Options</h3>

<div class="flex items-center justify-between space-x-3">
  <Label.Root for="dark-mode" class="text-sm font-medium">
    Dark Mode
  </Label.Root>
  <Switch.Root
    id="dark-mode"
    name="hello"
    class={`
      focus-visible:ring-white focus-visible:ring-offset-zinc-900 data-[state=checked]:bg-white data-[state=unchecked]:bg-zinc-400
      dark:data-[state=checked]:bg-zinc-300 focus-visible:outline-hidden peer inline-flex h-[24px] min-h-[24px] w-[40px] shrink-0 cursor-pointer items-center rounded-full
      transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
    `}
    bind:checked={isDarkMode.current}
  >
    <Switch.Thumb
      class="bg-zinc-600 dark:border-zinc-900/30 dark:bg-white pointer-events-none block size-[24px] shrink-0 rounded-full transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 dark:border dark:data-[state=unchecked]:border"
    />
  </Switch.Root>
</div>