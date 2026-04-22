-- ─── Enable PostGIS ───────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS postgis;

-- ─── Categorias ───────────────────────────────────────────────────────────────
CREATE TABLE categorias (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome       TEXT NOT NULL,
  emoji      TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  ordem      INT DEFAULT 0,
  ativo      BOOLEAN DEFAULT TRUE
);

INSERT INTO categorias (nome, emoji, slug, ordem) VALUES
  ('Padaria',      '🍞', 'padaria',    1),
  ('Mercado',      '🛒', 'mercado',    2),
  ('Hortifruti',   '🥬', 'hortifruti', 3),
  ('Farmácia',     '💊', 'farmacia',   4),
  ('Ferragens',    '🔧', 'ferragens',  5),
  ('Lanchonete',   '🍔', 'lanchonete', 6),
  ('Doceria',      '🎂', 'doceria',    7),
  ('Beleza',       '💈', 'beleza',     8),
  ('Serviços',     '🛠️', 'servicos',   9);

-- ─── Lojas ────────────────────────────────────────────────────────────────────
CREATE TABLE lojas (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome                TEXT NOT NULL,
  slug                TEXT UNIQUE,
  categoria_id        UUID REFERENCES categorias(id),
  dono_nome           TEXT,
  whatsapp            TEXT NOT NULL,
  descricao           TEXT,
  endereco            TEXT,
  bairro              TEXT DEFAULT 'Riacho Fundo 1',
  cidade              TEXT DEFAULT 'Brasília',
  estado              TEXT DEFAULT 'DF',
  lat                 DECIMAL(10,8),
  lng                 DECIMAL(11,8),
  location            GEOGRAPHY(Point, 4326),
  horario_abertura    TIME,
  horario_fechamento  TIME,
  dias_funcionamento  TEXT[] DEFAULT ARRAY['seg','ter','qua','qui','sex','sab'],
  foto_capa           TEXT,
  logo                TEXT,
  aberta              BOOLEAN DEFAULT FALSE,
  plano               TEXT DEFAULT 'vizinho' CHECK (plano IN ('vizinho', 'aberto', 'radar')),
  status              TEXT DEFAULT 'pendente' CHECK (status IN ('ativo', 'inativo', 'pendente')),
  visualizacoes       INT DEFAULT 0,
  cliques_whatsapp    INT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Index geoespacial para buscas por proximidade
CREATE INDEX lojas_location_idx ON lojas USING GIST(location);
CREATE INDEX lojas_status_idx ON lojas(status);
CREATE INDEX lojas_aberta_idx ON lojas(aberta);

-- Trigger para atualizar location quando lat/lng mudar
CREATE OR REPLACE FUNCTION update_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326);
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lojas_location_trigger
BEFORE INSERT OR UPDATE ON lojas
FOR EACH ROW EXECUTE FUNCTION update_location();

-- ─── Produtos ─────────────────────────────────────────────────────────────────
CREATE TABLE produtos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  loja_id     UUID REFERENCES lojas(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  descricao   TEXT,
  preco       DECIMAL(10,2),
  emoji       TEXT DEFAULT '🛍️',
  foto        TEXT,
  disponivel  BOOLEAN DEFAULT TRUE,
  ordem       INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX produtos_loja_idx ON produtos(loja_id);
CREATE INDEX produtos_disponivel_idx ON produtos(disponivel);

-- ─── Leads (cadastros do formulário da landing page) ──────────────────────────
CREATE TABLE leads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome        TEXT NOT NULL,
  loja        TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  tipo        TEXT,
  bairro      TEXT DEFAULT 'Riacho Fundo 1',
  origem      TEXT DEFAULT 'landing',
  status      TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'contatado', 'ativo', 'descartado')),
  notas       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RLS (Row Level Security) ─────────────────────────────────────────────────
ALTER TABLE lojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Lojas: leitura pública de lojas ativas, escrita apenas do dono
CREATE POLICY "lojas_select_publico" ON lojas
  FOR SELECT USING (status = 'ativo');

-- Dono pode sempre ler sua própria loja (mesmo pendente/inativa)
CREATE POLICY "lojas_select_own" ON lojas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "lojas_insert_own" ON lojas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lojas_update_own" ON lojas
  FOR UPDATE USING (auth.uid() = user_id);

-- Produtos: leitura pública, escrita apenas do dono da loja
CREATE POLICY "produtos_select_publico" ON produtos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lojas WHERE lojas.id = produtos.loja_id AND lojas.status = 'ativo'
    )
  );

CREATE POLICY "produtos_insert_own" ON produtos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM lojas WHERE lojas.id = produtos.loja_id AND lojas.user_id = auth.uid()
    )
  );

CREATE POLICY "produtos_update_own" ON produtos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM lojas WHERE lojas.id = produtos.loja_id AND lojas.user_id = auth.uid()
    )
  );

CREATE POLICY "produtos_delete_own" ON produtos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM lojas WHERE lojas.id = produtos.loja_id AND lojas.user_id = auth.uid()
    )
  );

-- ─── Função: buscar lojas próximas ────────────────────────────────────────────
-- Uso: SELECT * FROM lojas_proximas(-15.8863, -48.0516, 5000);
CREATE OR REPLACE FUNCTION lojas_proximas(
  p_lat DECIMAL,
  p_lng DECIMAL,
  p_raio_metros INT DEFAULT 3000
)
RETURNS TABLE (
  id UUID, nome TEXT, slug TEXT,
  categoria_id UUID, whatsapp TEXT, descricao TEXT,
  endereco TEXT, bairro TEXT, lat DECIMAL, lng DECIMAL,
  aberta BOOLEAN, horario_abertura TIME, horario_fechamento TIME,
  foto_capa TEXT, plano TEXT, distancia_metros FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id, l.nome, l.slug,
    l.categoria_id, l.whatsapp, l.descricao,
    l.endereco, l.bairro, l.lat, l.lng,
    l.aberta, l.horario_abertura, l.horario_fechamento,
    l.foto_capa, l.plano,
    ST_Distance(
      l.location,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::GEOGRAPHY
    ) AS distancia_metros
  FROM lojas l
  WHERE
    l.status = 'ativo'
    AND ST_DWithin(
      l.location,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::GEOGRAPHY,
      p_raio_metros
    )
  ORDER BY distancia_metros ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
