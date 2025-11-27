-- ============================================
-- VÉRIFICATION DONNÉES POUR GRAPHIQUE
-- ============================================
-- Ce script vérifie que les données des 6 derniers mois sont bien présentes

-- 1. Compter les transactions par mois des 6 derniers mois
SELECT
  'Transactions par mois (6 derniers mois):' as info,
  TO_CHAR(date_transaction, 'YYYY-MM') as mois,
  type,
  statut,
  COUNT(*) as nombre,
  SUM(montant) as total_montant
FROM treasury_transactions
WHERE date_transaction >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
GROUP BY TO_CHAR(date_transaction, 'YYYY-MM'), type, statut
ORDER BY mois DESC, type;

-- 2. Voir les dates min et max dans la table
SELECT
  'Plage de dates dans la table:' as info,
  MIN(date_transaction) as date_min,
  MAX(date_transaction) as date_max,
  COUNT(*) as total_transactions
FROM treasury_transactions;

-- 3. Transactions approuvées par mois (ce que le graphique devrait afficher)
SELECT
  'Données pour graphique (approuvées seulement):' as info,
  TO_CHAR(date_transaction, 'Mon YYYY') as mois,
  type,
  COUNT(*) as nombre,
  SUM(montant) as total
FROM treasury_transactions
WHERE statut = 'approuvee'
  AND date_transaction >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
GROUP BY TO_CHAR(date_transaction, 'Mon YYYY'), TO_CHAR(date_transaction, 'YYYY-MM'), type
ORDER BY TO_CHAR(date_transaction, 'YYYY-MM') DESC, type;

-- 4. Test de la requête exacte du graphique pour le mois en cours
SELECT
  'Test requête mois actuel:' as info,
  type,
  montant,
  date_transaction,
  statut
FROM treasury_transactions
WHERE type = 'recette'
  AND statut = 'approuvee'
  AND date_transaction >= DATE_TRUNC('month', CURRENT_DATE)
  AND date_transaction <= (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

-- 5. Voir quelques exemples de transactions
SELECT
  'Exemples de transactions:' as info,
  id,
  type,
  categorie,
  montant,
  date_transaction,
  statut,
  created_at
FROM treasury_transactions
ORDER BY date_transaction DESC
LIMIT 10;
