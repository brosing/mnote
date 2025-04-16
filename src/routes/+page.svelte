<script lang="ts">
  import Note from '$lib/note.svelte';
  
  let noteContent = '';
</script>

<!-- Draggable title bar -->
<div class="drag-region" data-tauri-drag-region></div>

<!-- Main content -->
<div class="max-w-2xl mx-auto h-screen py-16 px-4">
  <Note bind:content={noteContent} />
</div>

<style>
  @reference "tailwindcss";

  :root {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
    @apply text-zinc-600;
    @apply bg-zinc-50;
  }

  .flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .drag-region {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 28px; /* Standard height for macOS title bar */
    -webkit-app-region: drag; /* Makes the region draggable */
    background: transparent; /* Transparent background */
  }

  @media (prefers-color-scheme: dark) {
    :root {
      color: white;
      background: #212121;
    }
  }
</style>
