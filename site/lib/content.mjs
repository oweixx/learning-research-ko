import path from 'node:path'

const special = {
  'README.md': 'about-project',
  'getting_started_in_research.md': 'getting-started',
  'getting_advanced_in_research.md': 'advanced',
  'TRANSLATION.md': 'translation',
  'PUBLISHING.md': 'publishing',
  changelog: 'changelog',
  'docs/notion/README.md': 'notion-index',
  'docs/external/README.md': 'source-status'
}
export const slugFor = (file) =>
  special[file] || path.posix.basename(file, '.md')
export const routeFor = (file) => `/guide/${slugFor(file)}`

// Editors select passages in the source, never by keyword or at runtime.
// GitHub renders the bold text and hides the marker; Pages adds the color.
export function renderHighlights(markdown) {
  return markdown
    .split(/(^```[^\n]*\n[\s\S]*?^```\s*$)/m)
    .map((chunk) =>
      chunk.startsWith('```')
        ? chunk
        : chunk.replace(
            /\*\*([^*\n]+)\*\*<!-- highlight -->/g,
            '<mark class="editorial-highlight">**$1**</mark>'
          )
    )
    .join('')
}

export function rewriteLinks(markdown, sourcePath, knownPaths) {
  return markdown
    .split(/(^```[^\n]*\n[\s\S]*?^```\s*$)/m)
    .map((chunk) =>
      chunk.startsWith('```')
        ? chunk
        : chunk.replace(
            /(?<!!)\[([^\]\n]+)\]\(([^\s)]+)\)/g,
            (match, label, destination) => {
              if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(destination))
                return match
              const [raw, fragment] = destination.split('#')
              const target = path.posix.normalize(
                path.posix.join(
                  path.posix.dirname(sourcePath),
                  decodeURIComponent(raw)
                )
              )
              if (target === '..' || target.startsWith('../'))
                throw new Error(`경로 이탈: ${sourcePath}: ${destination}`)
              const url = knownPaths.has(target)
                ? `${routeFor(target)}.md`
                : `https://github.com/oweixx/learning-research-ko/blob/master/${encodeURI(target)}`
              return `[${label}](${url}${fragment ? '#' + fragment : ''})`
            }
          )
    )
    .join('')
}

export function plainText(markdown) {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[#*`>|_]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function excerpt(markdown) {
  const paragraph = markdown
    .split(/\n\s*\n/)
    .find(
      (p) => p.trim().length > 65 && !/^(#|\[|원문|출처|\||>|-)/.test(p.trim())
    )
  const text = plainText(paragraph || markdown)
  return text.length > 125 ? text.slice(0, 122) + '…' : text
}
