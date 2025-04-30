<script lang="ts">
  import { ToggleGroup, Accordion } from "bits-ui";
  import { PersistedState } from "runed";
  import cn from "clsx";

  import CaretDown from "phosphor-svelte/lib/CaretDown";

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
  type Theme = "Light" | "Dark" | "Chocolate";
  const themes: Theme[] = ["Light", "Dark", "Chocolate"];
  let selectedTheme = new PersistedState<Theme>(
    "dark-mode",
    "Light",
    {
      storage: "local",
    }
  );

  $effect(() => {
    if (selectedTheme.current === "Light") {
      document.documentElement.classList.remove("choco");
      document.documentElement.classList.remove("dark");
    }
    if (selectedTheme.current === "Dark") {
      document.documentElement.classList.remove("choco");
      document.documentElement.classList.add("dark");
    }
    if (selectedTheme.current === "Chocolate") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("choco");
    }
  });

  let fontFamily = new PersistedState('custom-font', "inter", {
    storage: "local",
  })

  $effect(() => {
    document.documentElement.setAttribute("data-font", fontFamily.current);
  });

  const fontSizes = ["14px", "16px", "18px", "20px"];
  let fontSize = new PersistedState('font-size', "16px", {
    storage: "local",
  });

  $effect(() => {
    document.documentElement.style.setProperty('--base-font-size', fontSize.current);
  });

  const lineHeights = [
    { value: "leading-none", label: "None (1)" },
    { value: "leading-tight", label: "Tight (1.25)" },
    { value: "leading-snug", label: "Snug (1.375)" },
    { value: "leading-normal", label: "Normal (1.5)" },
    { value: "leading-relaxed", label: "Relaxed (1.625)" },
    { value: "leading-loose", label: "Loose (2)" }
  ];
  let lineHeight = new PersistedState('line-height', "leading-normal", {
    storage: "local",
  });

  $effect(() => {
    document.documentElement.setAttribute("data-leading", lineHeight.current);
  });
</script>

<h3 class="font-bold mb-4 flex items-center justify-between">Options</h3>

