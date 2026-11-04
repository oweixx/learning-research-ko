<script setup>
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ReadingAfter from './components/ReadingAfter.vue'
import { useLearningStore } from './store.js'
const { state, storageError } = useLearningStore()
const readingStyle = computed(() => ({
  '--reading-font-size': state.fontSize + 'px'
}))
</script>
<template>
  <div :style="readingStyle">
    <DefaultTheme.Layout
      ><template #doc-after><ReadingAfter /></template
      ><template #layout-top
        ><div v-if="storageError" class="storage-alert" role="alert">
          {{ storageError }}
        </div></template
      ></DefaultTheme.Layout
    >
  </div>
</template>
