<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import catalog from '../../../.generated/catalog.json'
import { categories, statusLabels } from '../../../data/learning.mjs'
import { searchDocuments } from '../../../lib/search.mjs'
import Icon from './Icon.vue'
import DocCard from './DocCard.vue'
const query = ref(''),
  topic = ref('all'),
  status = ref('all')
function loadUrl() {
  const p = new URLSearchParams(location.search)
  query.value = p.get('q') || ''
  topic.value = categories.some((c) => c.id === p.get('topic'))
    ? p.get('topic')
    : 'all'
  status.value = Object.hasOwn(statusLabels, p.get('status'))
    ? p.get('status')
    : 'all'
}
onMounted(() => {
  loadUrl()
  window.addEventListener('popstate', loadUrl)
})
onBeforeUnmount(() => {
  if (typeof window !== 'undefined')
    window.removeEventListener('popstate', loadUrl)
})
function syncUrl() {
  const params = new URLSearchParams()
  if (query.value) params.set('q', query.value)
  if (topic.value !== 'all') params.set('topic', topic.value)
  if (status.value !== 'all') params.set('status', status.value)
  history.replaceState(
    history.state,
    '',
    location.pathname + (params.size ? '?' + params.toString() : '')
  )
}
const results = computed(() =>
  searchDocuments(catalog, query.value, topic.value).filter(
    (d) => status.value === 'all' || d.status === status.value
  )
)
function reset() {
  query.value = ''
  topic.value = 'all'
  status.value = 'all'
  syncUrl()
}
</script>
<template>
  <div class="page-width app-page">
    <header class="page-heading">
      <p class="eyebrow">THE RESEARCH LIBRARY</p>
      <h1>지금 필요한 한 편을 찾아보세요.</h1>
      <p>
        연구 입문부터 글쓰기와 발표까지. {{ catalog.length }}편의 한국어 자료를
        한곳에서 읽으세요.
      </p>
    </header>
    <div class="library-search">
      <Icon name="search" :size="23" /><label
        class="sr-only"
        for="library-query"
        >자료 제목과 본문 검색</label
      ><input
        id="library-query"
        v-model="query"
        type="search"
        placeholder="궁금한 주제나 단어를 입력하세요. 예: 실험, 논문 읽기"
        @input="syncUrl"
      /><kbd>전체 본문 검색</kbd>
    </div>
    <div class="filter-chips" aria-label="자료 주제">
      <button
        :aria-pressed="topic === 'all'"
        @click="
          topic = 'all'
          syncUrl()
        "
      >
        전체 {{ catalog.length }}</button
      ><button
        v-for="category in categories"
        :key="category.id"
        :aria-pressed="topic === category.id"
        @click="
          topic = category.id
          syncUrl()
        "
      >
        {{ category.label }}
      </button>
    </div>
    <div class="results-heading">
      <p role="status">
        <strong>{{ results.length }}</strong
        >편의 자료<span v-if="query"> · “{{ query }}” 검색 결과</span>
      </p>
      <label class="status-filter"
        >번역 범위
        <select v-model="status" aria-label="번역 범위 필터" @change="syncUrl">
          <option value="all">모든 범위</option>
          <option v-for="(label, key) in statusLabels" :key="key" :value="key">
            {{ label }}
          </option>
        </select></label
      >
    </div>
    <div v-if="results.length" class="document-grid">
      <DocCard v-for="doc in results" :key="doc.id" :doc="doc" :query="query" />
    </div>
    <div v-else class="empty-state">
      <Icon name="search" :size="38" />
      <h2>아직 찾는 자료가 보이지 않아요.</h2>
      <p>검색어를 짧게 입력하거나 주제·번역 범위를 바꿔 보세요.</p>
      <button class="button secondary" @click="reset">검색 조건 초기화</button>
    </div>
  </div>
</template>
