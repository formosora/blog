import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: true, linkify: true })

export interface Post {
  slug: string
  title: string
  /** Custom display date (ISO yyyy-mm-dd), set in frontmatter — filename independent */
  date: string
  /** Optional "last updated" date, shown next to the publish date */
  updated?: string
  tags: string[]
  excerpt: string
  body: string
  html?: string
}

/** Minimal frontmatter parser: key: value pairs between --- fences. */
function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { meta: {}, body: raw }
  const meta: Record<string, string> = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+)\s*:\s*(.*)$/)
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return { meta, body: m[2].trim() }
}

const files = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true })

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw as string)
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? '1970-01-01',
      updated: meta.updated,
      tags: (meta.tags ?? '')
        .replace(/[[\]]/g, '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      excerpt:
        meta.excerpt ??
        body.replace(/[#*`>\[\]\n]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140) + '…',
      body,
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export const getPost = (slug: string): Post | undefined => posts.find(p => p.slug === slug)

export const renderPost = (post: Post): string => (post.html ??= md.render(post.body))

/** "2026-08-05" -> "Aug 5, 2026" */
export const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
