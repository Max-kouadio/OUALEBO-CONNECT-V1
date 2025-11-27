-- ============================================
-- SCRIPT DE DEBUG - VÉRIFICATION DES UTILISATEURS
-- ============================================

-- 1. Afficher TOUS les utilisateurs avec leurs rôles
SELECT
  id,
  user_id,
  email,
  nom,
  prenom,
  role,
  LENGTH(role) as role_length,
  ASCII(SUBSTRING(role, 1, 1)) as first_char_ascii,
  actif,
  created_at
FROM utilisateurs
ORDER BY
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'directeur' THEN 2
    WHEN 'secretaire' THEN 3
    WHEN 'tresorier' THEN 4
    WHEN 'conseiller' THEN 5
    ELSE 99
  END;

-- 2. Vérifier spécifiquement l'admin
SELECT
  'Admin check' as test,
  email,
  role,
  role = 'admin' as is_exact_match,
  LOWER(role) as role_lowercase,
  TRIM(role) as role_trimmed,
  LENGTH(role) as role_length
FROM utilisateurs
WHERE email = 'admin@palais-royal.ci';

-- 3. Vérifier les espaces ou caractères invisibles
SELECT
  email,
  role,
  REPLACE(role, ' ', '[SPACE]') as role_with_spaces_visible,
  HEX(role) as role_hex
FROM utilisateurs
WHERE email IN (
  'admin@palais-royal.ci',
  'directeur@palais-royal.ci',
  'secretaire@palais-royal.ci'
);
