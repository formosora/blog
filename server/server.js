import http from 'node:http'
import {
  copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync,
  statSync, unlinkSync, writeFileSync,
} from 'node:fs'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID, createHash } from 'node:crypto'

const ROOT = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 8080)
const DATA_DIR = process.env.DATA_DIR || join(ROOT, 'data')
const POSTS_DIR = join(DATA_DIR, 'posts')
const PROJECTS_FILE = join(DATA_DIR, 'projects.json')
const IMAGES_DIR = join(DATA_DIR, 'images')
const IMAGES_META = join(DATA_DIR, 'images.json')
const WWWROOT = join(ROOT, 'wwwroot')
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me'

mkdirSync(POSTS_DIR, { recursive: true })
mkdirSync(IMAGES_DIR, { recursive: true })

const loadImageMeta = () => (existsSync(IMAGES_META) ? JSON.parse(readFileSync(IMAGES_META, 'utf8')) : {})
const saveImageMeta = m => writeFileSync(IMAGES_META, JSON.stringify(m, null, 2))

// ---------- first-run seed ----------
const seedDir = join(ROOT, 'seed')
if (existsSync(seedDir) && !readdirSync(POSTS_DIR).some(f => f.endsWith('.md'))) {
  for (const f of readdirSync(seedDir).filter(f => f.endsWith('.md')))
    copyFileSync(join(seedDir, f), join(POSTS_DIR, f))
}
if (existsSync(join(seedDir, 'projects.json')) && !existsSync(PROJECTS_FILE)) {
  copyFileSync(join(seedDir, 'projects.json'), PROJECTS_FILE)
}

const tokens = new Map() // token -> expiry ms

// ---------- markdown frontmatter ----------
function parse(raw) {
  const meta = {}
  if (raw.startsWith('---')) {
    const end = raw.indexOf('\n---', 3)
    if (end > 0) {
      for (const line of raw.slice(3, end).split('\n')) {
        const i = line.indexOf(':')
        if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '')
      }
      raw = raw.slice(end + 4)
    }
  }
  return { meta, body: raw.trim() }
}

const parseTags = meta =>
  meta.tags ? meta.tags.replace(/[[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean) : []

const autoExcerpt = body =>
  body.replace(/[#*`>\[\]\n]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140) + '…'

function postJson(file) {
  const { meta, body } = parse(readFileSync(file, 'utf8'))
  const slug = file.split(/[\\/]/).pop().replace(/\.md$/, '')
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || '',
    updated: meta.updated || null,
    tags: parseTags(meta),
    excerpt: meta.excerpt || autoExcerpt(body),
    body,
  }
}

const listPosts = () =>
  readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => postJson(join(POSTS_DIR, f)))
    .sort((a, b) => (a.date < b.date ? 1 : -1))

const VALID_SLUG = /^[a-z0-9][a-z0-9-]*$/

function serializePost(p) {
  let out = '---\n'
  out += `title: ${p.title}\n`
  out += `date: ${p.date}\n`
  if (p.updated) out += `updated: ${p.updated}\n`
  out += `tags: [${(p.tags || []).join(', ')}]\n`
  if (p.excerpt) out += `excerpt: ${p.excerpt}\n`
  return out + '---\n\n' + p.body
}

const authed = req => {
  const tok = (req.headers.authorization || '').replace('Bearer ', '')
  const exp = tokens.get(tok)
  return !!exp && exp > Date.now()
}

// ---------- helpers ----------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

function send(res, code, body, type = 'application/json; charset=utf-8', headers = {}) {
  res.writeHead(code, { 'Content-Type': type, ...headers })
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body))
}

const readBody = (req, maxSize = 2_000_000) =>
  new Promise((resolve, reject) => {
    let data = ''
    req.on('data', c => {
      data += c
      if (data.length > maxSize) req.destroy()
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })

const readRawBody = (req, maxSize = 15_000_000) =>
  new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', c => {
      chunks.push(c)
      size += c.length
      if (size > maxSize) req.destroy()
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })

