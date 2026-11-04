import { reactive, ref, watch, onMounted } from 'vue'
import catalog from '../../.generated/catalog.json'
import {
  STORAGE_KEY,
  emptyState,
  sanitizeState,
  mergeStates
} from '../../lib/storage.mjs'

const state = reactive(emptyState())
const ready = ref(false)
const storageError = ref('')
const validIds = new Set(catalog.map((d) => d.id))
let initialized = false
let applying = false
function save() {
  if (!ready.value || applying) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    storageError.value = ''
  } catch {
    storageError.value =
      '브라우저에 저장하지 못했습니다. 내 서재에서 백업을 내려받아 주세요.'
  }
}
watch(state, save, { deep: true, flush: 'sync' })
function initialize() {
  if (initialized) return
  initialized = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) Object.assign(state, sanitizeState(JSON.parse(raw), validIds))
  } catch {
    storageError.value =
      '기존 기록을 읽지 못했습니다. 저장 공간 설정을 확인하거나 백업을 복원해 주세요.'
  }
  ready.value = true
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return
    try {
      applying = true
      Object.assign(state, sanitizeState(JSON.parse(event.newValue), validIds))
    } catch {
      /* 다른 탭의 유효하지 않은 기록은 적용하지 않습니다. */
    } finally {
      applying = false
    }
  })
}
export function useLearningStore() {
  onMounted(initialize)
  function updateDoc(id, patch) {
    if (!validIds.has(id)) return
    state.docs[id] = {
      read: false,
      bookmarked: false,
      note: '',
      heading: '',
      ...state.docs[id],
      ...patch,
      updatedAt: new Date().toISOString()
    }
  }
  function createNote(template) {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    state.notebooks[id] = {
      id,
      template,
      title: '',
      values: {},
      createdAt: now,
      updatedAt: now
    }
    return id
  }
  function updateNote(id, patch) {
    if (state.notebooks[id])
      state.notebooks[id] = {
        ...state.notebooks[id],
        ...patch,
        updatedAt: new Date().toISOString()
      }
  }
  function importState(incoming) {
    Object.assign(state, mergeStates(state, incoming))
  }
  return {
    state,
    ready,
    storageError,
    validIds,
    updateDoc,
    createNote,
    updateNote,
    importState
  }
}
