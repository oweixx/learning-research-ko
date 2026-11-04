export function searchDocuments(documents, query, category = 'all') {
  const words = query
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('ko')
    .split(/\s+/)
    .filter(Boolean)
  return documents
    .filter((d) => category === 'all' || d.category === category)
    .map((d) => {
      const title = d.title.normalize('NFKC').toLocaleLowerCase('ko')
      const body = (d.text || d.description)
        .normalize('NFKC')
        .toLocaleLowerCase('ko')
      if (!words.every((w) => `${title} ${body}`.includes(w))) return null
      const score = words.reduce((n, w) => n + (title.includes(w) ? 10 : 1), 0)
      const index = words.length
        ? body.indexOf(words.find((w) => body.includes(w)) || '')
        : -1
      const snippet =
        index >= 0
          ? `${index > 50 ? '…' : ''}${(d.text || d.description).slice(Math.max(0, index - 50), index + 115)}…`
          : d.description
      return { ...d, score, snippet }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
}

export function highlighted(text, query) {
  const words = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
  if (!words.length) return [{ text, match: false }]
  const escaped = words.map((word) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )
  return text
    .split(new RegExp(`(${escaped.join('|')})`, 'gi'))
    .filter(Boolean)
    .map((part) => ({
      text: part,
      match: words.some((w) => w.toLowerCase() === part.toLowerCase())
    }))
}
