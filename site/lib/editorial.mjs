// Source Markdown stays readable on GitHub and Notion. Only Pages adds layout.
export function readerMarkdown(markdown) {
  const summary = markdown.match(/<!-- editorial:summary -->[\s\S]*?<!-- \/editorial:summary -->/)?.[0] || ''
  const blocks = markdown.replace(summary, '').trim().split(/\n\s*\n/)
  const heading = blocks.shift()
  const metadata = []
  while (blocks.length) {
    const p = blocks[0]
    const navigation = /^\[[^\n]+$/.test(p) && !p.replace(/\[[^\]]+\]\([^)]*\)/g, '').replace(/[ ·]/g, '')
    if (navigation || /^(원문(?:[: ]| 확인)|출처:|> (?:원저자|이 문서는 원저자|첨부 이미지)|Sida Peng의 \d+쪽)/.test(p)) metadata.push(blocks.shift())
    else break
  }
  let body = `${heading}\n\n${summary}\n\n<ReadingTools>\n\n${metadata.join('\n\n')}\n\n</ReadingTools>\n\n${blocks.join('\n\n')}`
  body = body.replace(/<!-- editorial:(summary|flow|example|connections) -->\n([\s\S]*?)\n<!-- \/editorial:\1 -->/g,
    (_, kind, content) => `<section class="editorial-${kind}" aria-label="${{ summary: '세 줄 요약', flow: '연구 과정 도식', example: '한국어판 비교 예시', connections: '읽기의 연결' }[kind]}">\n\n${content}\n\n</section>`)
  return body.replace(/<!-- term:[a-z]+ -->([\s\S]*?)<!-- \/term -->/g, '<span class="term-definition">$1</span>')
}
