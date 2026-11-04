import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { slugFor } from '../site/lib/content.mjs'
import { summaries } from '../site/data/editorial.mjs'
import { connections } from '../site/data/reading-connections.mjs'
import { flows, examples } from '../site/data/editorial-examples.mjs'
import { glossary, glossaryAnchor } from '../site/data/glossary.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')
const sources = ['getting_started_in_research.md', 'getting_advanced_in_research.md']
for (const dir of ['docs/notion', 'docs/external'])
  for (const name of (await readdir(path.join(root, dir))).sort())
    if (name.endsWith('.md') && name !== 'README.md') sources.push(`${dir}/${name}`)
const files = new Map()
for (const file of [...sources, 'docs/guides/handbook.md']) {
  const body = (await readFile(path.join(root, file), 'utf8')).replaceAll('\r\n', '\n')
  files.set(slugFor(file), { file, body, title: body.match(/^# (.+)/)[1] })
}
const relative = (from, to) => {
  const url = path.posix.relative(path.posix.dirname(from), to)
  return url.startsWith('.') ? url : './' + url
}
const link = (from, id) => {
  const doc = files.get(id)
  if (!doc) throw new Error(`없는 연결: ${from} → ${id}`)
  return `[${doc.title}](${relative(from, doc.file)})`
}
const section = (name, text) => `<!-- editorial:${name} -->\n${text.trim()}\n<!-- /editorial:${name} -->`
const strip = (text) => text
  .replace(/<!-- editorial:(\w+) -->[\s\S]*?<!-- \/editorial:\1 -->\n*/g, '')
  .replace(/<!-- term:[a-z]+ -->[\s\S]*?<!-- \/term -->/g, '')
  .trimEnd() + '\n'

function termsInBody(body, file, id) {
  const seen = new Set()
  let fence = false
  return body.split('\n').map(line => {
    if (/^```/.test(line)) { fence = !fence; return line }
    if (fence || /^(#|>|원문|출처|\[|Sida Peng)/.test(line) || !line.trim()) return line
    // Keep headings, links, code, selected highlight phrases and existing emphasis intact.
    return line.split(/(\[[^\]\n]+\]\([^)]*\)|`[^`]*`|\*\*[^*]+\*\*(?:<!-- highlight -->)?|<[^>]+>)/g)
      .map((chunk, index) => {
        if (index % 2) return chunk
        const additions = []
        for (const term of glossary) {
          if (seen.has(term.id) || (term.only && !term.only.includes(id))) continue
          const hits = term.aliases.flatMap(alias => [...chunk.matchAll(new RegExp(alias, 'g'))].map(hit => ({ alias, at: hit.index })))
            .filter(h => {
              const before = chunk.slice(0, h.at)
              return before.lastIndexOf('‘') <= before.lastIndexOf('’') && before.lastIndexOf('“') <= before.lastIndexOf('”')
            }).sort((a, b) => a.at - b.at || b.alias.length - a.alias.length)
          if (!hits.length) continue
          const hit = hits[0]
          seen.add(term.id)
          additions.push({ at: hit.at + hit.alias.length, text: `<!-- term:${term.id} -->([${term.short}](${relative(file, 'docs/guides/glossary.md')}#${glossaryAnchor(term)}))<!-- /term -->` })
        }
        for (const addition of additions.sort((a, b) => b.at - a.at)) chunk = chunk.slice(0, addition.at) + addition.text + chunk.slice(addition.at)
        return chunk
      }).join('')
  }).join('\n')
}

let changed = 0
async function save(file, text) {
  let old = ''
  try { old = (await readFile(path.join(root, file), 'utf8')).replaceAll('\r\n', '\n') } catch (error) { if (error.code !== 'ENOENT') throw error }
  if (old === text) return
  if (check) throw new Error(`편집 원고와 생성 문서 불일치: ${file}. node scripts/prepare-editorial.mjs 실행 필요`)
  await writeFile(path.join(root, file), text, 'utf8')
  changed++
}
await mkdir(path.join(root, 'docs/guides'), { recursive: true })
for (const [id, doc] of files) {
  if (id === 'handbook') continue
  if (!connections[id]) throw new Error(`읽기 연결이 없는 문서: ${id}`)
  let body = termsInBody(strip(doc.body), doc.file, id)
  if (summaries[id]) {
    if (summaries[id].length !== 3) throw new Error(`세 줄 요약 아님: ${id}`)
    const summary = section('summary', `**세 줄로 먼저 읽기 · 한국어판 요약**\n\n${summaries[id].map(s => '- ' + s).join('\n')}`)
    body = body.replace(/^(# [^\n]+)\n+/, `$1\n\n${summary}\n\n`)
  }
  const extra = []
  if (flows[id]) {
    const f = flows[id]
    extra.push(section('flow', `## 한국어판 해설: ${f.title}\n\n${f.steps.map(([label, detail], i) => `${i + 1}. **${label}:** ${detail}`).join('\n')}\n\n${f.note}`))
  }
  if (examples[id]) {
    const e = examples[id]
    extra.push(section('example', `## 한국어판 비교 예시: ${e.title}\n\n이해를 돕기 위해 만든 가상 예시입니다. 원저자의 발언이나 실제 실험 결과가 아닙니다.\n\n### 아쉬운 예\n\n> ${e.before}\n\n### 개선한 예\n\n> ${e.after}\n\n**달라진 점:** ${e.lesson}`))
  }
  const [before, whyBefore, next, whyNext] = connections[id]
  if (before === id || next === id || (before && before === next)) throw new Error(`잘못된 연결: ${id}`)
  extra.push(section('connections', `## 읽기의 연결 · 한국어판 안내\n\n${before ? `- **먼저 읽으면:** ${link(doc.file, before)} — ${whyBefore}\n` : ''}- **이어서 적용하면:** ${link(doc.file, next)} — ${whyNext}`))
  await save(doc.file, body.trimEnd() + '\n\n' + extra.join('\n\n') + '\n')
}
const glossaryText = `# 연구 용어를 쉬운 말로\n\n한국어판에서 덧붙인 용어 풀이입니다. 이 자료에서 사용하는 문맥을 설명하며, 각 분야의 모든 정의를 대신하지 않습니다. 본문에서는 제목·링크·코드·기존 강조 구절을 제외한 첫 설명 가능한 위치에 짧은 풀이를 붙였습니다.\n\n[연구 원칙 모음집](./handbook.md) · [논문 읽기로 돌아가기](../notion/reading-papers.md)\n\n` + glossary.map(term => `## ${term.title} ${term.id}\n\n**${term.short}.**\n\n${term.detail}\n\n함께 읽기: ${link('docs/guides/glossary.md', term.source)}.`).join('\n\n') + '\n'
await save('docs/guides/glossary.md', glossaryText)
for (const collection of [summaries, flows, examples])
  for (const id of Object.keys(collection)) if (!files.has(id)) throw new Error(`없는 편집 대상: ${id}`)
console.log(`한국어판 편집: 요약 ${Object.keys(summaries).length}, 흐름도 ${Object.keys(flows).length}, 비교 예시 ${Object.keys(examples).length}, 읽기 연결 ${Object.keys(connections).length}, 용어 ${glossary.length}. ${check ? '동기화 확인' : `${changed}개 문서 반영`}`)
