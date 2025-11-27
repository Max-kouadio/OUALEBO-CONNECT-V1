-- ============================================
-- CORRECTION BUG #2 - KPIs FINANCIERS
-- ============================================
-- Ce script crée des données de test et configure les RLS

-- 1. VÉRIFIER/CRÉER LA TABLE (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS treasury_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('recette', 'depense')),
  categorie VARCHAR(50),
  montant DECIMAL(15, 2) NOT NULL CHECK (montant > 0),
  description TEXT,
  date_transaction DATE NOT NULL DEFAULT CURRENT_DATE,
  statut VARCHAR(30) NOT NULL DEFAULT 'brouillon' CHECK (
    statut IN ('brouillon', 'en_attente_n1', 'en_attente_n2', 'en_attente_n3', 'approuvee', 'rejetee')
  ),
  createur_id UUID REFERENCES utilisateurs(id),
  validateur_n1_id UUID REFERENCES utilisateurs(id),
  validateur_n2_id UUID REFERENCES utilisateurs(id),
  validateur_n3_id UUID REFERENCES utilisateurs(id),
  date_validation_n1 TIMESTAMP,
  date_validation_n2 TIMESTAMP,
  date_validation_n3 TIMESTAMP,
  commentaire TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. DÉSACTIVER RLS TEMPORAIREMENT
ALTER TABLE treasury_transactions DISABLE ROW LEVEL SECURITY;

-- 3. SUPPRIMER TOUTES LES POLICIES
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'treasury_transactions')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON treasury_transactions CASCADE';
    END LOOP;
END $$;

-- 4. RÉACTIVER RLS
ALTER TABLE treasury_transactions ENABLE ROW LEVEL SECURITY;

-- 5. CRÉER LES POLICIES SIMPLES
-- Tous les utilisateurs authentifiés peuvent lire toutes les transactions
CREATE POLICY "treasury_transactions_read_all"
ON treasury_transactions
FOR SELECT
TO authenticated
USING (true);

-- Permettre insertion par utilisateurs authentifiés
CREATE POLICY "treasury_transactions_insert_authenticated"
ON treasury_transactions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permettre mise à jour par le créateur
CREATE POLICY "treasury_transactions_update_own"
ON treasury_transactions
FOR UPDATE
TO authenticated
USING (createur_id IN (SELECT id FROM utilisateurs WHERE user_id = auth.uid()))
WITH CHECK (createur_id IN (SELECT id FROM utilisateurs WHERE user_id = auth.uid()));

-- 6. INSÉRER DES DONNÉES DE TEST (Mois en cours)
-- Récupérer l'admin comme créateur
DO $$
DECLARE
  admin_id UUID;
  today DATE := CURRENT_DATE;
  debut_mois DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
BEGIN
  -- Trouver l'ID de l'admin
  SELECT id INTO admin_id FROM utilisateurs WHERE role = 'admin' LIMIT 1;

  -- Si admin trouvé, insérer des données de test
  IF admin_id IS NOT NULL THEN

    -- RECETTES DU MOIS EN COURS
    INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, createur_id)
    VALUES
      ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle du Royaume', debut_mois, 'approuvee', admin_id),
      ('recette', 'Cérémonies', 1500000, 'Revenus cérémonies traditionnelles', debut_mois + 5, 'approuvee', admin_id),
      ('recette', 'Donations', 800000, 'Dons des dignitaires', debut_mois + 10, 'approuvee', admin_id),
      ('recette', 'Services', 300000, 'Prestations diverses', debut_mois + 15, 'approuvee', admin_id),

      -- DÉPENSES DU MOIS EN COURS
      ('depense', 'Fonctionnement', 1200000, 'Salaires personnel Cabinet', debut_mois + 1, 'approuvee', admin_id),
      ('depense', 'Protocole', 800000, 'Frais de protocole et réceptions', debut_mois + 7, 'approuvee', admin_id),
      ('depense', 'Maintenance', 500000, 'Entretien Palais Royal', debut_mois + 12, 'approuvee', admin_id),
      ('depense', 'Communications', 200000, 'Téléphonie et internet', debut_mois + 3, 'approuvee', admin_id),

      -- TRANSACTIONS EN ATTENTE
      ('recette', 'Partenariats', 2000000, 'Partenariat économique', today, 'en_attente_n1', admin_id),
      ('depense', 'Événements', 1500000, 'Organisation festival culturel', today, 'en_attente_n2', admin_id);

    -- DONNÉES DES MOIS PRÉCÉDENTS (pour le graphique)
    -- Mois -1
    INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, createur_id)
    VALUES
      ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE, 'approuvee', admin_id),
      ('recette', 'Cérémonies', 1200000, 'Revenus cérémonies', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 10, 'approuvee', admin_id),
      ('depense', 'Fonctionnement', 1100000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 5, 'approuvee', admin_id),
      ('depense', 'Protocole', 700000, 'Protocole', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 8, 'approuvee', admin_id);

    -- Mois -2
    INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, createur_id)
    VALUES
      ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE, 'approuvee', admin_id),
      ('recette', 'Donations', 600000, 'Dons', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 12, 'approuvee', admin_id),
      ('depense', 'Fonctionnement', 1200000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 5, 'approuvee', admin_id),
      ('depense', 'Maintenance', 800000, 'Entretien', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 15, 'approuvee', admin_id);

    -- Mois -3
    INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, createur_id)
    VALUES
      ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE, 'approuvee', admin_id),
      ('depense', 'Fonctionnement', 1100000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE + 5, 'approuvee', admin_id),
      ('depense', 'Protocole', 900000, 'Protocole', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE + 10, 'approuvee', admin_id);

    RAISE NOTICE 'Données de test insérées avec succès!';
  ELSE
    RAISE NOTICE 'Aucun admin trouvé - créer d''abord un utilisateur admin';
  END IF;
END $$;

-- 7. VÉRIFICATION FINALE
SELECT
  'Résumé des transactions par mois:' as info,
  TO_CHAR(date_transaction, 'YYYY-MM') as mois,
  type,
  COUNT(*) as nombre,
  SUM(montant) as total
FROM treasury_transactions
GROUP BY TO_CHAR(date_transaction, 'YYYY-MM'), type
ORDER BY mois DESC, type;

SELECT
  'Total recettes mois en cours:' as info,
  SUM(montant) as total_recettes
FROM treasury_transactions
WHERE type = 'recette'
  AND statut = 'approuvee'
  AND date_transaction >= DATE_TRUNC('month', CURRENT_DATE);

SELECT
  'Total dépenses mois en cours:' as info,
  SUM(montant) as total_depenses
FROM treasury_transactions
WHERE type = 'depense'
  AND statut = 'approuvee'
  AND date_transaction >= DATE_TRUNC('month', CURRENT_DATE);

SELECT
  'Policies actives:' as info,
  policyname
FROM pg_policies
WHERE tablename = 'treasury_transactions'
ORDER BY policyname;
