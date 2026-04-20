/**
 * Executa o supabase/schema.sql no banco de dados do Supabase.
 *
 * Uso:
 *   node scripts/migrate.mjs
 *
 * Requer UMA das variáveis abaixo no .env:
 *   SUPABASE_ACCESS_TOKEN   → Personal Access Token de app.supabase.com/account/tokens
 *   DATABASE_URL            → postgresql://postgres:[senha]@db.efvkyfysvwnbnynwopsn.supabase.co:5432/postgres
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT  = join(__dir, '..')

// ─── Carrega .env manualmente ───────────────────────────────────────────────
const envPath = join(ROOT, '.env')
const env = {}
try {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  })
} catch {}

const PROJECT_REF    = 'efvkyfysvwnbnynwopsn'
const ACCESS_TOKEN   = env.SUPABASE_ACCESS_TOKEN || process.env.SUPABASE_ACCESS_TOKEN
const DATABASE_URL   = env.DATABASE_URL          || process.env.DATABASE_URL
const SERVICE_KEY    = env.SUPABASE_SERVICE_ROLE_KEY

// ─── Lê o schema ────────────────────────────────────────────────────────────
const schemaSQL = readFileSync(join(ROOT, 'supabase', 'schema.sql'), 'utf8')

// ─── Divide em statements individuais ───────────────────────────────────────
function splitSQL(sql) {
  const stmts = []
  let cur = ''
  let inDollar = false

  for (const line of sql.split('\n')) {
    if (line.trim().startsWith('--')) { continue }
    if (line.includes('$$')) inDollar = !inDollar
    cur += line + '\n'
    if (!inDollar && line.trimEnd().endsWith(';')) {
      const stmt = cur.trim()
      if (stmt.length > 1) stmts.push(stmt)
      cur = ''
    }
  }
  if (cur.trim().length > 1) stmts.push(cur.trim())
  return stmts
}

// ─── Método 1: Supabase Management API ──────────────────────────────────────
async function viaManagementAPI(sql) {
  const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.message || body?.error || `HTTP ${res.status}`)
  return body
}

// ─── Método 2: pg direto ─────────────────────────────────────────────────────
async function viaDirectDB(url) {
  const { default: pg } = await import('pg')
  const { Client } = pg
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
  await client.connect()
  try {
    await client.query(schemaSQL)
  } finally {
    await client.end()
  }
}

// ─── Execução ────────────────────────────────────────────────────────────────
console.log('\n🗄️  Pertim — Migração do banco de dados\n')

if (!ACCESS_TOKEN && !DATABASE_URL) {
  console.log('❌  Nenhuma credencial encontrada.\n')
  console.log('Adicione UMA dessas linhas ao seu .env e rode novamente:\n')
  console.log('  Opção A — Personal Access Token (recomendado):')
  console.log('  SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  console.log('  → Crie em: https://supabase.com/dashboard/account/tokens\n')
  console.log('  Opção B — Connection String direta:')
  console.log('  DATABASE_URL=postgresql://postgres:[SENHA]@db.efvkyfysvwnbnynwopsn.supabase.co:5432/postgres')
  console.log('  → Copie em: Supabase > Settings > Database > Connection string\n')
  process.exit(1)
}

try {
  if (DATABASE_URL && !DATABASE_URL.includes('[SENHA]') && !DATABASE_URL.includes('your_')) {
    console.log('🔌  Usando conexão PostgreSQL direta...')
    await viaDirectDB(DATABASE_URL)
    console.log('✅  Schema executado com sucesso!')

  } else if (ACCESS_TOKEN && !ACCESS_TOKEN.startsWith('your_') && !ACCESS_TOKEN.startsWith('sb_secret_')) {
    console.log('🔑  Usando Management API (Access Token)...')
    const stmts = splitSQL(schemaSQL)
    console.log(`📝  ${stmts.length} statements encontrados\n`)

    let ok = 0, err = 0
    for (const stmt of stmts) {
      const preview = stmt.slice(0, 60).replace(/\n/g, ' ')
      try {
        await viaManagementAPI(stmt)
        console.log(`  ✓  ${preview}`)
        ok++
      } catch (e) {
        if (e.message.includes('already exists') || e.message.includes('duplicate')) {
          console.log(`  ↩  (já existe) ${preview}`)
          ok++
        } else {
          console.log(`  ✗  ${preview}`)
          console.log(`     Erro: ${e.message}`)
          err++
        }
      }
    }
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`✅  ${ok} OK   ❌  ${err} erros`)

  } else {
    throw new Error('Credencial encontrada mas parece ser um placeholder. Substitua pelo valor real.')
  }
} catch (e) {
  console.error('\n❌  Erro:', e.message)
  process.exit(1)
}

console.log('\n📋  Próximos passos:')
console.log('  1. Execute: UPDATE auth.users SET email_confirmed_at = now()')
console.log(`     WHERE id = 'e9bfcbab-be56-4354-aa63-7b0b2787cf6f';`)
console.log('  2. Acesse /admin para verificar o painel')
console.log('  3. Acesse /app para testar o app do consumidor\n')
