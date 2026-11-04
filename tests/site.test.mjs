import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { rewriteLinks } from '../site/lib/content.mjs'
import { searchDocuments, highlighted } from '../site/lib/search.mjs'
import {
  emptyState,
  sanitizeState,
  parseBackup,
  mergeStates,
  noteMarkdown
} from '../site/lib/storage.mjs'
import { tracks, templates, categories } from '../site/data/learning.mjs'

const catalog = JSON.parse(
  readFileSync(
    new URL('../site/.generated/catalog.json', import.meta.url),
    'utf8'
  )
)
const validIds = new Set(catalog.map((d) => d.id))

test('학습 경로와 양식이 실제 문서를 가리키며 모든 문서가 한 주제에 속한다', () => {
  for (const track of tracks) {
    for (const id of track.ids) assert.ok(validIds.has(id), id)
    assert.ok(templates.some((t) => t.id === track.template))
  }
  for (const template of templates) assert.ok(validIds.has(template.source))
  for (const doc of catalog)
    assert.equal(
      categories.filter((c) => c.ids.includes(doc.id)).length,
      1,
      doc.id
    )
  assert.equal(catalog.length, new Set(catalog.map((d) => d.sourcePath)).size)
})
test('한국어 부분 검색과 여러 단어 검색을 본문에서 찾고 주제 필터와 함께 적용한다', () => {
  assert.ok(
    searchDocuments(catalog, '과적합').some(
      (d) => d.id === 'exploratory-experiments'
    )
  )
  assert.ok(
    searchDocuments(catalog, '논문 분석').some((d) => d.id === 'reading-papers')
  )
  assert.ok(
    searchDocuments(catalog, '', 'writing').every(
      (d) => d.category === 'writing'
    )
  )
  assert.equal(searchDocuments(catalog, '존재하지않는검색어928372').length, 0)
})
test('검색어의 정규식 문자와 HTML을 실행하지 않고 텍스트로 다룬다', () => {
  assert.deepEqual(highlighted('a+b <img>', 'a+b'), [
    { text: 'a+b', match: true },
    { text: ' <img>', match: false }
  ])
  assert.deepEqual(highlighted('그대로', '['), [
    { text: '그대로', match: false }
  ])
})
test('상대 경로를 사이트로 연결하면서 코드와 외부 링크, 앵커는 보존한다', () => {
  const content =
    '[논문](./reading-papers.md#세-단계)\n[외부](https://example.org)\n```md\n[코드](./reading-papers.md)\n```'
  const result = rewriteLinks(
    content,
    'docs/notion/finding-papers.md',
    new Set(['docs/notion/reading-papers.md'])
  )
  assert.ok(result.includes('/guide/reading-papers.md#세-단계'))
  assert.ok(result.includes('[외부](https://example.org)'))
  assert.ok(result.includes('[코드](./reading-papers.md)'))
  assert.throws(() =>
    rewriteLinks('[x](../../outside)', 'README.md', new Set())
  )
})
test('손상되거나 다른 앱의 백업을 거부하고 알 수 없는 문서와 노트를 제외한다', () => {
  assert.throws(() => parseBackup('{bad', validIds), /JSON/)
  assert.throws(() => parseBackup('{"format":"another-app"}', validIds))
  assert.throws(() => sanitizeState({ version: 2 }, validIds))
  const data = {
    ...emptyState(),
    docs: {
      nope: { read: true },
      'reading-papers': { read: 'yes', note: '내 메모' }
    },
    notebooks: { bad: { template: 'nope', values: {} } },
    fontSize: 1000
  }
  const restored = parseBackup(
    JSON.stringify({ format: 'learning-research-ko', data }),
    validIds
  )
  assert.equal(restored.docs['reading-papers'].read, false)
  assert.equal(restored.docs['reading-papers'].note, '내 메모')
  assert.equal(restored.docs.nope, undefined)
  assert.equal(restored.fontSize, 18)
  assert.equal(Object.keys(restored.notebooks).length, 0)
})
test('백업 병합은 오래된 자료가 최신 메모를 덮어쓰지 않는다', () => {
  const current = {
    ...emptyState(),
    docs: {
      'reading-papers': { note: '최신', updatedAt: '2026-11-04T12:00:00Z' }
    }
  }
  const incoming = {
    ...emptyState(),
    docs: {
      'reading-papers': { note: '옛 메모', updatedAt: '2026-11-03T12:00:00Z' },
      'finding-papers': { note: '추가', updatedAt: '2026-11-04T13:00:00Z' }
    }
  }
  const merged = mergeStates(current, incoming)
  assert.equal(merged.docs['reading-papers'].note, '최신')
  assert.equal(merged.docs['finding-papers'].note, '추가')
  assert.equal(current.docs['finding-papers'], undefined)
})
test('악성 키를 포함한 백업에서 프로토타입을 바꾸지 않는다', () => {
  const raw =
    '{"version":1,"docs":{"__proto__":{"polluted":true}},"notebooks":{"__proto__":{"template":"paper","values":{}}}}'
  const clean = sanitizeState(JSON.parse(raw), validIds)
  assert.equal({}.polluted, undefined)
  assert.equal(Object.keys(clean.docs).length, 0)
  assert.equal(Object.keys(clean.notebooks).length, 0)
})
test('연구 노트를 한국어 제목과 모든 질문, 사용자 답변을 포함해 내보낸다', () => {
  const result = noteMarkdown({
    template: 'experiment',
    title: '첫 검증',
    values: { question: '데이터가 원인인가?' },
    updatedAt: '2026-11-04T00:00:00Z'
  })
  assert.ok(result.startsWith('# 첫 검증'))
  assert.ok(result.includes('데이터가 원인인가?'))
  assert.ok(result.includes('성공·실패 판단 기준'))
  assert.ok(result.includes('(아직 작성하지 않음)'))
})
