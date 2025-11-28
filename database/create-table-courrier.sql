-- =====================================================
-- TABLE COURRIER (Gestion du Courrier)
-- Module 3 - Cabinet Civil Numérique V2
-- =====================================================

-- Création de la table principale pour la gestion du courrier
CREATE TABLE IF NOT EXISTS courrier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_reference VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('arrivee', 'depart')),
  objet TEXT NOT NULL,
  expediteur VARCHAR(255),
  destinataire VARCHAR(255),
  date_reception DATE,
  date_envoi DATE,
  priorite VARCHAR(20) NOT NULL DEFAULT 'normale' CHECK (priorite IN ('normale', 'urgente', 'tres_urgente')),
  statut VARCHAR(20) NOT NULL DEFAULT 'recu' CHECK (statut IN ('recu', 'en_cours', 'traite', 'archive')),
  categorie VARCHAR(50),
  affecte_a UUID REFERENCES utilisateurs(id),
  piece_jointe_url VARCHAR(500),
  observations TEXT,
  created_by UUID REFERENCES utilisateurs(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- FONCTION : Génération automatique du numéro de référence
-- Format: AR-YYYY-XXX pour arrivée, DP-YYYY-XXX pour départ
-- =====================================================
CREATE OR REPLACE FUNCTION generate_courrier_numero(courrier_type VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  prefix VARCHAR(3);
  current_year VARCHAR(4);
  sequence_num INTEGER;
  formatted_num VARCHAR(50);
BEGIN
  -- Déterminer le préfixe selon le type
  IF courrier_type = 'arrivee' THEN
    prefix := 'AR';
  ELSIF courrier_type = 'depart' THEN
    prefix := 'DP';
  ELSE
    RAISE EXCEPTION 'Type de courrier invalide: %', courrier_type;
  END IF;

  -- Année en cours
  current_year := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;

  -- Compter les courriers du même type pour cette année
  SELECT COUNT(*) + 1 INTO sequence_num
  FROM courrier
  WHERE type = courrier_type
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE);

  -- Formater le numéro: AR-2025-001 ou DP-2025-042
  formatted_num := prefix || '-' || current_year || '-' || LPAD(sequence_num::TEXT, 3, '0');

  RETURN formatted_num;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER : Mise à jour automatique du timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_courrier_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS courrier_updated_at ON courrier;
CREATE TRIGGER courrier_updated_at
  BEFORE UPDATE ON courrier
  FOR EACH ROW
  EXECUTE FUNCTION update_courrier_updated_at();

-- =====================================================
-- INDEX pour améliorer les performances
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_courrier_type ON courrier(type);
CREATE INDEX IF NOT EXISTS idx_courrier_statut ON courrier(statut);
CREATE INDEX IF NOT EXISTS idx_courrier_created_by ON courrier(created_by);
CREATE INDEX IF NOT EXISTS idx_courrier_affecte_a ON courrier(affecte_a);
CREATE INDEX IF NOT EXISTS idx_courrier_date_reception ON courrier(date_reception);
CREATE INDEX IF NOT EXISTS idx_courrier_date_envoi ON courrier(date_envoi);
CREATE INDEX IF NOT EXISTS idx_courrier_numero_reference ON courrier(numero_reference);

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Table courrier créée avec succès';
  RAISE NOTICE 'Fonction generate_courrier_numero() créée';
  RAISE NOTICE 'Trigger et indexes créés';
END $$;
