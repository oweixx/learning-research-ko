<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { withBase } from 'vitepress'
import { templates } from '../../../data/learning.mjs'
import { noteMarkdown, downloadText } from '../../../lib/storage.mjs'
import { useLearningStore } from '../store.js'
import Icon from './Icon.vue'
const { state, ready, storageError, createNote, updateNote } =
  useLearningStore()
const templateId = ref('paper'),
  selectedId = ref(''),
  titleInput = ref(null),
  pendingDelete = ref(false)
const currentTemplate = computed(() =>
  templates.find((t) => t.id === templateId.value)
)
const current = computed(() => state.notebooks[selectedId.value])
const formTemplate = computed(() =>
  templates.find((t) => t.id === current.value?.template)
)
const notes = computed(() =>
  Object.values(state.notebooks).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  )
)
onMounted(() => {
  const params = new URLSearchParams(location.search)
  if (templates.some((t) => t.id === params.get('template')))
    templateId.value = params.get('template')
  if (state.notebooks[params.get('note')]) selectedId.value = params.get('note')
})
function select(id) {
  selectedId.value = id
  pendingDelete.value = false
  history.replaceState(
    history.state,
    '',
    location.pathname + '?note=' + encodeURIComponent(id)
  )
}
async function create() {
  select(createNote(templateId.value))
  await nextTick()
  titleInput.value?.focus()
}
function updateField(key, value) {
  updateNote(selectedId.value, {
    values: { ...current.value.values, [key]: value }
  })
}
function exportNote() {
  downloadText(
    `research-${current.value.template}-${selectedId.value.slice(0, 8)}.md`,
    noteMarkdown(current.value),
    'text/markdown;charset=utf-8'
  )
}
function remove() {
  delete state.notebooks[selectedId.value]
  selectedId.value = ''
  pendingDelete.value = false
  history.replaceState(history.state, '', location.pathname)
}
</script>
<template>
  <div class="page-width app-page">
    <header class="page-heading">
      <p class="eyebrow">YOUR RESEARCH NOTEBOOK</p>
      <h1>생각이 남는 연구 노트.</h1>
      <p>좋은 질문을 따라 쓰다 보면, 다음에 할 일이 조금 더 분명해집니다.</p>
      <p class="editor-note">
        한국어판에서 추가한 학습 보조 양식입니다. 내용은 이 브라우저에만
        저장되며, GitHub나 Notion으로 전송되지 않습니다.
      </p>
    </header>
    <div class="template-grid">
      <button
        v-for="template in templates"
        :key="template.id"
        class="template-card"
        :aria-pressed="templateId === template.id"
        @click="templateId = template.id"
      >
        <Icon :name="template.icon" :size="25" /><strong>{{
          template.title
        }}</strong
        ><span>{{ template.description }}</span>
      </button>
    </div>
    <div class="template-start">
      <p>
        <strong>{{ currentTemplate.title }}</strong> 양식으로 생각을 정리해
        보세요.
      </p>
      <button class="button primary" :disabled="!ready" @click="create">
        <Icon name="plus" :size="18" />새 노트 만들기
      </button>
    </div>
    <div class="notebook-workspace">
      <aside class="note-list">
        <h2>
          작성한 노트 <span>{{ notes.length }}</span>
        </h2>
        <p v-if="!notes.length" class="muted">
          아직 노트가 없어요.<br />위에서 첫 노트를 만들어 보세요.
        </p>
        <button
          v-for="note in notes"
          :key="note.id"
          :aria-pressed="selectedId === note.id"
          @click="select(note.id)"
        >
          <span class="note-list-type">{{
            templates.find((t) => t.id === note.template)?.title
          }}</span
          ><strong>{{ note.title || '제목 없는 노트' }}</strong
          ><small>{{ note.updatedAt.slice(0, 10) }}</small></button
        ><a class="text-link" :href="withBase('/bookshelf.html#backup')"
          >모든 기록 백업·복원 <Icon name="arrow" :size="16"
        /></a>
      </aside>
      <section v-if="current" class="note-editor" aria-label="연구 노트 편집기">
        <div class="editor-toolbar">
          <span class="status-badge">{{ formTemplate.title }}</span
          ><button class="button small secondary" @click="exportNote">
            <Icon name="download" :size="17" />Markdown 내려받기
          </button>
        </div>
        <label class="field-label" for="note-title">노트 제목</label
        ><input
          id="note-title"
          ref="titleInput"
          class="note-title-input"
          :value="current.title"
          placeholder="기억하기 쉬운 제목을 붙여 주세요"
          maxlength="200"
          @input="updateNote(selectedId, { title: $event.target.value })"
        />
        <p class="save-status" role="status">
          {{ storageError || '이 브라우저에 자동 저장됩니다.' }}
        </p>
        <div
          v-for="([key, label, hint], index) in formTemplate.fields"
          :key="key"
          class="note-field"
        >
          <label :for="'field-' + key"
            ><span>{{ String(index + 1).padStart(2, '0') }}</span
            >{{ label }}</label
          >
          <p :id="'hint-' + key">{{ hint }}</p>
          <textarea
            :id="'field-' + key"
            :aria-describedby="'hint-' + key"
            :value="current.values[key] || ''"
            rows="4"
            maxlength="60000"
            placeholder="내 생각을 적어 보세요…"
            @input="updateField(key, $event.target.value)"
          ></textarea>
        </div>
        <div class="editor-bottom">
          <a
            class="text-link"
            :href="withBase('/guide/' + formTemplate.source + '.html')"
            >연결된 가이드 읽기 <Icon name="arrow" :size="16" /></a
          ><button
            v-if="!pendingDelete"
            class="muted text-button"
            @click="pendingDelete = true"
          >
            이 노트 삭제
          </button>
          <div v-else class="delete-confirm" role="alert">
            <span>이 노트를 삭제할까요?</span
            ><button class="text-button danger" @click="remove">삭제하기</button
            ><button class="text-button" @click="pendingDelete = false">
              취소
            </button>
          </div>
        </div>
      </section>
      <section v-else class="empty-state notebook-empty">
        <Icon name="pen" :size="42" />
        <h2>한 문장부터 시작해도 괜찮아요.</h2>
        <p>
          양식을 고르고 새 노트를 만들거나,<br />작성한 노트를 선택해 이어서 써
          보세요.
        </p>
      </section>
    </div>
  </div>
</template>
