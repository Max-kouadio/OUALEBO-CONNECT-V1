-- ============================================
-- CORRECTION BUG #2 - AVEC JUSTIFICATIF_URL
-- ============================================

-- 1. RESET RLS POLICIES
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
ON treasury_transactions FOR SELECT TO authenticated USING (true);

CREATE POLICY "treasury_transactions_insert_authenticated"
ON treasury_transactions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "treasury_transactions_update_authenticated"
ON treasury_transactions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 3. SUPPRIMER LES DONNÉES DE TEST EXISTANTES
DELETE FROM treasury_transactions WHERE description LIKE '%TEST%' OR description LIKE '%test%' OR description LIKE '%Dotation mensuelle%';

-- 4. INSÉRER LES DONNÉES DE TEST (avec justificatif_url)
DO $$
DECLARE
  today DATE := CURRENT_DATE;
  debut_mois DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  justificatif_dummy VARCHAR := 'https://cabinet-royal.ci/justificatifs/test.pdf';
BEGIN
  -- RECETTES DU MOIS EN COURS
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, justificatif_url)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle du Royaume', debut_mois, 'approuvee', justificatif_dummy),
    ('recette', 'Cérémonies', 1500000, 'Revenus cérémonies traditionnelles', debut_mois + 5, 'approuvee', justificatif_dummy),
    ('recette', 'Donations', 800000, 'Dons des dignitaires', debut_mois + 10, 'approuvee', justificatif_dummy),
    ('recette', 'Services', 300000, 'Prestations diverses', debut_mois + 15, 'approuvee', justificatif_dummy),

    -- DÉPENSES DU MOIS EN COURS
    ('depense', 'Fonctionnement', 1200000, 'Salaires personnel Cabinet', debut_mois + 1, 'approuvee', justificatif_dummy),
    ('depense', 'Protocole', 800000, 'Frais de protocole et réceptions', debut_mois + 7, 'approuvee', justificatif_dummy),
    ('depense', 'Maintenance', 500000, 'Entretien Palais Royal', debut_mois + 12, 'approuvee', justificatif_dummy),
    ('depense', 'Communications', 200000, 'Téléphonie et internet', debut_mois + 3, 'approuvee', justificatif_dummy),

    -- TRANSACTIONS EN ATTENTE
    ('recette', 'Partenariats', 2000000, 'Partenariat économique', today, 'en_attente_n1', justificatif_dummy),
    ('depense', 'Événements', 1500000, 'Organisation festival culturel', today, 'en_attente_n2', justificatif_dummy);

  -- MOIS -1
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, justificatif_url)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE, 'approuvee', justificatif_dummy),
    ('recette', 'Cérémonies', 1200000, 'Revenus cérémonies', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 10, 'approuvee', justificatif_dummy),
    ('depense', 'Fonctionnement', 1100000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 5, 'approuvee', justificatif_dummy),
    ('depense', 'Protocole', 700000, 'Protocole', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 8, 'approuvee', justificatif_dummy);

  -- MOIS -2
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, justificatif_url)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE, 'approuvee', justificatif_dummy),
    ('recette', 'Donations', 600000, 'Dons', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 12, 'approuvee', justificatif_dummy),
    ('depense', 'Fonctionnement', 1200000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 5, 'approuvee', justificatif_dummy),
    ('depense', 'Maintenance', 800000, 'Entretien', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 15, 'approuvee', justificatif_dummy);

  -- MOIS -3
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, justificatif_url)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE, 'approuvee', justificatif_dummy),
    ('depense', 'Fonctionnement', 1100000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE + 5, 'approuvee', justificatif_dummy),
    ('depense', 'Protocole', 900000, 'Protocole', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE + 10, 'approuvee', justificatif_dummy);

  -- MOIS -4
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, justificatif_url)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '4 month')::DATE, 'approuvee', justificatif_dummy),
    ('recette', 'Cérémonies', 900000, 'Revenus', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '4 month')::DATE + 8, 'approuvee', justificatif_dummy),
    ('depense', 'Fonctionnement', 1150000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '4 month')::DATE + 5, 'approuvee', justificatif_dummy),
    ('depense', 'Protocole', 650000, 'Protocole', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '4 month')::DATE + 12, 'approuvee', justificatif_dummy);

  -- MOIS -5
  INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, justificatif_url)
  VALUES
    ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 month')::DATE, 'approuvee', justificatif_dummy),
    ('recette', 'Donations', 700000, 'Dons', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 month')::DATE + 15, 'approuvee', justificatif_dummy),
    ('depense', 'Fonctionnement', 1200000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 month')::DATE + 5, 'approuvee', justificatif_dummy),
    ('depense', 'Maintenance', 600000, 'Entretien', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 month')::DATE + 10, 'approuvee', justificatif_dummy);

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
  'Transactions en attente:' as info,
  COUNT(*) as nombre
FROM treasury_transactions
WHERE statut IN ('en_attente_n1', 'en_attente_n2', 'en_attente_n3', 'brouillon');

SELECT
  'Évolution par mois:' as info,
  TO_CHAR(date_transaction, 'YYYY-MM') as mois,
  type,
  COUNT(*) as nombre,
  SUM(montant) as total
FROM treasury_transactions
WHERE statut = 'approuvee'
GROUP BY TO_CHAR(date_transaction, 'YYYY-MM'), type
ORDER BY mois DESC, type;

SELECT
  'Policies RLS actives:' as info,
  policyname
FROM pg_policies
WHERE tablename = 'treasury_transactions'
ORDER BY policyname;
