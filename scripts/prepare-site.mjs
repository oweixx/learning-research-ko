import { readFile, writeFile, mkdir, readdir, cp } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  categories,
  statusLabels,
  statusDescriptions
} from '../site/data/learning.mjs'
import {
  slugFor,
  routeFor,
  rewriteLinks,
  plainText,
  excerpt
} from '../site/lib/content.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const generated = path.join(root, 'site/.generated')
const read = (name) => readFile(path.join(root, name), 'utf8')
const manifest = JSON.parse(
  await read('translation/notion-source-manifest.json')
)
const external = JSON.parse(await read('translation/external-sources.json'))
const paths = [
  'README.md',
  'getting_started_in_research.md',
  'getting_advanced_in_research.md',
  'changelog',
  'TRANSLATION.md',
  'PUBLISHING.md'
]
for (const folder of ['docs/notion', 'docs/external']) {
  for (const file of (await readdir(path.join(root, folder))).sort())
    if (file.endsWith('.md')) paths.push(`${folder}/${file}`)
}
const known = new Set(paths)
const metadata = new Map(
  [...manifest.direct_pages, ...manifest.linked_pages]
    .filter((p) => p.translation_path)
    .map((p) => [p.translation_path, p])
)
for (const source of external.sources)
  if (source.translation_path && !metadata.has(source.translation_path))
    metadata.set(source.translation_path, {
      ...source,
      source_url: source.urls[0]
    })
const documents = []
await mkdir(path.join(generated, 'guide'), { recursive: true })
for (const sourcePath of paths) {
  let body = (await read(sourcePath)).replace(/\r\n/g, '\n')
  const id = slugFor(sourcePath)
  const title = body.match(/^# (.+)/)?.[1] || '원문 변경 이력'
  const meta = metadata.get(sourcePath)
  const category = categories.find((c) => c.ids.includes(id))
  if (!category) throw new Error(`분류가 없는 문서: ${id}`)
  const status =
    meta?.translation_status ||
    (['getting-started', 'advanced'].includes(id) ? 'translated' : 'reference')
  const text = plainText(body)
  const doc = {
    id,
    title,
    sourcePath,
    url: routeFor(sourcePath),
    category: category.id,
    description: excerpt(body),
    status,
    statusLabel: statusLabels[status],
    statusDescription: statusDescriptions[status],
    sourceUrl:
      meta?.source_url || `https://github.com/pengsida/learning_research`,
    minutes: Math.max(1, Math.ceil(text.length / 600)),
    text
  }
  documents.push(doc)
  if (!body.startsWith('# ')) body = `# ${title}\n\n${body}`
  body = rewriteLinks(body, sourcePath, known)
  const frontmatter = {
    title,
    description: doc.description,
    pageId: id,
    sourcePath
  }
  await writeFile(
    path.join(generated, 'guide', `${id}.md`),
    `---\n${Object.entries(frontmatter)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join('\n')}\n---\n\n${body}\n`,
    'utf8'
  )
}
if (new Set(documents.map((d) => d.id)).size !== documents.length)
  throw new Error('중복 문서 ID')
await writeFile(
  path.join(generated, 'catalog.json'),
  JSON.stringify(documents),
  'utf8'
)
const pages = {
  index: ['연구를 배우는 법', 'HomePage'],
  paths: ['나에게 맞는 학습 경로', 'LearningPaths'],
  library: ['전체 자료실', 'LibraryPage'],
  notebook: ['나의 연구 노트', 'NotebookPage'],
  bookshelf: ['내 서재', 'BookshelfPage']
}
for (const [file, [title, component]] of Object.entries(pages))
  await writeFile(
    path.join(generated, `${file}.md`),
    `---\nlayout: page\nsidebar: false\naside: false\ntitle: ${title}\ndescription: 한국어로 읽고, 생각하고, 기록하는 연구 학습 공간\n---\n\n<${component} />\n`,
    'utf8'
  )
await cp(path.join(root, 'site/public'), path.join(generated, 'public'), {
  recursive: true
})
console.log(
  `학습 사이트 준비: 원본 문서 ${documents.length}개, 학습 화면 ${Object.keys(pages).length}개`
)
