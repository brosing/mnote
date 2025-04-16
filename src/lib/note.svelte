<!-- 
<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/quill@2.0.2/dist/quill.snow.css"
		crossorigin
	/>
</svelte:head> -->

<script lang="ts">
  import { onMount } from "svelte";
  import Quill, { Delta } from "quill";
  import QuillMarkdown from "quilljs-markdown";
  import "quill/dist/quill.bubble.css";

  let quillEditor: Quill;
  let editorElement: HTMLDivElement;

  export let content = "";

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
      quillEditor.root.innerHTML = content;
    }

    // Handle content changes
    quillEditor.on("text-change", () => {
      content = quillEditor.root.innerHTML;
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

  :global(.ql-editor) {
    font-size: 1rem;
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
