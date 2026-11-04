<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import catalog from '../../../.generated/catalog.json'
import { templates, tracks } from '../../../data/learning.mjs'
import { useLearningStore } from '../store.js'
import { downloadText } from '../../../lib/storage.mjs'
import Icon from './Icon.vue'
const { frontmatter } = useData()
const { state, ready, storageError, updateDoc } = useLearningStore()
const doc = computed(() =>
  catalog.find((d) => d.id === frontmatter.value.pageId)
)
const record = computed(() => state.docs[doc.value?.id] || {})
const track = computed(() => tracks.find((t) => t.ids.includes(doc.value?.id)))
const template = computed(
  () =>
    templates.find((t) => t.source === doc.value?.id) ||
    templates.find((t) => t.id === track.value?.template)
)
function exportMemo() {
  downloadText(
    `memo-${doc.value.id}.md`,
    `# ${doc.value.title} · 내 메모\n\n${record.value.note || ''}\n\n읽은 자료: https://oweixx.github.io/learning-research-ko${doc.value.url}.html\n`,
    'text/markdown;charset=utf-8'
  )
}
</script>
<template>
  <div v-if="doc" :key="doc.id" class="reading-after">
    <details class="personal-records">
      <summary>개인 메모와 연구 노트<span v-if="record.note"> · 저장한 메모 있음</span></summary>
    <section class="reading-memo">
      <div class="section-heading">
        <h2><Icon name="pen" :size="20" />읽고 남기는 내 생각</h2>
        <button
          class="text-button"
          :disabled="!record.note"
          @click="exportMemo"
        >
          메모 내려받기 <Icon name="download" :size="16" />
        </button>
      </div>
      <p>내 연구에 적용할 점이나 더 확인하고 싶은 질문을 적어 보세요.</p>
      <label class="sr-only" for="reading-memo">이 문서의 개인 메모</label
      ><textarea
        id="reading-memo"
        :value="record.note || ''"
        :disabled="!ready"
        rows="5"
        maxlength="60000"
        placeholder="이 글에서 가져갈 한 가지는 무엇인가요?"
        @input="updateDoc(doc.id, { note: $event.target.value })"
      ></textarea>
      <p class="save-status" role="status">
        {{
          storageError ||
          '현재 브라우저에 자동 저장됩니다. 내 서재에서 백업할 수 있습니다.'
        }}
      </p>
    </section>
    <section v-if="template" class="practice-box">
      <span class="icon-tile"><Icon :name="template.icon" /></span>
      <div>
        <span class="eyebrow">읽은 내용을 직접 적용해 보세요</span>
        <h2>{{ template.title }} 양식</h2>
        <p>한국어판에서 추가한 질문을 따라 나의 생각을 구체화하세요.</p>
      </div>
      <a
        class="button secondary"
        :href="withBase('/notebook.html?template=' + template.id)"
        >노트 작성 <Icon name="arrow" :size="16"
      /></a>
    </section>
    </details>
    <a
      v-if="track"
      class="back-to-path"
      :href="withBase('/paths.html#' + track.id)"
      ><Icon name="compass" :size="18" />‘{{ track.title }}’ 학습 경로로
      돌아가기</a
    >
  </div>
</template>
