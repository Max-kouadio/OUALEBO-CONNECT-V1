-- ============================================
-- CORRECTION BUG #2 - VERSION SIMPLE (SANS CREATEUR_ID)
-- ============================================
-- Cette version insère des données sans référence au créateur

-- 1. RESET RLS POLICIES (comme Bug #1)
ALTER TABLE treasury_transactions DISABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'treasury_transactions')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON treasury_transactions CASCADE';
    END LOOP;
END $$;

ALTER TABLE treasury_transactions ENABLE ROW LEVEL SECURITY;

-- 2. CRÉER LES POLICIES SIMPLES
CREATE POLICY "treasury_transactions_read_all"
ON treasury_transactions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "treasury_transactions_insert_authenticated"
ON treasury_transactions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "treasury_transactions_update_authenticated"
ON treasury_transactions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. SUPPRIMER LES DONNÉES DE TEST EXISTANTES (si elles existent)
DELETE FROM treasury_transactions WHERE description LIKE '%TEST%' OR description LIKE '%test%';

-- 4. INSÉRER LES DONNÉES DE TEST (sans createur_id)
DO $$
DECLARE
  today DATE := CURRENT_DATE;
  debut_mois DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
BEGIN
  -- RECETTES DU MOIS EN COURS
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle du Royaume', debut_mois, 'approuvee'),
    ('recette', 'Cérémonies', 1500000, 'Revenus cérémonies traditionnelles', debut_mois + 5, 'approuvee'),
    ('recette', 'Donations', 800000, 'Dons des dignitaires', debut_mois + 10, 'approuvee'),
    ('recette', 'Services', 300000, 'Prestations diverses', debut_mois + 15, 'approuvee'),

    -- DÉPENSES DU MOIS EN COURS
    ('depense', 'Fonctionnement', 1200000, 'Salaires personnel Cabinet', debut_mois + 1, 'approuvee'),
    ('depense', 'Protocole', 800000, 'Frais de protocole et réceptions', debut_mois + 7, 'approuvee'),
    ('depense', 'Maintenance', 500000, 'Entretien Palais Royal', debut_mois + 12, 'approuvee'),
    ('depense', 'Communications', 200000, 'Téléphonie et internet', debut_mois + 3, 'approuvee'),

    -- TRANSACTIONS EN ATTENTE
    ('recette', 'Partenariats', 2000000, 'Partenariat économique', today, 'en_attente_n1'),
    ('depense', 'Événements', 1500000, 'Organisation festival culturel', today, 'en_attente_n2');

  -- DONNÉES DES MOIS PRÉCÉDENTS (pour le graphique)
  -- Mois -1
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE, 'approuvee'),
    ('recette', 'Cérémonies', 1200000, 'Revenus cérémonies', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 10, 'approuvee'),
    ('depense', 'Fonctionnement', 1100000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 5, 'approuvee'),
    ('depense', 'Protocole', 700000, 'Protocole', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 8, 'approuvee');

  -- Mois -2
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE, 'approuvee'),
    ('recette', 'Donations', 600000, 'Dons', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 12, 'approuvee'),
    ('depense', 'Fonctionnement', 1200000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 5, 'approuvee'),
    ('depense', 'Maintenance', 800000, 'Entretien', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 15, 'approuvee');

  -- Mois -3
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE, 'approuvee'),
    ('depense', 'Fonctionnement', 1100000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE + 5, 'approuvee'),
    ('depense', 'Protocole', 900000, 'Protocole', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE + 10, 'approuvee');

  -- Mois -4
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '4 month')::DATE, 'approuvee'),
    ('recette', 'Cérémonies', 900000, 'Revenus', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '4 month')::DATE + 8, 'approuvee'),
    ('depense', 'Fonctionnement', 1150000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '4 month')::DATE + 5, 'approuvee'),
    ('depense', 'Protocole', 650000, 'Protocole', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '4 month')::DATE + 12, 'approuvee');

  -- Mois -5
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 month')::DATE, 'approuvee'),
    ('recette', 'Donations', 700000, 'Dons', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 month')::DATE + 15, 'approuvee'),
    ('depense', 'Fonctionnement', 1200000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 month')::DATE + 5, 'approuvee'),
    ('depense', 'Maintenance', 600000, 'Entretien', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 month')::DATE + 10, 'approuvee');

  RAISE NOTICE 'Données de test insérées avec succès!';
END $$;

-- 5. VÉRIFICATION FINALE
SELECT
  'Total recettes mois en cours:' as info,
  SUM(montant) as total_fcfa
FROM treasury_transactions
WHERE type = 'recette'
  AND statut = 'approuvee'
  AND date_transaction >= DATE_TRUNC('month', CURRENT_DATE);

SELECT
  'Total dépenses mois en cours:' as info,
  SUM(montant) as total_fcfa
FROM treasury_transactions
WHERE type = 'depense'
  AND statut = 'approuvee'
  AND date_transaction >= DATE_TRUNC('month', CURRENT_DATE);

SELECT
  'Solde mois en cours:' as info,
  (
    SELECT COALESCE(SUM(montant), 0)
    FROM treasury_transactions
    WHERE type = 'recette'
      AND statut = 'approuvee'
      AND date_transaction >= DATE_TRUNC('month', CURRENT_DATE)
  ) - (
    SELECT COALESCE(SUM(montant), 0)
    FROM treasury_transactions
    WHERE type = 'depense'
      AND statut = 'approuvee'
      AND date_transaction >= DATE_TRUNC('month', CURRENT_DATE)
  ) as solde_fcfa;

SELECT
  'Transactions par mois:' as info,
  TO_CHAR(date_transaction, 'YYYY-MM') as mois,
  type,
  COUNT(*) as nombre,
  SUM(montant) as total
FROM treasury_transactions
WHERE statut = 'approuvee'
GROUP BY TO_CHAR(date_transaction, 'YYYY-MM'), type
ORDER BY mois DESC, type;

SELECT
  'Policies actives:' as info,
  policyname
FROM pg_policies
WHERE tablename = 'treasury_transactions'
ORDER BY policyname;
