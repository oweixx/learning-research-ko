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
import { summaries } from '../site/data/editorial.mjs'
import { flows, examples } from '../site/data/editorial-examples.mjs'
import { connections } from '../site/data/reading-connections.mjs'
import { glossary } from '../site/data/glossary.mjs'
import { readerMarkdown } from '../site/lib/editorial.mjs'
import { renderHighlights } from '../site/lib/content.mjs'

const catalog = JSON.parse(
  readFileSync(
    new URL('../site/.generated/catalog.json', import.meta.url),
    'utf8'
  )
)
const validIds = new Set(catalog.map((d) => d.id))
const source = (id) => readFileSync(new URL('../' + catalog.find(d => d.id === id).sourcePath, import.meta.url), 'utf8')

test('편집 자료의 출처·연결이 유효하고 짧은 접근 안내를 본문처럼 요약하지 않는다', () => {
  for (const [id, summary] of Object.entries(summaries)) {
    assert.ok(validIds.has(id), id)
    assert.equal(summary.length, 3, id)
    assert.ok(summary.every(line => line.length > 20 && line.length < 130), id)
    assert.ok(!['blocked'].includes(catalog.find(d => d.id === id).status), id)
  }
  for (const id of ['working-state', 'figure-template-access', 'project-page-resources']) assert.equal(summaries[id], undefined)
  for (const [id, [before, whyBefore, next, whyNext]] of Object.entries(connections)) {
    assert.ok(validIds.has(id) && validIds.has(next), id)
    assert.notEqual(next, id)
    assert.ok(whyNext.length > 10)
    if (before) {
      assert.ok(validIds.has(before) && whyBefore.length > 10, id)
      assert.notEqual(before, id)
      assert.notEqual(before, next)
    }
  }
  for (const id of [...Object.keys(flows), ...Object.keys(examples)]) assert.ok(summaries[id], id)
  for (const term of glossary) assert.ok(validIds.has(term.source), term.id)
})

test('원칙 모음의 강조 구절 24개는 각각 연결한 번역 본문에 실제로 존재한다', () => {
  const handbook = source('handbook')
  const sections = handbook.split(/\n### \d+\. /).slice(1)
  assert.equal(sections.length, 24)
  for (const block of sections) {
    const phrase = block.match(/\*\*([^*]+)\*\*/)?.[1]
    const target = block.match(/\]\(\.\.\/notion\/([^#)]+\.md)/)?.[1]
    assert.ok(phrase && target, block)
    const original = readFileSync(new URL('../docs/notion/' + target, import.meta.url), 'utf8')
    assert.ok(original.includes(`**${phrase}**<!-- highlight -->`), phrase)
  }
})

test('독서 레이아웃은 출처를 접어도 본문·코드·제목을 보존한다', () => {
  const content = '# 제목\n\n[목록](./README.md)\n\n원문: [출처](https://example.org)\n\n첫 본문\n\n## 원래 제목\n\n```text\n원문: 코드 안의 내용\n\n다음 줄\n```'
  const rendered = readerMarkdown(content)
  assert.ok(rendered.includes('<ReadingTools>\n\n[목록]'))
  assert.ok(rendered.includes('</ReadingTools>\n\n첫 본문'))
  assert.ok(rendered.includes('## 원래 제목'))
  assert.ok(rendered.includes('```text\n원문: 코드 안의 내용\n\n다음 줄\n```'))
})

test('용어의 다른 의미와 직접 인용·코드에 풀이를 끼워 넣지 않는다', () => {
  for (const id of ['undergraduate-to-research', 'research-vs-coursework']) assert.ok(!source(id).includes('<!-- term:generalization -->'))
  assert.ok(source('reading-papers').includes('‘볼륨 렌더링이 무엇인가’'))
  for (const doc of catalog.filter(d => connections[d.id])) {
    const body = source(doc.id)
    const ids = [...body.matchAll(/<!-- term:([a-z]+) -->/g)].map(m => m[1])
    assert.equal(ids.length, new Set(ids).size, doc.id)
    for (const code of body.matchAll(/^```[^\n]*\n[\s\S]*?^```/gm)) assert.ok(!code[0].includes('<!-- term:'), doc.id)
    for (const selected of body.matchAll(/\*\*([^*\n]+)\*\*<!-- highlight -->/g)) assert.ok(!selected[1].includes('<!-- term:'), doc.id)
  }
  assert.equal(renderHighlights('```md\n**예시**<!-- highlight -->\n```'), '```md\n**예시**<!-- highlight -->\n```')
})

test('한글 및 숫자로 시작하는 제목 링크를 저장된 VitePress 앵커와 맞춘다', () => {
  const result = rewriteLinks('[절](./b.md#3-단계)', 'a.md', new Set(['b.md']))
  assert.ok(result.includes('#_3-' + '단계'.normalize('NFKD')))
})

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
  assert.ok(result.includes('/guide/reading-papers.md#' + '세-단계'.normalize('NFKD')))
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
