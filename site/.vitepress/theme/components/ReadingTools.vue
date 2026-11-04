<script setup>
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData } from 'vitepress'
import catalog from '../../../.generated/catalog.json'
import { useLearningStore } from '../store.js'
import Icon from './Icon.vue'
const { frontmatter } = useData()
const { state, ready, updateDoc } = useLearningStore()
const doc = computed(() =>
  catalog.find((d) => d.id === frontmatter.value.pageId)
)
const record = computed(() => state.docs[doc.value?.id] || {})
let timer
function visit() {
  if (doc.value && ready.value) {
    state.lastRead = doc.value.id
    updateDoc(doc.value.id, {})
  }
}
function saveHeading() {
  if (!doc.value) return
  const headings = [
    ...document.querySelectorAll('.vp-doc h2[id], .vp-doc h3[id]')
  ]
  const heading =
    headings.filter((h) => h.getBoundingClientRect().top < 180).at(-1)?.id || ''
  if (heading !== record.value.heading) updateDoc(doc.value.id, { heading })
}
function onScroll() {
  clearTimeout(timer)
  timer = setTimeout(saveHeading, 400)
}
watch(
  () => frontmatter.value.pageId,
  () => {
    clearTimeout(timer)
    visit()
  }
)
onMounted(() => {
  visit()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  window.removeEventListener('scroll', onScroll)
})
</script>
<template>
  <div v-if="doc" class="reading-tools">
    <div class="reading-meta">
      <span
        class="status-badge"
        :class="doc.status"
        :title="doc.statusDescription"
        >{{ doc.statusLabel }}</span
      ><span class="reading-time"
        ><Icon name="clock" :size="15" />약 {{ doc.minutes }}분</span
      ><a :href="doc.sourceUrl" target="_blank" rel="noopener noreferrer"
        >원문 보기 <Icon name="external" :size="13"
      /></a>
    </div>
    <div class="reading-controls">
      <div>
        <button
          :disabled="!ready"
          :aria-pressed="!!record.bookmarked"
          @click="updateDoc(doc.id, { bookmarked: !record.bookmarked })"
        >
          <Icon name="bookmark" :size="17" />{{
            record.bookmarked ? '북마크됨' : '북마크'
          }}</button
        ><button
          :disabled="!ready"
          :aria-pressed="!!record.read"
          @click="updateDoc(doc.id, { read: !record.read })"
        >
          <Icon name="check" :size="17" />{{
            record.read ? '읽음 표시됨' : '읽음 표시'
          }}
        </button>
      </div>
      <label
        >글자 크기
        <select v-model.number="state.fontSize" aria-label="본문 글자 크기">
          <option :value="16">작게</option>
          <option :value="18">기본</option>
          <option :value="20">크게</option>
          <option :value="22">더 크게</option>
        </select></label
      >
    </div>
    <p class="scope-description">{{ doc.statusDescription }}</p>
  </div>
</template>
