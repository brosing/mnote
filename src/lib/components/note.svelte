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
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
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

    const toolbar = quill.getModule('toolbar');
    console.log('toolbar: ', toolbar);

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
  :global(.ql-editor ol) {
    padding-left: 0;
    margin-top: 0.4rem;
  }
  :global(.ql-editor .ql-snow .ql-picker.ql-expanded .ql-picker-options) {
    margin-top: 2rem;
    z-index: 1;
    border-radius: 10px;
    padding: 0.5rem 1rem;
  }
  :global(.ql-editor li) {
    display: flex;
    flex-direction: row;
    padding-left: 0;
  }
  :global(.ql-editor li > .ql-ui) {
    position: relative;
    height: 1.6rem;
    width: 1.6rem;
    flex-shrink: 0;
  }
  :global(.ql-editor li > .ql-ui:before) {
    position: absolute;
    z-index: 0;
    @apply text-zinc-600;
  }
  :global(.ql-editor li[data-list="ordered"] > .ql-ui:before) {
    margin-left: 0;
    text-align: center;
  }
  :global(.ql-editor li[data-list="bullet"] > .ql-ui:before) {
    margin-left: 0;
    text-align: center;
    font-size: 1.6rem;
    margin-top: -0.4rem;
    margin-left: -0.3rem;
  }
  :global(.ql-editor li[data-list="checked"] > .ql-ui:before),
  :global(.ql-editor li[data-list="unchecked"] > .ql-ui:before) {
    font-size: 1.6rem;
    margin-top: -0.6rem;
    margin-left: -0.6rem;
  }
  :global(.ql-container.ql-snow) {
    border: none;
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
    z-index: 10;
    @apply bg-zinc-50;
    /* @apply rounded-lg shadow; */
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
