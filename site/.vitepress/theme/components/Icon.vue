<script setup>
defineProps({
  name: { type: String, default: 'arrow' },
  size: { type: Number, default: 22 }
})
const paths = {
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  check: 'm5 12 4 4L19 6',
  book: 'M3 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H3V4Zm18 0h-6a3 3 0 0 0-3 3v14a4 4 0 0 1 4-3h5V4Z',
  bookmark: 'M6 3h12v18l-6-4-6 4V3Z',
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  compass: 'M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0ZM16 8l-3 5-5 3 3-5 5-3Z',
  flask: 'M9 3h6m-5 0v6L4 19c-.6 1 0 2 1 2h14c1 0 1.6-1 1-2L14 9V3M7 15h10',
  pen: 'm15 4 5 5M4 15 16 3a2 2 0 0 1 3 0l2 2a2 2 0 0 1 0 3L9 20l-6 1 1-6Z',
  message: 'M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 0 1 19 0ZM7 9h10M7 13h7',
  leaf: 'M20 3C4 2 1 12 7 18s16 1 13-15ZM4 21 15 10',
  layers: 'm12 2 10 5-10 5L2 7l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5',
  spark: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z',
  info: 'M12 8h.01M12 11v6M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0Z',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  plus: 'M12 4v16M4 12h16',
  close: 'm6 6 12 12M6 18 18 6',
  clock: 'M12 7v5l3 2M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0Z',
  external: 'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7'
}
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.arrow" />
  </svg>
</template>
