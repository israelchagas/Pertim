import React, { useState, useEffect } from 'react';
import { MapPin, Search, Store, MessageCircle, Clock, ChevronDown, CheckCircle, Smartphone, Zap, Users, Star, Shield, TrendingUp, Heart, ArrowRight } from 'lucide-react';

/* ─── HEADER ─── */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-inner">
          <div className="logo">
            <MapPin size={26} color="var(--green)" strokeWidth={2.5} />
            <span>Pertim<span className="logo-dot">.</span></span>
          </div>

          <nav className="nav">
            <a href="#como-funciona" onClick={e=>{e.preventDefault();scrollTo('como-funciona')}}>Como Funciona</a>
            <a href="#lojistas" onClick={e=>{e.preventDefault();scrollTo('lojistas')}}>Para Lojistas</a>
            <a href="#quem-somos" onClick={e=>{e.preventDefault();scrollTo('quem-somos')}}>Sobre</a>
            <a href="#faq" onClick={e=>{e.preventDefault();scrollTo('faq')}}>FAQ</a>
          </nav>

          <div className="nav-ctas">
            <button className="btn btn-ghost btn-sm" onClick={() => scrollTo('lojistas')}>
              Sou Lojista
            </button>
            <button className="btn btn-green btn-sm">
              <Smartphone size={16} /> Baixar App
            </button>
          </div>

          <button
            className={`menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <a onClick={() => scrollTo('como-funciona')}>Como Funciona</a>
        <a onClick={() => scrollTo('lojistas')}>Para Lojistas</a>
        <a onClick={() => scrollTo('quem-somos')}>Sobre</a>
        <a onClick={() => scrollTo('faq')}>Dúvidas Frequentes</a>
        <button className="btn btn-green btn-md" onClick={() => setMenuOpen(false)}>
          <Smartphone size={18} /> Baixar o App Grátis
        </button>
      </div>
    </header>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-badge fade-up">
          <span className="live-dot" />
          Hiperlocal · Em tempo real
        </div>

        <h1 className="fade-up delay-1">
          O que você precisa, na{' '}
          <span className="text-gradient">loja ao lado</span>{' '}
          da sua casa.{' '}
          <span className="text-amber">Agora.</span>
        </h1>

        <p className="hero-sub fade-up delay-2">
          Pare de garimpar no Google ou ligar para cada loja.{' '}
          O Pertim conecta você ao comércio do seu bairro em segundos —
          só quem está <strong>aberto agora</strong> e <strong>tem o que você quer</strong>.
        </p>

        <div className="hero-ctas fade-up delay-3">
          <button className="btn btn-green btn-lg">
            <Smartphone size={20} /> Baixar o App Grátis
          </button>
          <button
            className="btn btn-ghost btn-lg"
            onClick={() => document.getElementById('lojistas')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Tenho um comércio <ArrowRight size={18} />
          </button>
        </div>

        <div className="hero-trust fade-up delay-4">
          <div className="trust-item">
            <div className="avatars-group">
              <img src="https://i.pravatar.cc/100?img=5" alt="" />
              <img src="https://i.pravatar.cc/100?img=12" alt="" />
              <img src="https://i.pravatar.cc/100?img=26" alt="" />
              <img src="https://i.pravatar.cc/100?img=33" alt="" />
            </div>
            <span>+5.000 vizinhos já usam</span>
          </div>
          <span className="trust-dot">·</span>
          <div className="trust-item">
            <Star size={15} color="var(--amber)" fill="var(--amber)" />
            <span>4.9 · App Store & Play Store</span>
          </div>
          <span className="trust-dot">·</span>
          <div className="trust-item">
            <Shield size={15} color="var(--green)" />
            <span>100% gratuito para usar</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="float-phone">
            <div className="phone-frame">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-screen-header">
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <MapPin size={14} color="var(--green)" />
                    <span style={{fontSize:'.72rem',fontWeight:700}}>Vila Madalena, SP</span>
                  </div>
                  <span style={{fontSize:'.65rem',background:'var(--green-light)',color:'var(--green-dark)',padding:'2px 8px',borderRadius:'9999px',fontWeight:700}}>Aberto Agora</span>
                </div>
                <div className="phone-search">
                  <Search size={13} />
                  <span>"Cola instantânea"</span>
                </div>
                <div className="phone-results-title">3 resultados próximos</div>
                {[
                  { icon:'🏪', name:'Ferragens do Seu Zé', dist:'180m', color:'#FFF3CD' },
                  { icon:'🛒', name:'Mercadinho Central', dist:'350m', color:'#D4EDDA' },
                  { icon:'🏠', name:'Casa & Lar Material', dist:'520m', color:'#CCE5FF' },
                ].map((r,i) => (
                  <div key={i} className="phone-result-card">
                    <div className="phone-result-icon" style={{background:r.color}}>
                      {r.icon}
                    </div>
                    <div className="phone-result-info">
                      <div className="phone-result-name">{r.name}</div>
                      <div className="phone-result-dist">📍 {r.dist} de você</div>
                    </div>
                    <div className="phone-open-badge">Aberta</div>
                  </div>
                ))}
                <div style={{marginTop:12,textAlign:'center'}}>
                  <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'var(--green)',color:'#fff',borderRadius:'9999px',padding:'9px 18px',fontSize:'.72rem',fontWeight:700}}>
                    <MessageCircle size={12} /> Falar no WhatsApp
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS BAR ─── */
function StatsBar() {
  const stats = [
    { number: '+120', label: 'Bairros conectados' },
    { number: '+850', label: 'Lojistas parceiros' },
    { number: '23s', label: 'Tempo médio de busca' },
    { number: '0%', label: 'Taxa sobre suas vendas' },
  ];
  return (
    <section className="stats-bar">
      <div className="container">
        <div className="stats-inner">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number text-gradient">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
function HowItWorks() {
  const [tab, setTab] = useState('consumer');

  const consumerSteps = [
    {
      number: '01',
      icon: '🔍',
      title: 'Digite o que precisa',
      desc: 'Escreva qualquer produto ou serviço. Sem navegar por categorias infinitas. O Pertim entende linguagem natural como "conserto de bicicleta" ou "fermento em pó".',
    },
    {
      number: '02',
      icon: '⚡',
      title: 'Veja quem tem, aberto agora',
      desc: 'O algoritmo filtra automaticamente só as lojas abertas neste exato momento, com o item em estoque, ordenadas pela distância real até você.',
    },
    {
      number: '03',
      icon: '💬',
      title: 'Resolva em 1 clique',
      desc: 'Toque em "Falar com a loja" e caia direto no WhatsApp deles. Reserve, negocie e combine — sem carrinho complexo, sem taxas, sem espera.',
    },
  ];

  const lojistasSteps = [
    {
      number: '01',
      icon: '📸',
      title: 'Tire uma foto',
      desc: 'Aponte a câmera pro produto e publique. Assim como você faria no Instagram. Nenhum sistema, nenhuma planilha, nenhum treinamento.',
    },
    {
      number: '02',
      icon: '📡',
      title: 'Apareça para quem está perto',
      desc: 'Seus produtos aparecem instantaneamente para todos os moradores do seu bairro que buscarem por eles. Visibilidade hiperlocal em tempo real.',
    },
    {
      number: '03',
      icon: '💰',
      title: 'Feche a venda no WhatsApp',
      desc: 'O cliente te contata direto. Você negocia, combina entrega ou retirada e recebe do jeito que preferir. 100% do lucro no seu bolso.',
    },
  ];

  const steps = tab === 'consumer' ? consumerSteps : lojistasSteps;

  return (
    <section id="como-funciona" className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 48 }}>
          <div className="section-tag">
            <Zap size={13} /> Como Funciona
          </div>
          <h2 className="section-title">
            Simples do jeito que deveria ser
          </h2>
          <p className="section-sub">
            Projetado para quem não tem tempo a perder — seja você um morador com urgência ou um lojista no meio do rush.
          </p>
        </div>

        <div className="how-tabs">
          <button
            className={`how-tab ${tab === 'consumer' ? 'active' : ''}`}
            onClick={() => setTab('consumer')}
          >
            Para Moradores
          </button>
          <button
            className={`how-tab ${tab === 'lojistas' ? 'active' : ''}`}
            onClick={() => setTab('lojistas')}
          >
            Para Lojistas
          </button>
        </div>

        <div className="how-steps">
          {steps.map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONSUMER FEATURES ─── */
function ConsumerFeatures() {
  return (
    <section className="section" style={{ background: 'var(--white)' }}>
      <div className="container">
        <div className="features-split">
          <div>
            <div className="section-tag">
              <Clock size={13} /> Para Moradores
            </div>
            <h2 className="section-title">
              Sua urgência não pode esperar um dia de entrega.
            </h2>
            <p className="section-sub">
              Você precisa de gelo agora, da cola que vai secar antes da noite, do remédio que acabou. O Pertim foi feito exatamente para esses momentos.
            </p>
            <div className="features-list">
              {[
                {
                  icon: '🎯',
                  title: 'Busca por urgência real',
                  desc: 'Filtragem automática de lojas abertas agora. Nenhum resultado de loja fechada te frustrando.',
                },
                {
                  icon: '📍',
                  title: 'Só o que está próximo de você',
                  desc: 'Relevância por distância real, não por quem pagou mais para aparecer. O mais perto vem primeiro.',
                },
                {
                  icon: '💬',
                  title: 'Negociação humana, não robótica',
                  desc: 'Sem carrinho, sem checkout complicado. Você fala com uma pessoa real que conhece o estoque.',
                },
                {
                  icon: '🆓',
                  title: 'Sem custo algum para você',
                  desc: 'O app é, e sempre será, 100% gratuito para quem busca. Sem anúncios invasivos. Sem truques.',
                },
              ].map((f, i) => (
                <div key={i} className="feature-item">
                  <div className="feature-icon-wrap">{f.icon}</div>
                  <div className="feature-text">
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="visual-block">
            <div className="visual-emoji-grid">
              {[
                { emoji:'🥖', label:'Padaria aberta' },
                { emoji:'🔧', label:'Ferragens' },
                { emoji:'💊', label:'Farmácia' },
                { emoji:'🌿', label:'Hortifruti' },
                { emoji:'🎂', label:'Confeitaria' },
                { emoji:'🚿', label:'Encanador' },
              ].map((c, i) => (
                <div key={i} className="visual-emoji-card">
                  <span className="emoji">{c.emoji}</span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
            <div className="visual-label">
              Tudo isso, na sua rua.<br />
              <span>Disponível agora.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── BENEFITS ─── */
function Benefits() {
  const cards = [
    {
      icon: '⏱️',
      tag: 'Economia de tempo',
      title: 'Minutos, não horas.',
      desc: 'Enquanto você esperaria uma entrega de marketplace no dia seguinte, o Pertim te conecta a uma loja a 200m de você que tem o produto agora.',
      featured: false,
    },
    {
      icon: '🏘️',
      tag: 'Comércio local',
      title: 'Seu dinheiro fica no bairro.',
      desc: 'Cada compra feita pelo Pertim vai diretamente para o caixa de um comerciante local — o vizinho que acorda cedo e fecha tarde para servir a comunidade.',
      featured: false,
    },
    {
      icon: '🌟',
      tag: 'Destaque máximo',
      title: 'Pequena loja, grande alcance.',
      desc: 'No Pertim, a padaria do Seu João compete em igualdade com qualquer grande rede — porque o critério é proximidade e disponibilidade, não budget de anúncio.',
      featured: true,
    },
    {
      icon: '🤝',
      tag: 'Sem intermediários',
      title: 'Relação direta, confiança de sempre.',
      desc: 'Você fala com uma pessoa real. Sem chatbots. Sem políticas de devolução kafkianas. Do jeito que era a compra de balcão, mas no seu celular.',
      featured: false,
    },
    {
      icon: '💸',
      tag: 'Zero taxa',
      title: 'Comissão zero. Pra sempre.',
      desc: 'Diferente dos grandes marketplaces, não existe taxa por venda no plano base. O que você vende, é seu. 100%.',
      featured: false,
    },
  ];

  return (
    <section id="beneficios" className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div className="text-center">
          <div className="section-tag">
            <Heart size={13} /> Por que o Pertim
          </div>
          <h2 className="section-title">Feito para o bairro, não para o algoritmo.</h2>
          <p className="section-sub">
            Enquanto outros marketplaces maximizam o clique, nós maximizamos a conexão humana com o comércio local.
          </p>
        </div>

        <div className="benefits-grid">
          {cards.map((c, i) => (
            <div key={i} className={`benefit-card ${c.featured ? 'featured' : ''}`}>
              <div className="benefit-icon">{c.icon}</div>
              <div className="benefit-tag">
                <CheckCircle size={11} /> {c.tag}
              </div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── B2B / LOJISTAS ─── */
function Lojistas() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ nome: '', loja: '', whatsapp: '', tipo: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="lojistas" className="b2b">
      <div className="container">
        <div className="b2b-inner">
          <div className="b2b-copy">
            <div className="section-tag">
              <Store size={13} /> Para Lojistas
            </div>
            <h2>
              Seus vizinhos estão buscando o que você vende. <span className="text-gradient">Eles só não sabem que você tem.</span>
            </h2>
            <p>
              iFood cobra 30% e exige delivery. Mercado Livre quer gestão de catálogo complexa. O Pertim foi desenhado para a realidade do pequeno comércio de bairro: sem burocracia, sem taxas absurdas, sem curva de aprendizado.
            </p>

            <div className="b2b-checklist">
              {[
                'Cadastro em menos de 5 minutos — só pelo celular.',
                'Publique um produto como se fosse um Story no Instagram.',
                'Clientes te chamam no WhatsApp — você fecha sem intermediário.',
                'Zero comissão por venda no plano base. Seu lucro é seu.',
                'Sem computador, sem planilha, sem ERP. Apenas fotos.',
                'Apareça para todos os moradores num raio de até 5 km.',
              ].map((item, i) => (
                <div key={i} className="b2b-check">
                  <div className="b2b-check-icon">✓</div>
                  <span className="b2b-check-text">{item}</span>
                </div>
              ))}
            </div>

            <div className="b2b-ctas">
              <button className="btn btn-green btn-lg" onClick={() => document.querySelector('.register-card')?.scrollIntoView({ behavior: 'smooth' })}>
                Quero Cadastrar Minha Loja
              </button>
              <button className="btn btn-outline-white btn-lg">
                Ver Como Funciona
              </button>
            </div>
          </div>

          <div className="register-card">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
                <h3>Cadastro recebido!</h3>
                <p style={{ color: 'var(--slate-500)', marginTop: 12, lineHeight: 1.7 }}>
                  Nossa equipe vai entrar em contato pelo WhatsApp em até 24 horas para ativar sua vitrine. Fique de olho!
                </p>
                <div style={{ marginTop: 24, padding: 16, background: 'var(--green-light)', borderRadius: 'var(--r-md)', fontSize: '.85rem', color: 'var(--green-dark)', fontWeight: 600 }}>
                  ✅ Seus primeiros 90 dias com visibilidade premium — grátis.
                </div>
              </div>
            ) : (
              <>
                <h3>Traga sua loja para o Pertim</h3>
                <p>Gratuito. Sem fidelidade. Sem taxa de adesão.</p>
                <form className="form-row" onSubmit={handleSubmit}>
                  <div className="form-field">
                    <label>Seu nome</label>
                    <input
                      type="text"
                      placeholder="Ex: João Silva"
                      value={form.nome}
                      onChange={e => setForm({...form, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Nome da loja</label>
                    <input
                      type="text"
                      placeholder="Ex: Padaria Central"
                      value={form.loja}
                      onChange={e => setForm({...form, loja: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={form.whatsapp}
                      onChange={e => setForm({...form, whatsapp: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Tipo de negócio</label>
                    <select
                      value={form.tipo}
                      onChange={e => setForm({...form, tipo: e.target.value})}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option>Padaria / Confeitaria</option>
                      <option>Mercearia / Mercadinho</option>
                      <option>Hortifruti</option>
                      <option>Farmácia</option>
                      <option>Ferragens / Material de Construção</option>
                      <option>Prestador de Serviços</option>
                      <option>Restaurante / Lanchonete</option>
                      <option>Outro comércio local</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-green btn-lg">
                    Quero Minha Vitrine Grátis <ArrowRight size={18} />
                  </button>
                </form>
                <p className="register-guarantee">
                  🔒 Seus dados estão seguros. Sem spam. Jamais compartilhamos com terceiros.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── MANIFESTO / QUEM SOMOS ─── */
function Manifesto() {
  return (
    <section id="quem-somos" className="manifesto">
      <div className="container">
        <div className="manifesto-inner">
          <div>
            <div className="section-tag">
              <Heart size={13} /> Nossa Missão
            </div>
            <blockquote>
              "O maior ativo do seu bairro são os{' '}
              <em>comerciantes que estão lá</em>{' '}
              todos os dias. Eles só precisam de{' '}
              <em>visibilidade digital</em>."
            </blockquote>
            <div className="manifesto-body">
              <p style={{ marginBottom: 20 }}>
                O Pertim nasceu de uma frustração simples: por que é tão difícil saber se a ferragem da esquina tem o parafuso certo? Por que você precisa dirigir 20 minutos até um shopping quando a solução está a 3 quarteirões?
              </p>
              <p style={{ marginBottom: 20 }}>
                Vimos grandes plataformas drenarem margem dos pequenos comerciantes com taxas de 20% a 35%. Vimos donos de padaria desistirem do digital por achar que precisavam de um curso de informática.
              </p>
              <p>
                Construímos o Pertim para ser o elo que deveria existir: tão simples quanto mandar uma foto no WhatsApp, mas com o poder de colocar qualquer pequeno negócio no mapa digital do seu bairro. <strong>Nada mais, nada menos.</strong>
              </p>
            </div>
          </div>

          <div className="manifesto-stats">
            {[
              { number: '73%', label: 'dos brasileiros prefere comprar em comércios locais quando sabe que o produto está disponível', color: 'var(--green)' },
              { number: 'R$890M', label: 'em vendas são perdidas por pequenos comércios por falta de visibilidade digital (SEBRAE, 2024)', color: 'var(--amber)' },
              { number: '3x', label: 'mais rápido encontrar um produto pelo Pertim do que pelo Google Meu Negócio', color: 'var(--text)' },
            ].map((s, i) => (
              <div key={i} className="m-stat">
                <div className="m-stat-number" style={{ color: s.color }}>{s.number}</div>
                <div className="m-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ─── */
function Testimonials() {
  const testimonials = [
    {
      stars: 5,
      quote: '"Quebrou uma telha às 18h de sábado, a loja de material fechando. Abri o Pertim, achei um depósito aberto a 4 quarteirões, fui de bike e resolvi em 40 minutos. Isso simplesmente não existia antes."',
      name: 'Marcos Silveira',
      role: 'Morador do Riacho Fundo 1, DF',
      avatar: 'https://i.pravatar.cc/100?img=11',
      tag: 'Consumidor',
      featured: false,
    },
    {
      stars: 5,
      quote: '"Minha boleira não tem Instagram, não tem site, não tem nada. Em 10 minutos no Pertim eu tirei foto das minhas tortas, publiquei, e em 1 hora recebi 3 pedidos de vizinhos que nem sabiam que eu existia. Não acreditei."',
      name: 'Cida Mendonça',
      role: 'Boleira Artesanal · Riacho Fundo 1, DF',
      avatar: 'https://i.pravatar.cc/100?img=44',
      tag: 'Lojista',
      featured: true,
    },
    {
      stars: 5,
      quote: '"Procurei "encanador agora" e apareceu o Zé da rua de trás. Ele estava em casa, foi em 20 minutos. Sem app de intermediário, sem taxa, sem drama. Isso é o que o digital devia ter feito desde sempre."',
      name: 'Fernanda Costa',
      role: 'Moradora do Riacho Fundo 1, DF',
      avatar: 'https://i.pravatar.cc/100?img=21',
      tag: 'Consumidor',
      featured: false,
    },
    {
      stars: 5,
      quote: '"O iFood me cobrava 28% de comissão e ainda exigia que eu tivesse motoboy. No Pertim, o cliente vem buscar ou eu combino entrega direto no WhatsApp. Minha margem voltou a respirar."',
      name: 'Comerciante Local',
      role: 'Dono de comércio local · Riacho Fundo 1, DF',
      avatar: 'https://i.pravatar.cc/100?img=52',
      tag: 'Lojista',
      featured: false,
    },
    {
      stars: 5,
      quote: '"Preciso aqui é o único app que mostra se a loja está ABERTA AGORA. Google Meu Negócio mente. iFood é de delivery. Aqui eu realmente sei quem posso correr agora."',
      name: 'Ana Lucia Ramos',
      role: 'Moradora do Riacho Fundo 1, DF',
      avatar: 'https://i.pravatar.cc/100?img=9',
      tag: 'Consumidor',
      featured: false,
    },
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <div className="text-center">
          <div className="section-tag">
            <Star size={13} /> Depoimentos
          </div>
          <h2 className="section-title">O bairro já está falando</h2>
          <p className="section-sub">
            Histórias reais de moradores e lojistas que transformaram a relação com o comércio local.
          </p>
        </div>

        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div key={i} className={`testi-card ${t.featured ? 'featured' : ''}`}>
              <div className="testi-stars">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="testi-quote">{t.quote}</p>
              <div className="testi-author">
                <img src={t.avatar} alt={t.name} className="testi-avatar" />
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
                <div className="testi-tag" style={{ marginLeft: 'auto' }}>
                  {t.tag === 'Lojista' ? <Store size={10} /> : <MapPin size={10} />}
                  {t.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── OBJECTIONS ─── */
function Objections() {
  const items = [
    {
      q: '"Outro marketplace me cobra comissão. No Pertim também vai rolar isso?"',
      a: 'Não existe comissão por venda no plano base, para sempre. Você paga apenas se quiser recursos de visibilidade premium no futuro — e mesmo assim é uma assinatura fixa, não uma mordida no seu lucro.',
    },
    {
      q: '"Não sei nada de tecnologia. Vou conseguir usar?"',
      a: 'Se você consegue tirar uma foto e mandar no WhatsApp, você consegue usar o Pertim. Não existe nenhuma outra habilidade necessária. Nosso processo de onboarding leva menos de 5 minutos.',
    },
    {
      q: '"Meu estoque muda o tempo todo. E aí?"',
      a: 'Exatamente para isso que fomos feitos. Você atualiza os itens disponíveis do dia como se fosse um Story — publique, e quando acabar, exclua ou arquive com um toque. Nada de planilha desatualizada.',
    },
    {
      q: '"E se um cliente reclamar de algo? Quem fica no meio?"',
      a: 'Ninguém. E isso é um diferencial, não um defeito. A relação é diretamente entre você e seu cliente, da forma mais humana possível. Você define suas políticas, você resolve, você fideliza.',
    },
    {
      q: '"Precisa de computador, CNPJ ou nota fiscal?"',
      a: 'Não, não e não. O Pertim aceita MEI, autônomo e comércio informal. Tudo gerenciado pelo celular. Depois que você crescer, a plataforma cresce junto com você.',
    },
    {
      q: '"Como o Pertim ganha dinheiro, então?"',
      a: 'Com funcionalidades premium opcionais: destaque nos resultados de busca, vitrine personalizada e relatórios de demanda do bairro. O plano gratuito nunca expira. Sem truques.',
    },
  ];

  return (
    <section className="objections">
      <div className="container">
        <div className="text-center">
          <div className="section-tag">
            <Shield size={13} /> Transparência Total
          </div>
          <h2 className="section-title">As dúvidas que você tem. As respostas que merece.</h2>
          <p className="section-sub">
            Sem letras miúdas, sem armadilhas. Aqui está tudo que você precisa saber antes de começar.
          </p>
        </div>

        <div className="obj-grid">
          {items.map((item, i) => (
            <div key={i} className="obj-card">
              <h4>
                <span className="obj-q">"</span>
                {item.q.replace(/"/g, '')}
              </h4>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQ() {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: 'O app é realmente gratuito para consumidores?',
      a: 'Sim. O aplicativo é gratuito e sempre será gratuito para moradores. Sem assinatura, sem taxa por busca, sem cobrança escondida. Você encontra, o lojista vende, nós ficamos com nada disso.',
    },
    {
      q: 'Como o lojista atualiza o estoque?',
      a: 'Da forma mais simples possível: tirando uma foto. O lojista abre o app, fotografa o produto, adiciona o preço (opcional) e publica. Está no ar em segundos. Para remover, é um toque.',
    },
    {
      q: 'A compra é feita dentro do app?',
      a: 'Não, e isso é proposital. O Pertim conecta você ao lojista, e a transação acontece diretamente entre vocês — pelo WhatsApp, em dinheiro, Pix, no balcão. Sem passar cartão no app, sem risco de dados.',
    },
    {
      q: 'Em quais cidades o Pertim está disponível?',
      a: 'Estamos em expansão ativa na Grande São Paulo, com planos de levar a plataforma para todo o Brasil ainda este ano. Se seu bairro ainda não está coberto, você pode se cadastrar como lojista e ser um dos pioneiros da região.',
    },
    {
      q: 'Como o aplicativo sabe quais lojas estão abertas?',
      a: 'Os próprios lojistas configuram seus horários de funcionamento. O sistema atualiza automaticamente o status "Aberta Agora" com base nessas informações. Lojas fechadas simplesmente não aparecem nos resultados.',
    },
    {
      q: 'Sou lojista. Preciso pagar algo para aparecer?',
      a: 'Não. O plano básico é 100% gratuito e sem prazo de expiração. Você aparece nos resultados dos moradores do seu bairro sem pagar nada. Planos de destaque premium existem, mas são opcionais.',
    },
  ];

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="text-center">
          <div className="section-tag">FAQ</div>
          <h2 className="section-title">Dúvidas Frequentes</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)}>
                {faq.q}
                <span className="faq-chevron">▼</span>
              </button>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA FINAL ─── */
function CTASection() {
  return (
    <section className="cta-section">
      <div className="container">
        <h2>
          A economia de tempo que você precisa.<br />
          O <span className="text-gradient">bairro que merece</span> ser visto.
        </h2>
        <p>
          Junte-se a milhares de moradores e lojistas que já descobriram que o melhor comércio está na esquina.
        </p>
        <div className="cta-btns">
          <button className="btn btn-green btn-lg">
            <Smartphone size={20} /> Baixar o App Grátis
          </button>
          <button
            className="btn btn-outline-white btn-lg"
            onClick={() => document.getElementById('lojistas')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Cadastrar Minha Loja
          </button>
        </div>
        <p className="cta-note">Disponível para iOS e Android · Sem necessidade de cartão de crédito</p>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <MapPin size={22} color="var(--green)" strokeWidth={2.5} />
              Pertim<span style={{ color: 'var(--green)' }}>.</span>
            </div>
            <p className="footer-desc">
              Conectando moradores ao comércio do bairro. Simples assim, desde 2024.
            </p>
            <div className="footer-social">
              {['📸', '💬', '🐦', '▶️'].map((icon, i) => (
                <a key={i} href="#" className="social-btn">{icon}</a>
              ))}
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
              {[
                { icon: '🍎', label: 'App Store' },
                { icon: '▶', label: 'Google Play' },
              ].map((b, i) => (
                <a key={i} href="#" className="store-badge">
                  <span className="store-badge-icon">{b.icon}</span>
                  <span>{b.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h5>Produto</h5>
            <ul>
              <li><a href="#como-funciona">Como Funciona</a></li>
              <li><a href="#lojistas">Para Lojistas</a></li>
              <li><a href="#beneficios">Benefícios</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Empresa</h5>
            <ul>
              <li><a href="#quem-somos">Sobre Nós</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Carreiras</a></li>
              <li><a href="#">Imprensa</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Privacidade</a></li>
              <li><a href="#">Termos de Uso</a></li>
              <li><a href="#">Cookies</a></li>
              <li><a href="#">Contato</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Pertim Tecnologia Ltda. Todos os direitos reservados.</span>
          <span>Feito com ❤️ para o comércio de bairro brasileiro</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── APP ROOT ─── */
export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <ConsumerFeatures />
        <Benefits />
        <Lojistas />
        <Manifesto />
        <Testimonials />
        <Objections />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
