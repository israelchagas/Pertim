export const CATEGORIAS = [
  { id: 'todos',      emoji: '🏪', nome: 'Todos',       slug: 'todos' },
  { id: 'padaria',    emoji: '🍞', nome: 'Padaria',      slug: 'padaria' },
  { id: 'mercado',    emoji: '🛒', nome: 'Mercado',      slug: 'mercado' },
  { id: 'hortifruti', emoji: '🥬', nome: 'Hortifruti',   slug: 'hortifruti' },
  { id: 'farmacia',   emoji: '💊', nome: 'Farmácia',     slug: 'farmacia' },
  { id: 'ferragens',  emoji: '🔧', nome: 'Ferragens',    slug: 'ferragens' },
  { id: 'lanchonete', emoji: '🍔', nome: 'Lanchonete',   slug: 'lanchonete' },
  { id: 'doceria',    emoji: '🎂', nome: 'Doceria',      slug: 'doceria' },
  { id: 'beleza',     emoji: '💈', nome: 'Beleza',       slug: 'beleza' },
  { id: 'servicos',   emoji: '🛠️', nome: 'Serviços',     slug: 'servicos' },
]

export const LOJAS = [
  {
    id: '1',
    nome: 'Padaria Amanhecer',
    categoria: { emoji: '🍞', nome: 'Padaria', slug: 'padaria' },
    whatsapp: '61999990001',
    endereco: 'QR 409, Lote 12',
    bairro: 'Riacho Fundo 1',
    distancia: 180,
    aberta: true,
    horario: '06:00 – 20:00',
    descricao: 'Pães frescos, bolos e salgados feitos na hora. Tradição há 15 anos no Riacho Fundo.',
    produtos: [
      { id: 'p1', nome: 'Pão Francês', preco: 0.90, emoji: '🥖', disponivel: true },
      { id: 'p2', nome: 'Bolo de Cenoura', preco: 28.00, emoji: '🎂', disponivel: true },
      { id: 'p3', nome: 'Coxinha', preco: 5.00, emoji: '🍗', disponivel: true },
      { id: 'p4', nome: 'Pão de Queijo', preco: 3.50, emoji: '🧀', disponivel: true },
    ],
  },
  {
    id: '2',
    nome: 'Mercadinho do Eduardo',
    categoria: { emoji: '🛒', nome: 'Mercado', slug: 'mercado' },
    whatsapp: '61999990002',
    endereco: 'QR 411, Lote 3',
    bairro: 'Riacho Fundo 1',
    distancia: 320,
    aberta: true,
    horario: '07:00 – 22:00',
    descricao: 'Produtos básicos, bebidas geladas e conveniência. Sempre aberto quando você precisa.',
    produtos: [
      { id: 'p5', nome: 'Água Mineral 500ml', preco: 2.50, emoji: '💧', disponivel: true },
      { id: 'p6', nome: 'Refrigerante 2L', preco: 8.90, emoji: '🥤', disponivel: true },
      { id: 'p7', nome: 'Arroz 5kg', preco: 22.00, emoji: '🍚', disponivel: false },
    ],
  },
  {
    id: '3',
    nome: 'Hortifruti da Ana',
    categoria: { emoji: '🥬', nome: 'Hortifruti', slug: 'hortifruti' },
    whatsapp: '61999990003',
    endereco: 'QR 408, Lote 7',
    bairro: 'Riacho Fundo 1',
    distancia: 410,
    aberta: true,
    horario: '06:30 – 18:00',
    descricao: 'Frutas, verduras e legumes frescos todo dia, direto da CEASA.',
    produtos: [
      { id: 'p8', nome: 'Banana Prata (kg)', preco: 4.50, emoji: '🍌', disponivel: true },
      { id: 'p9', nome: 'Tomate (kg)', preco: 6.00, emoji: '🍅', disponivel: true },
      { id: 'p10', nome: 'Alface', preco: 2.50, emoji: '🥬', disponivel: true },
    ],
  },
  {
    id: '4',
    nome: 'Farmácia Saúde DF',
    categoria: { emoji: '💊', nome: 'Farmácia', slug: 'farmacia' },
    whatsapp: '61999990004',
    endereco: 'QR 406, Lote 1',
    bairro: 'Riacho Fundo 1',
    distancia: 550,
    aberta: true,
    horario: '07:00 – 21:00',
    descricao: 'Medicamentos, cosméticos e cuidados pessoais. Atendimento humanizado.',
    produtos: [
      { id: 'p11', nome: 'Dipirona 500mg', preco: 12.90, emoji: '💊', disponivel: true },
      { id: 'p12', nome: 'Protetor Solar FPS50', preco: 29.90, emoji: '🧴', disponivel: true },
    ],
  },
  {
    id: '5',
    nome: 'Ferragens do Riacho',
    categoria: { emoji: '🔧', nome: 'Ferragens', slug: 'ferragens' },
    whatsapp: '61999990005',
    endereco: 'QR 412, Lote 15',
    bairro: 'Riacho Fundo 1',
    distancia: 680,
    aberta: false,
    horario: '08:00 – 18:00',
    descricao: 'Material de construção, ferramentas e utilidades para sua casa.',
    produtos: [
      { id: 'p13', nome: 'Cola Instantânea', preco: 6.90, emoji: '🔩', disponivel: true },
      { id: 'p14', nome: 'Fita Isolante', preco: 4.50, emoji: '🔌', disponivel: true },
    ],
  },
  {
    id: '6',
    nome: 'Confeitaria da Cida',
    categoria: { emoji: '🎂', nome: 'Doceria', slug: 'doceria' },
    whatsapp: '61999990006',
    endereco: 'QR 407, Lote 9',
    bairro: 'Riacho Fundo 1',
    distancia: 290,
    aberta: true,
    horario: '09:00 – 19:00',
    descricao: 'Bolos artesanais, doces finos e tortas para todas as ocasiões. Encomendas com 24h de antecedência.',
    produtos: [
      { id: 'p15', nome: 'Bolo de Chocolate', preco: 65.00, emoji: '🎂', disponivel: true },
      { id: 'p16', nome: 'Brigadeiro (cx 12)', preco: 25.00, emoji: '🍫', disponivel: true },
      { id: 'p17', nome: 'Torta de Morango', preco: 75.00, emoji: '🍓', disponivel: false },
    ],
  },
  {
    id: '7',
    nome: 'Lanchonete do Seu Zé',
    categoria: { emoji: '🍔', nome: 'Lanchonete', slug: 'lanchonete' },
    whatsapp: '61999990007',
    endereco: 'QR 410, Lote 2',
    bairro: 'Riacho Fundo 1',
    distancia: 230,
    aberta: true,
    horario: '11:00 – 22:00',
    descricao: 'X-burgão, misto quente e salgados. A pedida da galera do bairro há 20 anos.',
    produtos: [
      { id: 'p18', nome: 'X-Burgão', preco: 18.00, emoji: '🍔', disponivel: true },
      { id: 'p19', nome: 'Pastel de Carne', preco: 7.00, emoji: '🥟', disponivel: true },
      { id: 'p20', nome: 'Açaí 500ml', preco: 16.00, emoji: '🫐', disponivel: true },
    ],
  },
  {
    id: '8',
    nome: 'Elétrica JB',
    categoria: { emoji: '🛠️', nome: 'Serviços', slug: 'servicos' },
    whatsapp: '61999990008',
    endereco: 'QR 405, Lote 22',
    bairro: 'Riacho Fundo 1',
    distancia: 780,
    aberta: false,
    horario: '08:00 – 17:00',
    descricao: 'Serviços elétricos residenciais. Instalações, reparos e laudos. Profissional certificado.',
    produtos: [],
  },
]

export function buscarLojas({ query = '', categoriaSlug = 'todos', apenasAbertas = false }) {
  let resultado = [...LOJAS]

  if (apenasAbertas) resultado = resultado.filter(l => l.aberta)

  if (categoriaSlug && categoriaSlug !== 'todos') {
    resultado = resultado.filter(l => l.categoria.slug === categoriaSlug)
  }

  if (query.trim()) {
    const q = query.toLowerCase()
    resultado = resultado.filter(l =>
      l.nome.toLowerCase().includes(q) ||
      l.categoria.nome.toLowerCase().includes(q) ||
      l.descricao?.toLowerCase().includes(q) ||
      l.produtos.some(p => p.nome.toLowerCase().includes(q))
    )
  }

  return resultado.sort((a, b) => a.distancia - b.distancia)
}
