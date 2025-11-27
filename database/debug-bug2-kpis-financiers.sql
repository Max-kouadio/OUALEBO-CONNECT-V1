-- ============================================
-- DIAGNOSTIC BUG #2 - KPIs FINANCIERS
-- ============================================
-- Ce script vérifie l'état de la table treasury_transactions

-- 1. VÉRIFIER SI LA TABLE EXISTE
SELECT
  'Vérification table:' as info,
  EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'treasury_transactions'
  ) as table_existe;

-- 2. COMPTER LES TRANSACTIONS
SELECT
  'Nombre de transactions:' as info,
  COUNT(*) as total
FROM treasury_transactions;

-- 3. COMPTER PAR TYPE
SELECT
  'Transactions par type:' as info,
  type,
  COUNT(*) as nombre,
  SUM(montant) as total_montant
FROM treasury_transactions
GROUP BY type;

-- 4. COMPTER PAR STATUT
SELECT
  'Transactions par statut:' as info,
  statut,
  COUNT(*) as nombre
FROM treasury_transactions
GROUP BY statut;

-- 5. VÉRIFIER LES TRANSACTIONS DU MOIS EN COURS
SELECT
  'Transactions du mois en cours:' as info,
  type,
  statut,
  COUNT(*) as nombre,
  SUM(montant) as total
FROM treasury_transactions
WHERE date_transaction >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY type, statut;

-- 6. VÉRIFIER LES RLS POLICIES
SELECT
  'RLS Policies:' as info,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'treasury_transactions';

-- 7. VÉRIFIER SI RLS EST ACTIVÉ
SELECT
  'RLS Status:' as info,
  tablename,
  rowsecurity as rls_active
FROM pg_tables
WHERE tablename = 'treasury_transactions';
