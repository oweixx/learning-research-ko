<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import Icon from './Icon.vue'
import { useLearningStore } from '../store.js'
import { categories } from '../../../data/learning.mjs'
import { highlighted } from '../../../lib/search.mjs'
const props = defineProps({ doc: Object, query: { type: String, default: '' } })
const { state, ready, updateDoc } = useLearningStore()
const category = computed(() =>
  categories.find((c) => c.id === props.doc.category)
)
const record = computed(() => state.docs[props.doc.id] || {})
</script>
<template>
  <article class="doc-card">
    <div class="card-meta">
      <span>{{ category?.label }}</span
      ><span>약 {{ doc.minutes }}분</span>
    </div>
    <a class="card-title" :href="withBase(doc.url + '.html')"
      ><template v-for="(part, i) in highlighted(doc.title, query)" :key="i"
        ><mark v-if="part.match">{{ part.text }}</mark
        ><template v-else>{{ part.text }}</template></template
      ></a
    >
    <p class="card-description">
      <template
        v-for="(part, i) in highlighted(doc.snippet || doc.description, query)"
        :key="i"
        ><mark v-if="part.match">{{ part.text }}</mark
        ><template v-else>{{ part.text }}</template></template
      >
    </p>
    <div class="card-bottom">
      <span class="status-badge" :class="doc.status">{{
        doc.statusLabel
      }}</span>
      <div class="card-actions">
        <span v-if="record.read" class="read-indicator"
          ><Icon name="check" :size="15" />읽음</span
        ><button
          class="icon-button"
          :disabled="!ready"
          :aria-label="`${doc.title} ${record.bookmarked ? '북마크 해제' : '북마크'}`"
          :aria-pressed="!!record.bookmarked"
          @click="updateDoc(doc.id, { bookmarked: !record.bookmarked })"
        >
          <Icon name="bookmark" :size="19" />
        </button>
      </div>
    </div>
  </article>
</template>
