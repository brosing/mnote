<script lang="ts">
  import { onMount } from "svelte";
  import Quill from "quill";
  // @ts-ignore
  import QuillMarkdown from "quilljs-markdown";
  import "quill/dist/quill.snow.css";
  import { watch } from "runed";

  let quill: Quill;
  let editorElement: HTMLDivElement;

  interface Props {
    content: string;
    handleContent: (content: string) => void;
    noteID: string;
  }

  let { content, handleContent, noteID }: Props = $props()

  onMount(() => {
    quill = new Quill(editorElement, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ 'align': [] }],
          [{ list: "ordered" }, { list: "bullet" }, { 'list': 'check' }],
          ["link", "image"],
          // [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'color': [] }, { 'background': [] }],
          ["clean"],
        ],
      },
    });
    // Initialize markdown support
    new QuillMarkdown(quill);
    if (content) {
      quill.root.innerHTML = content;
    }

    // Handle content changes
    quill.on("text-change", (delta) => {
      handleContent(quill.root.innerHTML);

      // Uncomment if the feature toggle ready
      // Listen for checkbox changes in ordered lists
      // if (
      //   delta.ops?.some(
      //     (op) =>
      //       op.attributes?.list === "checked" ||
      //       op.attributes?.list === "unchecked"
      //   )
      // ) {
      //   const contents = quill.getContents();
      //   contents.ops.forEach((op, index) => {
      //     if (
      //       op.attributes?.list === "checked" ||
      //       op.attributes?.list === "unchecked"
      //     ) {
      //       // Update the content state when checkboxes change
      //       // Get all list items
      //       const listItems = Array.from(quill.root.querySelectorAll("li"));
      //       // Sort items - unchecked first, then checked
      //       listItems.sort((a, b) => {
      //         const aChecked = a.getAttribute("data-list") === "checked";
      //         const bChecked = b.getAttribute("data-list") === "checked";
      //         return aChecked === bChecked ? 0 : aChecked ? 1 : -1;
      //       });
      //       // Reorder the items in the DOM
      //       const list = listItems[0].parentElement;
      //       listItems.forEach((item) => list?.appendChild(item));
      //       // Update content state
      //       content.current = quill.root.innerHTML;
      //     }
      //   });
      // } else {
      //   content.current = quill.root.innerHTML;
      // }
    });

    const toolbar = quill.getModule("toolbar");
    quill.on("selection-change", (range) => {
      (toolbar as any).container.classList.toggle(
        "hidden",
        range.length === 0
      );
    });

    quill.clipboard.addMatcher(Node.ELEMENT_NODE, function (_, delta) {
      delta.ops = delta.ops.map((_) => ({
        insert: _.insert,
      }));
      return delta;
    });
  });

  $effect(() => {
    // handle empty content cause by new note
    if (content.trim() === '') {
      quill.root.innerHTML = '';
    }
  })

  watch(() => noteID, () => {
    quill.root.innerHTML = content;
    quill.blur();
  });
</script>

<div bind:this={editorElement}></div>

<style>
  @reference "tailwindcss";

  :global(.ql-editor::-webkit-scrollbar) {
    display: none; /* Safari and Chrome */
  }
  :global(.ql-editor) {
    font-size: 1rem;
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    padding: 140px 0;
  }
  :global(.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label) {
    border: 0;
  }
  :global(.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options) {
    margin-top: 0.5rem;
    z-index: 1;
    border: 0;
    border-radius: 10px;
    padding: 0.5rem 1rem;
  }
  :global(.dark .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options) {
    @apply bg-zinc-800;
  }
  :global(
    .dark .ql-toolbar.ql-snow .ql-picker,
    .dark .ql-toolbar.ql-snow .ql-stroke
  ) {
    @apply text-zinc-400;
    @apply stroke-zinc-400;
  }
  :global(
    .dark .ql-toolbar.ql-snow .ql-fill,
    .dark .ql-toolbar.ql-snow .ql-stroke.ql-fill
  ) {
    @apply fill-zinc-400;
  }
  :global(.ql-editor ol) {
    padding-left: 0.5rem;
  }
  :global(.ql-editor ol > [data-list="bullet"] > .ql-ui::before) {
    margin-left: -1.8rem;
    cursor: none;
  }
  :global(.ql-editor ol > [data-list="checked"] > .ql-ui),
  :global(.ql-editor ol > [data-list="unchecked"] > .ql-ui) {
    color: unset;
    cursor: none;
  }
  /* Generate indentation levels from 1-16, with 1.5rem increment for each level */
  :global(.ql-editor li[class*="ql-indent-"]:not(.ql-direction-rtl)) {
    padding-left: calc(1.5rem * var(--indent-level));
  }

  :global(.ql-editor li.ql-indent-1:not(.ql-direction-rtl)) { --indent-level: 2; }
  :global(.ql-editor li.ql-indent-2:not(.ql-direction-rtl)) { --indent-level: 3; }
  :global(.ql-editor li.ql-indent-3:not(.ql-direction-rtl)) { --indent-level: 4; }
  :global(.ql-editor li.ql-indent-4:not(.ql-direction-rtl)) { --indent-level: 5; }
  :global(.ql-editor li.ql-indent-5:not(.ql-direction-rtl)) { --indent-level: 6; }
  :global(.ql-editor li.ql-indent-6:not(.ql-direction-rtl)) { --indent-level: 7; }
  :global(.ql-editor li.ql-indent-7:not(.ql-direction-rtl)) { --indent-level: 8; }
  :global(.ql-editor li.ql-indent-8:not(.ql-direction-rtl)) { --indent-level: 9; }
  :global(.ql-editor li.ql-indent-9:not(.ql-direction-rtl)) { --indent-level: 10; }
  :global(.ql-editor li.ql-indent-10:not(.ql-direction-rtl)) { --indent-level: 11; }

  :global(.ql-container.ql-snow) {
    border: none;
    font-family: inherit;
  }
  :global(.ql-toolbar.ql-snow) {
    border: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    padding-top: 2rem;
    z-index: 1;
    @apply bg-zinc-50;
    /* @apply hidden; */
  }
  :global(.dark .ql-toolbar.ql-snow) {
    @apply bg-zinc-900;
  }
  :global(.ql-toolbar.ql-snow .ql-formats) {
    display: flex;
    flex-wrap: nowrap;
  }
  :global(.ql-toolbar.ql-snow.hidden) {
    display: none;
  }
</style>
