import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { LOJAS } from './mockData'

function normalizeSupabase(row) {
  const cat = row.categorias || {}
  return {
    id: row.id,
    nome: row.nome,
    slug: row.slug,
    categoria: { emoji: cat.emoji || '🏪', nome: cat.nome || 'Outros', slug: cat.slug || 'outros' },
    whatsapp: row.whatsapp,
    endereco: row.endereco || '',
    bairro: row.bairro || 'Riacho Fundo 1',
    distancia: row.distancia_metros ? Math.round(row.distancia_metros) : 999,
    aberta: row.aberta ?? false,
    horario: row.horario_abertura && row.horario_fechamento
      ? `${String(row.horario_abertura).slice(0, 5)} – ${String(row.horario_fechamento).slice(0, 5)}`
      : 'Horário não informado',
    descricao: row.descricao || '',
    produtos: (row.produtos || []).map(p => ({
      id: p.id,
      nome: p.nome,
      preco: p.preco || 0,
      emoji: p.emoji || '🛍️',
      disponivel: p.disponivel ?? true,
    })),
    plano: row.plano || 'vizinho',
    status: row.status || 'ativo',
  }
}

export function useLojas({ categoriaSlug = 'todos', apenasAbertas = false, query = '' } = {}) {
  const [lojas, setLojas] = useState(LOJAS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let q = supabase
      .from('lojas')
      .select('*, categorias(*), produtos(*)')
      .eq('status', 'ativo')

    if (apenasAbertas) q = q.eq('aberta', true)

    q.then(({ data, error }) => {
      if (!error && data?.length) {
        let resultado = data.map(normalizeSupabase)
        if (categoriaSlug !== 'todos') {
          resultado = resultado.filter(l => l.categoria.slug === categoriaSlug)
        }
        if (query.trim()) {
          const qLower = query.toLowerCase()
          resultado = resultado.filter(l =>
            l.nome.toLowerCase().includes(qLower) ||
            l.descricao.toLowerCase().includes(qLower) ||
            l.produtos.some(p => p.nome.toLowerCase().includes(qLower))
          )
        }
        setLojas(resultado)
      } else {
        let fallback = [...LOJAS]
        if (apenasAbertas) fallback = fallback.filter(l => l.aberta)
        if (categoriaSlug !== 'todos') fallback = fallback.filter(l => l.categoria.slug === categoriaSlug)
        if (query.trim()) {
          const qLower = query.toLowerCase()
          fallback = fallback.filter(l =>
            l.nome.toLowerCase().includes(qLower) ||
            l.produtos.some(p => p.nome.toLowerCase().includes(qLower))
          )
        }
        setLojas(fallback)
      }
      setLoading(false)
    })
  }, [categoriaSlug, apenasAbertas, query])

  return { lojas, loading }
}

export function useLoja(id) {
  const [loja, setLoja] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const isUUID = /^[0-9a-f-]{36}$/i.test(id)

    if (!isUUID) {
      setLoja(LOJAS.find(l => l.id === id) || null)
      setLoading(false)
      return
    }

    supabase
      .from('lojas')
      .select('*, categorias(*), produtos(*)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        setLoja(!error && data ? normalizeSupabase(data) : LOJAS.find(l => l.id === id) || null)
        setLoading(false)
      })
  }, [id])

  return { loja, loading }
}

export function useLojista() {
  const [user, setUser] = useState(null)
  const [loja, setLoja] = useState(null)
  const [lojaId, setLojaId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { setLoading(false); return }
      setUser(session.user)

      supabase
        .from('lojas')
        .select('*, categorias(*), produtos(*)')
        .eq('user_id', session.user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setLoja(normalizeSupabase(data))
            setLojaId(data.id)
          } else {
            setLoja(LOJAS[0])
          }
          setLoading(false)
        })
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const toggleAberta = async (novoStatus) => {
    if (!lojaId) return
    await supabase.from('lojas').update({ aberta: novoStatus }).eq('id', lojaId)
  }

  const salvarPerfil = async (dados) => {
    if (!lojaId) return { error: 'Sem loja vinculada' }
    return await supabase.from('lojas').update(dados).eq('id', lojaId)
  }

  const addProduto = async (produto) => {
    if (!lojaId) return { error: 'Sem loja vinculada' }
    return await supabase.from('produtos').insert({ ...produto, loja_id: lojaId })
  }

  const toggleProduto = async (produtoId, disponivel) => {
    return await supabase.from('produtos').update({ disponivel }).eq('id', produtoId)
  }

  const deletarProduto = async (produtoId) => {
    return await supabase.from('produtos').delete().eq('id', produtoId)
  }

  return { user, loja, lojaId, loading, toggleAberta, salvarPerfil, addProduto, toggleProduto, deletarProduto }
}
