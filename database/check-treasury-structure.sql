-- ============================================
-- VÉRIFICATION STRUCTURE TABLE TREASURY_TRANSACTIONS
-- ============================================
-- Ce script affiche la structure complète de la table existante

SELECT
  'Structure actuelle de treasury_transactions:' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'treasury_transactions'
ORDER BY ordinal_position;

-- Voir quelques exemples de données si elles existent
SELECT
  'Exemples de données (5 lignes):' as info
FROM treasury_transactions
LIMIT 1;

SELECT * FROM treasury_transactions LIMIT 5;
