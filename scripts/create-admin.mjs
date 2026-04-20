import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://efvkyfysvwnbnynwopsn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmdmt5ZnlzdnduYm55bndvcHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NjU4OTAsImV4cCI6MjA5MTM0MTg5MH0.FNbxb0XzusIgEar66BI7UzkMiJFa1imqcgnYiD98LVM'
)

const EMAIL    = 'admin.pertim@pertim.online'
const PASSWORD = 'mk190jkl'

console.log('⏳ Criando usuário admin...\n')

const { data, error } = await supabase.auth.signUp({
  email: EMAIL,
  password: PASSWORD,
  options: {
    data: { role: 'admin', nome: 'Admin Pertim' },
  },
})

if (error) {
  if (error.message.includes('already registered')) {
    console.log('ℹ️  Usuário já existe. Tentando login...')
    const { data: login, error: loginErr } = await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD })
    if (loginErr) {
      console.error('❌ Erro no login:', loginErr.message)
    } else {
      console.log('✅ Login bem-sucedido!')
      console.log('   ID:', login.user.id)
      console.log('   Email:', login.user.email)
    }
  } else {
    console.error('❌ Erro:', error.message)
  }
  process.exit(0)
}

const userId = data.user?.id
console.log('✅ Usuário admin criado!')
console.log('   ID:', userId)
console.log('   Email:', EMAIL)
console.log()

if (data.session) {
  console.log('✅ Login ativo (email confirmado automaticamente).')
} else {
  console.log('⚠️  Email de confirmação enviado para:', EMAIL)
  console.log()
  console.log('   Para pular a confirmação, vá em:')
  console.log('   Supabase → Authentication → Settings → desabilite "Email Confirmations"')
  console.log()
  console.log('   OU execute este SQL no Supabase SQL Editor:')
  console.log(`   UPDATE auth.users SET email_confirmed_at = now() WHERE id = '${userId}';`)
}

console.log()
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('   Credenciais do painel admin:')
console.log(`   URL:   https://pertim.online/admin`)
console.log(`   Email: ${EMAIL}`)
console.log(`   Senha: ${PASSWORD}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log()
console.log('⚠️  Troque a senha após o primeiro acesso em produção!')
