import { templates } from '../data/learning.mjs'
export const STORAGE_KEY = 'learning-research-ko:v1'
export const emptyState = () => ({
  version: 1,
  docs: {},
  notebooks: {},
  lastRead: '',
  fontSize: 18
})
const string = (value, limit = 60000) =>
  typeof value === 'string' ? value.slice(0, limit) : ''
const timestamp = (value) =>
  typeof value === 'string' && Number.isFinite(Date.parse(value))
    ? value
    : '1970-01-01T00:00:00.000Z'
const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

export function sanitizeState(input, validIds) {
  if (
    !isObject(input) ||
    input.version !== 1 ||
    !isObject(input.docs) ||
    !isObject(input.notebooks)
  )
    throw new Error(
      '지원하지 않는 백업 형식입니다. 이 사이트에서 받은 JSON 백업 파일을 선택해 주세요.'
    )
  const result = emptyState()
  for (const [id, record] of Object.entries(input.docs)) {
    if (!validIds.has(id) || !isObject(record)) continue
    result.docs[id] = {
      read: record.read === true,
      bookmarked: record.bookmarked === true,
      note: string(record.note),
      heading: string(record.heading, 500),
      updatedAt: timestamp(record.updatedAt)
    }
  }
  for (const [id, record] of Object.entries(input.notebooks)) {
    if (
      !/^[a-z0-9-]{1,80}$/i.test(id) ||
      !isObject(record) ||
      !isObject(record.values)
    )
      continue
    const template = templates.find((t) => t.id === record.template)
    if (!template) continue
    const values = Object.fromEntries(
      template.fields.map(([key]) => [key, string(record.values[key])])
    )
    result.notebooks[id] = {
      id,
      template: template.id,
      title: string(record.title, 200),
      values,
      createdAt: timestamp(record.createdAt),
      updatedAt: timestamp(record.updatedAt)
    }
  }
  result.lastRead = validIds.has(input.lastRead) ? input.lastRead : ''
  result.fontSize = [16, 18, 20, 22].includes(input.fontSize)
    ? input.fontSize
    : 18
  return result
}

export function parseBackup(text, validIds) {
  if (text.length > 5 * 1024 * 1024)
    throw new Error('백업 파일은 5MB 이하만 불러올 수 있습니다.')
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('JSON 파일을 읽을 수 없습니다. 파일 내용을 확인해 주세요.')
  }
  if (parsed.format !== 'learning-research-ko')
    throw new Error('이 사이트에서 내보낸 백업 파일이 아닙니다.')
  return sanitizeState(parsed.data, validIds)
}

export function mergeStates(current, incoming) {
  const result = {
    ...current,
    docs: { ...current.docs },
    notebooks: { ...current.notebooks }
  }
  for (const key of ['docs', 'notebooks'])
    for (const [id, record] of Object.entries(incoming[key])) {
      if (
        !result[key][id] ||
        Date.parse(record.updatedAt) > Date.parse(result[key][id].updatedAt)
      )
        result[key][id] = record
    }
  if (!result.lastRead) result.lastRead = incoming.lastRead
  return result
}

export function noteMarkdown(note) {
  const template = templates.find((t) => t.id === note.template)
  if (!template) throw new Error('알 수 없는 연구 양식')
  return `# ${note.title || template.title}\n\n양식: ${template.title}\n수정일: ${note.updatedAt.slice(0, 10)}\n\n${template.fields.map(([key, label]) => `## ${label}\n\n${note.values[key] || '(아직 작성하지 않음)'}`).join('\n\n')}\n\n---\nLearning Research 한국어판의 학습 보조 양식으로 작성했습니다.\n`
}

export function downloadText(
  filename,
  text,
  mime = 'text/plain;charset=utf-8'
) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
