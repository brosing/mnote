<script lang="ts">
  import { X } from "phosphor-svelte";
  import { Dialog, Separator } from "bits-ui";
  import type { Snippet } from "svelte";

  let {
    content,
    title,
    trigger,
    open = $bindable()
  }: {
    content: Snippet
    title?: string
    trigger?: Snippet
    open?: boolean
  } = $props();
</script>
 
<Dialog.Root open={open} onOpenChange={val => (open = val)}>
  {#if trigger}
    <Dialog.Trigger>
      {@render trigger()}
    </Dialog.Trigger>
  {/if}
  <Dialog.Portal>
    <Dialog.Overlay
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
    />
    <!-- data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 -->
    <Dialog.Content
      class="rounded-xl bg-background p-6 fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] md:max-w-[480px] translate-x-[-50%] translate-y-[-50%]"
    >
      <Dialog.Title
        class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
        hidden={!title}
      >
        {title}
      </Dialog.Title>
      <Separator.Root class="bg-muted -mx-5 my-2 block h-[1px]" hidden={!title} />
      <Dialog.Description class="text-foreground-alt text-sm">
        {@render content()}
      </Dialog.Description>
      <!-- <Dialog.Close
        class="focus-visible:outline-hidden absolute right-5 top-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
      >
        <div>
          <X class="text-foreground size-5" />bg-muted -mx-5 my-2 block h-[1px]bg-muted -mx-5 my-2 block h-[1px]
          <span class="sr-only">Close</span>
        </div>
      </Dialog.Close> -->
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>