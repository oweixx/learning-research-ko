<script setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import catalog from '../../../.generated/catalog.json'
import { templates } from '../../../data/learning.mjs'
import { useLearningStore } from '../store.js'
import { parseBackup, downloadText } from '../../../lib/storage.mjs'
import DocCard from './DocCard.vue'
import Icon from './Icon.vue'
const { state, ready, storageError, validIds, importState } = useLearningStore()
const mode = ref('bookmarks'),
  importText = ref(''),
  pending = ref(null),
  message = ref(''),
  error = ref('')
const counts = computed(() => ({
  bookmarks: catalog.filter((d) => state.docs[d.id]?.bookmarked).length,
  read: catalog.filter((d) => state.docs[d.id]?.read).length,
  notes: catalog.filter((d) => state.docs[d.id]?.note?.trim()).length
}))
const documents = computed(() =>
  catalog.filter((d) =>
    mode.value === 'bookmarks'
      ? state.docs[d.id]?.bookmarked
      : mode.value === 'read'
        ? state.docs[d.id]?.read
        : state.docs[d.id]?.note?.trim()
  )
)
const last = computed(() => catalog.find((d) => d.id === state.lastRead))
const lastUrl = computed(() =>
  last.value
    ? withBase(
        last.value.url +
          '.html' +
          (state.docs[last.value.id]?.heading
            ? '#' + encodeURIComponent(state.docs[last.value.id].heading)
            : '')
      )
    : ''
)
function backup() {
  downloadText(
    `learning-research-backup-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(
      {
        format: 'learning-research-ko',
        exportedAt: new Date().toISOString(),
        data: state
      },
      null,
      2
    ),
    'application/json;charset=utf-8'
  )
}
function preview(text = importText.value) {
  pending.value = null
  message.value = ''
  error.value = ''
  try {
    pending.value = parseBackup(text, validIds)
  } catch (e) {
    error.value = e.message
  }
}
async function readFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    error.value = '백업 파일은 5MB 이하만 불러올 수 있습니다.'
    pending.value = null
    return
  }
  preview(await file.text())
  event.target.value = ''
}
function restore() {
  importState(pending.value)
  pending.value = null
  importText.value = ''
  message.value =
    '백업을 복원했습니다. 같은 기록은 수정 시각이 더 최근인 내용을 유지했습니다.'
}
</script>
<template>
  <div class="page-width app-page">
    <header class="page-heading">
      <p class="eyebrow">YOUR BOOKSHELF</p>
      <h1>나의 배움이 쌓이는 곳.</h1>
      <p>다시 읽고 싶은 글과 나만의 생각을 한곳에 모아 두세요.</p>
    </header>
    <p v-if="storageError" class="notice error" role="alert">
      {{ storageError }}
    </p>
    <div class="bookshelf-stats">
      <div>
        <strong
          >{{ counts.read }}<small> / {{ catalog.length }}</small></strong
        ><span>읽은 자료</span>
      </div>
      <div>
        <strong>{{ counts.bookmarks }}</strong
        ><span>북마크</span>
      </div>
      <div>
        <strong>{{ counts.notes }}</strong
        ><span>문서 메모</span>
      </div>
      <div>
        <strong>{{ Object.keys(state.notebooks).length }}</strong
        ><span>연구 노트</span>
      </div>
    </div>
    <section v-if="last" class="continue-banner compact">
      <div>
        <p class="eyebrow">마지막으로 읽은 문서</p>
        <h2>{{ last.title }}</h2>
      </div>
      <a class="button primary" :href="lastUrl"
        >이어서 읽기 <Icon name="arrow" :size="18"
      /></a>
    </section>
    <div class="filter-chips bookshelf-tabs" aria-label="서재 분류">
      <button :aria-pressed="mode === 'bookmarks'" @click="mode = 'bookmarks'">
        북마크 {{ counts.bookmarks }}</button
      ><button :aria-pressed="mode === 'read'" @click="mode = 'read'">
        읽은 자료 {{ counts.read }}</button
      ><button :aria-pressed="mode === 'notes'" @click="mode = 'notes'">
        메모한 자료 {{ counts.notes }}
      </button>
    </div>
    <div v-if="documents.length" class="document-grid">
      <div v-for="doc in documents" :key="doc.id" class="shelf-document">
        <DocCard :doc="doc" />
        <div v-if="mode === 'notes'" class="memo-preview">
          <span>내 메모</span>
          <p>{{ state.docs[doc.id].note }}</p>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <Icon :name="mode === 'bookmarks' ? 'bookmark' : 'book'" :size="36" />
      <h2>
        {{
          mode === 'bookmarks'
            ? '다시 읽고 싶은 글을 담아 보세요.'
            : mode === 'read'
              ? '첫 번째 읽기 기록을 남겨 보세요.'
              : '문서를 읽고 떠오른 생각을 적어 보세요.'
        }}
      </h2>
      <p>문서 화면의 북마크, 읽음 표시, 개인 메모가 이곳에 모입니다.</p>
      <a class="button secondary" :href="withBase('/library.html')"
        >자료실 둘러보기</a
      >
    </div>
    <section v-if="Object.keys(state.notebooks).length" class="shelf-notes">
      <div class="section-heading">
        <h2>나의 연구 노트</h2>
        <a class="text-link" :href="withBase('/notebook.html')"
          >노트 작성하기 <Icon name="arrow" :size="16"
        /></a>
      </div>
      <a
        v-for="note in Object.values(state.notebooks).sort((a, b) =>
          b.updatedAt.localeCompare(a.updatedAt)
        )"
        :key="note.id"
        class="shelf-note"
        :href="withBase('/notebook.html?note=' + note.id)"
        ><Icon name="pen" :size="18" /><strong>{{
          note.title || '제목 없는 노트'
        }}</strong
        ><span>{{ templates.find((t) => t.id === note.template)?.title }}</span
        ><small>{{ note.updatedAt.slice(0, 10) }}</small
        ><Icon name="arrow" :size="17"
      /></a>
    </section>
    <section id="backup" class="backup-panel">
      <div>
        <p class="eyebrow">KEEP YOUR NOTES SAFE</p>
        <h2>기록을 백업하고, 다른 곳에서 이어 가세요.</h2>
        <p>
          읽기 기록과 메모는 <strong>현재 브라우저에만 저장</strong>됩니다.
          브라우저 데이터를 지우거나 다른 기기로 옮길 때는 백업 파일을
          이용하세요. 자동 기기 간 동기화는 제공하지 않습니다.
        </p>
        <button class="button primary" :disabled="!ready" @click="backup">
          <Icon name="download" :size="18" />모든 기록 백업
        </button>
      </div>
      <div class="restore-panel">
        <h3>백업 복원</h3>
        <p>기존 기록과 합치며, 같은 기록은 최근 수정본을 유지합니다.</p>
        <label class="file-label"
          >백업 JSON 파일 선택<input
            type="file"
            accept="application/json,.json"
            aria-label="백업 JSON 파일 선택"
            @change="readFile"
        /></label>
        <details>
          <summary>백업 내용을 직접 붙여넣기</summary>
          <label class="sr-only" for="backup-json">백업 JSON 내용</label
          ><textarea
            id="backup-json"
            v-model="importText"
            rows="4"
            placeholder="백업 파일의 JSON 내용을 붙여 넣으세요"
            @input="pending = null"
          ></textarea
          ><button class="button small secondary" @click="preview()">
            복원 내용 확인
          </button>
        </details>
        <div v-if="pending" class="restore-preview">
          <p>
            문서 기록 {{ Object.keys(pending.docs).length }}개 · 연구 노트
            {{ Object.keys(pending.notebooks).length }}개
          </p>
          <button class="button small primary" @click="restore">
            병합하여 복원</button
          ><button class="text-button" @click="pending = null">취소</button>
        </div>
        <p v-if="error" class="notice error" role="alert">{{ error }}</p>
        <p v-if="message" class="notice" role="status">{{ message }}</p>
      </div>
    </section>
  </div>
</template>
