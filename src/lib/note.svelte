<script lang="ts">
  import { onMount } from "svelte";
  import { PersistedState } from "runed";
  import Quill from "quill";
  // @ts-ignore
  import QuillMarkdown from "quilljs-markdown";
  import "quill/dist/quill.bubble.css";

  let quill: Quill;
  let editorElement: HTMLDivElement;
  const content = new PersistedState("note", "");

  onMount(() => {
    quill = new Quill(editorElement, {
      theme: "bubble",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    // Initialize markdown support
    new QuillMarkdown(quill);

    // Set initial content
    if (content) {
      quill.root.innerHTML = content.current;
    }

    // Handle content changes
    quill.on("text-change", () => {
      const selection = quill.getSelection();
      if (!selection || selection.length > 0) return;

      const [line] = quill.getLine(selection.index);
      const lineText = line?.domNode?.innerText || '';
      const isLineEmpty = lineText.trim() === '';

      if (isLineEmpty) {
        // Remove heading format by setting it to null (paragraph)
        quill.formatLine(selection.index, 1, 'header', false);
      }

      content.current = quill.root.innerHTML;
    });
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, function (_, delta) {
      delta.ops = delta.ops.map((_) => ({
        insert: _.insert,
      }));
      return delta;
    });
    quill.format("size", "20px");
  });
</script>

<div class="note-editor">
  <div bind:this={editorElement}></div>
</div>

<style>
  @reference "tailwindcss";

  .note-editor {
    @apply h-full w-full;
  }

  :global(.ql-editor::-webkit-scrollbar) {
    display: none; /* Safari and Chrome */
  }
  :global(.ql-editor) {
    font-size: 1rem;
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
  }
  :global(.ql-editor ol) {
    padding-left: 0;
  }
  :global(.ql-bubble .ql-picker.ql-expanded .ql-picker-options) {
    margin-top: 1rem;
    z-index: 1;
    border-radius: 10px;
    padding: 0.5rem 1rem;
  }
</style>