// ---------- API ----------
async function handleApi(req, res, path, url) {
  if (path === '/api/posts' && req.method === 'GET') {
    const list = listPosts()
    // summaries by default; ?full=1 includes markdown bodies (the blog frontend uses this)
    return send(res, 200, url.searchParams.has('full') ? list : list.map(({ body, ...rest }) => rest))
  }

  const postMatch = path.match(/^\/api\/posts\/([a-z0-9-]+)$/)
  if (postMatch && req.method === 'GET') {
    const file = join(POSTS_DIR, postMatch[1] + '.md')
    return existsSync(file) ? send(res, 200, postJson(file)) : send(res, 404, { error: 'not found' })
  }

  if (path === '/api/projects' && req.method === 'GET')
    return send(res, 200, existsSync(PROJECTS_FILE) ? readFileSync(PROJECTS_FILE, 'utf8') : '[]')

  if (path === '/api/login' && req.method === 'POST') {
    const body = JSON.parse(await readBody(req).catch(() => '{}'))
    if (body.password !== ADMIN_PASSWORD) return send(res, 401, { error: 'unauthorized' })
    const token = randomUUID().replaceAll('-', '')
    tokens.set(token, Date.now() + 12 * 3600_000)
    return send(res, 200, { token })
  }

  // everything below requires the admin token
  if (path === '/api/admin/check')
    return authed(req) ? send(res, 200, { ok: true }) : send(res, 401, { error: 'unauthorized' })

  const adminPost = path.match(/^\/api\/admin\/posts\/([a-z0-9-]+)$/)
  if (adminPost && req.method === 'PUT') {
    if (!authed(req)) return send(res, 401, { error: 'unauthorized' })
    const slug = adminPost[1]
    if (!VALID_SLUG.test(slug)) return send(res, 400, { error: 'invalid slug' })
    const p = JSON.parse(await readBody(req))
    if (!p.title || !p.date) return send(res, 400, { error: 'title and date are required' })
    writeFileSync(join(POSTS_DIR, slug + '.md'), serializePost(p))
    return send(res, 200, { ok: true })
  }

  if (adminPost && req.method === 'DELETE') {
    if (!authed(req)) return send(res, 401, { error: 'unauthorized' })
    const file = join(POSTS_DIR, adminPost[1] + '.md')
    if (!existsSync(file)) return send(res, 404, { error: 'not found' })
    unlinkSync(file)
    return send(res, 200, { ok: true })
  }

  if (path === '/api/admin/projects' && req.method === 'PUT') {
    if (!authed(req)) return send(res, 401, { error: 'unauthorized' })
    const raw = await readBody(req)
    try {
      JSON.parse(raw)
    } catch {
      return send(res, 400, { error: 'invalid JSON' })
    }
    writeFileSync(PROJECTS_FILE, raw)
    return send(res, 200, { ok: true })
  }

  // ---------- image bed ----------
  if (path === '/api/images' && req.method === 'GET') {
    const meta = loadImageMeta()
    return send(res, 200, Object.entries(meta).map(([name, m]) => ({ name, ...m })))
  }

  if (path === '/api/images' && req.method === 'POST') {
    if (!authed(req)) return send(res, 401, { error: 'unauthorized' })
    const orig = (url.searchParams.get('name') || 'image.png').replace(/[^\w.-]/g, '_')
    const buf = await readRawBody(req)
    if (!buf.length) return send(res, 400, { error: 'empty body' })
    const ext = (orig.match(/\.(\w{2,5})$/)?.[1] || 'png').toLowerCase()
    if (!['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif'].includes(ext))
      return send(res, 400, { error: 'unsupported type' })
    const hash = createHash('sha256').update(buf).digest('hex').slice(0, 16)
    const name = `${hash}.${ext}`
    const file = join(IMAGES_DIR, name)
    if (!existsSync(file)) writeFileSync(file, buf) // content-addressed: same bytes = same name
    const meta = loadImageMeta()
    meta[name] = { orig, size: buf.length, uploaded: new Date().toISOString() }
    saveImageMeta(meta)
    return send(res, 200, { name, url: `/img/${name}`, size: buf.length })
  }

  const imgDel = path.match(/^\/api\/images\/([\w.-]+)$/)
  if (imgDel && req.method === 'DELETE') {
    if (!authed(req)) return send(res, 401, { error: 'unauthorized' })
    const file = join(IMAGES_DIR, imgDel[1])
    if (existsSync(file)) unlinkSync(file)
    const meta = loadImageMeta()
    delete meta[imgDel[1]]
    saveImageMeta(meta)
    return send(res, 200, { ok: true })
  }

  return send(res, 404, { error: 'not found' })
}

// ---------- server ----------
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://x')
      const path = decodeURIComponent(url.pathname)

      if (path.startsWith('/api/')) return await handleApi(req, res, path, url)

      // image bed: content-addressed names are immutable → cache forever
      if (path.startsWith('/img/')) {
        const name = path.slice(5)
        if (!/^[\w.-]+$/.test(name)) return send(res, 400, 'bad name', 'text/plain')
        const file = join(IMAGES_DIR, name)
        if (!existsSync(file)) return send(res, 404, 'not found', 'text/plain')
        return send(res, 200, readFileSync(file),
          MIME[extname(file).toLowerCase()] || 'application/octet-stream',
          { 'Cache-Control': 'public, max-age=31536000, immutable' })
      }

      // static + SPA fallback
      let file = normalize(join(WWWROOT, path))
      if (!file.startsWith(WWWROOT)) return send(res, 403, 'forbidden', 'text/plain')
      if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
      if (!existsSync(file) || !statSync(file).isFile()) {
        if (extname(path)) return send(res, 404, 'not found', 'text/plain')
        file = join(WWWROOT, 'index.html')
      }
      const ext = extname(file).toLowerCase()
      const cache = path.startsWith('/assets/')
        ? 'public, max-age=31536000, immutable'   // hashed build artifacts
        : ext === '.js' || ext === '.css'
          ? 'public, max-age=86400'                // admin page libs etc.
          : 'no-cache'                             // html and everything else
      send(res, 200, readFileSync(file), MIME[ext] || 'application/octet-stream', { 'Cache-Control': cache })
    } catch (err) {
      send(res, 500, { error: 'internal' })
      console.error(err)
    }
  })
  .listen(PORT, () => console.log(`blog server on :${PORT}, data at ${DATA_DIR}`))
