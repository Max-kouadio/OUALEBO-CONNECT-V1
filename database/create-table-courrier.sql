-- ============================================
-- MODULE 3 - TABLE COURRIER
-- ============================================
-- Gestion des courriers arrivée et départ du Cabinet Civil

-- 1. CRÉER LA TABLE COURRIER
CREATE TABLE IF NOT EXISTS courrier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Numérotation et type
  numero_reference VARCHAR(50) UNIQUE NOT NULL, -- AR-2025-001, DP-2025-042
  type VARCHAR(20) NOT NULL CHECK (type IN ('arrivee', 'depart')),

  -- Informations principales
  objet TEXT NOT NULL,
  expediteur VARCHAR(255), -- Pour courrier arrivée
  destinataire VARCHAR(255), -- Pour courrier départ

  -- Dates
  date_reception DATE, -- Pour courrier arrivée
  date_envoi DATE, -- Pour courrier départ

  -- Priorité et statut
  priorite VARCHAR(20) NOT NULL DEFAULT 'normale' CHECK (priorite IN ('normale', 'urgente', 'tres_urgente')),
  statut VARCHAR(20) NOT NULL DEFAULT 'recu' CHECK (statut IN ('recu', 'en_cours', 'traite', 'archive')),

  -- Catégorisation et affectation
  categorie VARCHAR(50), -- Ex: "Administratif", "Juridique", "Protocole"
  affecte_a UUID REFERENCES utilisateurs(id), -- Utilisateur assigné

  -- Pièce jointe (Supabase Storage URL)
  piece_jointe_url VARCHAR(500),

  -- Observations
  observations TEXT,

  -- Métadonnées
  created_by UUID REFERENCES utilisateurs(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. CRÉER LES INDEX POUR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_courrier_type ON courrier(type);
CREATE INDEX IF NOT EXISTS idx_courrier_statut ON courrier(statut);
CREATE INDEX IF NOT EXISTS idx_courrier_date_reception ON courrier(date_reception);
CREATE INDEX IF NOT EXISTS idx_courrier_date_envoi ON courrier(date_envoi);
CREATE INDEX IF NOT EXISTS idx_courrier_affecte_a ON courrier(affecte_a);
CREATE INDEX IF NOT EXISTS idx_courrier_created_by ON courrier(created_by);
CREATE INDEX IF NOT EXISTS idx_courrier_numero ON courrier(numero_reference);

-- 3. CRÉER UNE FONCTION POUR LA NUMÉROTATION AUTOMATIQUE
-- Cette fonction génère un numéro unique au format AR-YYYY-XXX ou DP-YYYY-XXX
CREATE OR REPLACE FUNCTION generate_courrier_numero(courrier_type VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  prefix VARCHAR(2);
  current_year INT;
  next_number INT;
  formatted_number VARCHAR(50);
BEGIN
  -- Déterminer le préfixe selon le type
  IF courrier_type = 'arrivee' THEN
    prefix := 'AR';
  ELSIF courrier_type = 'depart' THEN
    prefix := 'DP';
  ELSE
    RAISE EXCEPTION 'Type de courrier invalide: %', courrier_type;
  END IF;

  -- Récupérer l'année actuelle
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

  -- Trouver le prochain numéro pour l'année en cours
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(numero_reference FROM '\d+$') AS INTEGER
    )
  ), 0) + 1
  INTO next_number
  FROM courrier
  WHERE numero_reference LIKE prefix || '-' || current_year || '-%';

  -- Formater le numéro (ex: AR-2025-001)
  formatted_number := prefix || '-' || current_year || '-' || LPAD(next_number::TEXT, 3, '0');

  RETURN formatted_number;
END;
$$ LANGUAGE plpgsql;

-- 4. CRÉER UN TRIGGER POUR LA MISE À JOUR AUTOMATIQUE DE updated_at
CREATE OR REPLACE FUNCTION update_courrier_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_courrier_timestamp
BEFORE UPDATE ON courrier
FOR EACH ROW
EXECUTE FUNCTION update_courrier_timestamp();

-- 5. VÉRIFICATION
SELECT
  'Table courrier créée avec succès!' as message,
  COUNT(*) as nombre_courriers
FROM courrier;