<Accordion.Root class="w-full" type="multiple">
  <Accordion.Item value="dark-mode" class="group border-b border-zinc-200 dark:border-zinc-700 choco:border-amber-700/10 text-sm">
    <Accordion.Header>
      <Accordion.Trigger
        class="flex w-full flex-1 items-center justify-between p-4 pr-2 font-medium data-[state=open]:pb-3 transition-all [&[data-state=open]>span>svg]:rotate-180"
      >
        <span class="w-full text-left font-normal">Dark Mode</span>
        <span class="capitalize mr-2">{selectedTheme.current}</span>
        <span
          class="hover:bg-zinc-200 dark:hover:bg-zinc-600 choco:hover:bg-amber-700/10 shrink-0 inline-flex size-6 items-center justify-center rounded-lg bg-transparent"
        >
          <CaretDown class="size-4 transition-transform duration-200" />
        </span>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
      class="overflow-hidden px-4 pt-0 pb-4"
    >
      <ToggleGroup.Root
        bind:value={selectedTheme.current}
        type="single"
        class="h-10 flex items-center gap-x-1 p-1 bg-zinc-200 choco:bg-amber-700/20 rounded-full text-sm"
      >
        {#each themes as theme}
          <ToggleGroup.Item
            aria-label={theme}
            value={theme}
            class="rounded-full hover:bg-zinc-300 choco:hover:bg-amber-700/20 h-8 flex-auto items-center justify-center transition-all active:scale-[0.98]
            data-[state=on]:font-medium data-[state=on]:bg-zinc-700 choco:data-[state=on]:bg-amber-900/90 data-[state=on]:text-white data-[state=off]:text-zinc-600 choco:data-[state=off]:text-amber-900/80"
            disabled={selectedTheme.current === theme}
          >
            {theme}
          </ToggleGroup.Item>
        {/each}
      </ToggleGroup.Root>
    </Accordion.Content>
  </Accordion.Item>

  <Accordion.Item value="font-family" class="group border-b border-zinc-200 dark:border-zinc-700 choco:border-amber-700/10 text-sm">
    <Accordion.Header>
      <Accordion.Trigger
        class="flex w-full flex-1 items-center justify-between p-4 pr-2 font-medium data-[state=open]:pb-2 transition-all [&[data-state=open]>span>svg]:rotate-180"
      >
        <span class="w-full text-left font-normal">Font Family</span>
        <span class="capitalize mr-2">{fontFamily.current}</span>
        <span
          class="hover:bg-zinc-200 dark:hover:bg-zinc-600 choco:hover:bg-amber-700/10 shrink-0 inline-flex size-6 items-center justify-center rounded-lg bg-transparent"
        >
          <CaretDown class="size-4 transition-transform duration-200" />
        </span>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
      class="overflow-hidden p-0 pb-2"
    >
      <div class="h-32 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <div class="flex flex-col items-stretch p-0 overflow-y-auto h-full touch-pan-y snap-y snap-mandatory no-scrollbar">
          <div class="flex-shrink-0 h-7"></div>
          {#each fonts as font}
            <button
              class={cn(
                'flex-shrink-0 h-7 flex items-center justify-center snap-center transition-all cursor-pointer',
                fontFamily.current === font ? 'font-semibold text-foreground' : 'text-zinc-600 dark:text-zinc-300 choco:text-amber-800/80',
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

  <Accordion.Item value="font-size" class="group border-b border-zinc-200 dark:border-zinc-700 choco:border-amber-700/10 text-sm">
    <Accordion.Header>
      <Accordion.Trigger
        class="flex w-full flex-1 items-center justify-between p-4 pr-2 font-medium data-[state=open]:pb-2 transition-all [&[data-state=open]>span>svg]:rotate-180"
      >
        <span class="w-full text-left font-normal">Font Size</span>
        <span class="mr-2 text-nowrap">{
          fontSize.current === "14px" ? "Small" :
          fontSize.current === "16px" ? "Normal" :
          fontSize.current === "18px" ? "Big" :
          fontSize.current === "20px" ? "Biggest" :
          fontSize.current
        }</span>
        <span
          class="hover:bg-zinc-200 dark:hover:bg-zinc-600 choco:hover:bg-amber-700/10 shrink-0 inline-flex size-6 items-center justify-center rounded-lg bg-transparent"
        >
          <CaretDown class="size-4 transition-transform duration-200" />
        </span>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
      class="overflow-hidden p-0 pb-2"
    >
      <div class="h-20 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <div class="flex flex-col items-stretch p-0 overflow-y-auto h-full touch-pan-y snap-y snap-mandatory no-scrollbar">
          <div class="flex-shrink-0 h-7"></div>
          {#each fontSizes as size}
            <button
              class={cn(
                'flex-shrink-0 h-7 flex items-center justify-center snap-center transition-all cursor-pointer',
                fontSize.current === size ? 'font-semibold text-foreground' : 'text-zinc-600 dark:text-zinc-300 choco:text-amber-800/80',
              )}
              onclick={() => (fontSize.current = size)}
            >
              {size.replace("px", " pixel")}
            </button>
          {/each}
          <div class="flex-shrink-0 h-7"></div>
        </div>
      </div>
    </Accordion.Content>
  </Accordion.Item>

  <Accordion.Item value="line-height" class="group border-b border-zinc-200 dark:border-zinc-700 choco:border-amber-700/10 text-sm">
    <Accordion.Header>
      <Accordion.Trigger
        class="flex w-full flex-1 items-center justify-between p-4 pr-2 font-medium data-[state=open]:pb-2 transition-all [&[data-state=open]>span>svg]:rotate-180"
      >
        <span class="w-full text-left font-normal">Line Height</span>
        <span class="mr-2 text-nowrap">{lineHeights.find(h => h.value === lineHeight.current)?.label.split(' ')[0] || "Normal"}</span>
        <span
          class="hover:bg-zinc-200 dark:hover:bg-zinc-600 choco:hover:bg-amber-700/10 shrink-0 inline-flex size-6 items-center justify-center rounded-lg bg-transparent"
        >
          <CaretDown class="size-4 transition-transform duration-200" />
        </span>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
      class="overflow-hidden p-0 pb-2"
    >
      <div class="h-28 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <div class="flex flex-col items-stretch p-0 overflow-y-auto h-full touch-pan-y snap-y snap-mandatory no-scrollbar">
          <div class="flex-shrink-0 h-7"></div>
          {#each lineHeights as height}
            <button
              class={cn(
                'flex-shrink-0 h-7 flex items-center justify-center snap-center transition-all cursor-pointer',
                lineHeight.current === height.value ? 'font-semibold text-foreground' : 'text-zinc-600 dark:text-zinc-300 choco:text-amber-800/80',
              )}
              onclick={() => (lineHeight.current = height.value)}
            >
              {height.label}
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
  :global([data-font="poppins"]) {
    --font-family: "Poppins", sans-serif;
  }
  :global(:root) {
    font-size: var(--base-font-size, 16px);
  }

  :global([data-leading="leading-none"]) {
    line-height: 1;
  }
  :global([data-leading="leading-tight"]) {
    line-height: 1.25;
  }
  :global([data-leading="leading-snug"]) {
    line-height: 1.375;
  }
  :global([data-leading="leading-normal"]) {
    line-height: 1.5;
  }
  :global([data-leading="leading-relaxed"]) {
    line-height: 1.625;
  }
  :global([data-leading="leading-loose"]) {
    line-height: 2;
  }
</style>
