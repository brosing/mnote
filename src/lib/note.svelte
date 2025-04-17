<script lang="ts">
  import { onMount } from "svelte";
  import { PersistedState } from "runed";
  import Quill from "quill";
  // @ts-ignore
  import QuillMarkdown from "quilljs-markdown";
  import "quill/dist/quill.bubble.css";

  let quillEditor: Quill;
  let editorElement: HTMLDivElement;
  const content = new PersistedState('note', '');

  onMount(() => {
    quillEditor = new Quill(editorElement, {
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
    new QuillMarkdown(quillEditor);

    // Set initial content
    if (content) {
      quillEditor.root.innerHTML = content.current;
    }

    // Handle content changes
    quillEditor.on("text-change", () => {
      content.current = quillEditor.root.innerHTML;
    });
    quillEditor.clipboard.addMatcher(Node.ELEMENT_NODE, function (_, delta) {
      delta.ops = delta.ops.map((_) => ({
        insert: _.insert,
      }));
      return delta;
    });
    quillEditor.format('size', '20px');
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
    display: none;  /* Safari and Chrome */
  }
  :global(.ql-editor) {
    font-size: 1rem;
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
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
