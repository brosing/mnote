<script lang="ts">
  import { ToggleGroup, Accordion } from "bits-ui";
  import { PersistedState } from "runed";
  import cn from "clsx";

  import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
  import CaretDown from "phosphor-svelte/lib/CaretDown";
  import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";

  const fonts = [
    "system",
    "lato",
    "nunito",
    "manrope",
    "montserrat",
    "opensans",
    "inter",
    "roboto",
    "poppins",
  ];
  // const options = ["Dark Mode", "Font Family", "Font Size"];
  type Theme = "Light" | "Dark" | "Chocolate";
  const themes: Theme[] = ["Light", "Dark", "Chocolate"];
  let selectedTheme = new PersistedState<Theme>(
    "dark-mode",
    "Light",
    {
      storage: "local",
    }
  );
  let fontFamily = new PersistedState('custom-font', "system", {
    storage: "local",
  })

  $effect(() => {
    document.documentElement.setAttribute("data-font", fontFamily.current);
  });

  $effect(() => {
    if (selectedTheme.current === "Dark") {
      document.documentElement.classList.add("dark");
    }
    if (selectedTheme.current === "Light") {
      document.documentElement.classList.remove("dark");
    }
    if (selectedTheme.current === "Chocolate") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("chocolate");
    }
  });
</script>

<h3 class="font-bold mb-4 flex items-center justify-between">Options</h3>

<Accordion.Root class="w-full" type="multiple">
  <Accordion.Item value="dark-mode" class="group border-b border-zinc-200 dark:border-zinc-700 text-sm">
    <Accordion.Header>
      <Accordion.Trigger
        class="flex w-full flex-1 items-center justify-between p-4 pr-2 font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
      >
        <span class="w-full text-left font-normal">Dark Mode</span>
        <span class="capitalize mr-2">{selectedTheme.current}</span>
        <span
          class="hover:bg-zinc-200 dark:hover:bg-zinc-600 shrink-0 inline-flex size-6 items-center justify-center rounded-lg bg-transparent"
        >
          <CaretDown class="size-4 transition-transform duration-200" />
        </span>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
      class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden px-4 pt-0 pb-5"
    >
      <ToggleGroup.Root
        bind:value={selectedTheme.current}
        type="single"
        class="h-10 flex items-center gap-x-1 p-1 bg-zinc-200 rounded-full text-sm"
      >
        {#each themes as theme}
          <ToggleGroup.Item
            aria-label={theme}
            value={theme}
            class="rounded-full data-[state=on]:font-medium hover:bg-zinc-300 data-[state=on]:bg-zinc-700 data-[state=on]:text-zinc-100 data-[state=off]:text-zinc-600 h-8 flex-auto items-center justify-center transition-all active:scale-[0.98]"
            disabled={selectedTheme.current === theme}
          >
            {theme}
          </ToggleGroup.Item>
        {/each}
      </ToggleGroup.Root>
    </Accordion.Content>
  </Accordion.Item>

  <Accordion.Item value="font-family" class="group border-b border-zinc-200 dark:border-zinc-700 text-sm">
    <Accordion.Header>
      <Accordion.Trigger
        class="flex w-full flex-1 items-center justify-between p-4 pr-2 font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
      >
        <span class="w-full text-left font-normal">Font Family</span>
        <span class="capitalize mr-2">{fontFamily.current}</span>
        <span
          class="hover:bg-zinc-200 dark:hover:bg-zinc-600 shrink-0 inline-flex size-6 items-center justify-center rounded-lg bg-transparent"
        >
          <CaretDown class="size-4 transition-transform duration-200" />
        </span>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
      class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden px-4 pt-0 pb-5"
    >
      <div class="h-40 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <div class="flex flex-col items-stretch p-0 overflow-y-auto h-full touch-pan-y snap-y snap-mandatory no-scrollbar">
          <div class="flex-shrink-0 h-7"></div>
          {#each fonts as font}
            <button
              class={cn(
                'flex-shrink-0 h-7 flex items-center justify-center snap-center transition-all cursor-pointer',
                fontFamily.current === font ? 'font-semibold text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'
              )}
              onclick={() => (fontFamily.current = font)}
            >
              {font.charAt(0).toUpperCase() + font.slice(1)}
            </button>
          {/each}
          <div class="flex-shrink-0 h-7"></div>
        </div>
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>

<style>
  :global(body) {
    font-family: var(
      --font-family,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Open Sans",
      "Helvetica Neue",
      sans-serif
    );
  }

  :global([data-font="lato"]) {
    --font-family: "Lato", sans-serif;
  }
  :global([data-font="nunito"]) {
    --font-family: "Nunito", sans-serif;
  }
  :global([data-font="manrope"]) {
    --font-family: "Manrope", sans-serif;
  }
  :global([data-font="montserrat"]) {
    --font-family: "Montserrat", sans-serif;
  }
  :global([data-font="opensans"]) {
    --font-family: "Open Sans", sans-serif;
  }
  :global([data-font="inter"]) {
    --font-family: "Inter", sans-serif;
  }
  :global([data-font="roboto"]) {
    --font-family: "Roboto", sans-serif;
  }
</style>
