-- ============================================
-- CRÉATION DES UTILISATEURS TEST
-- ============================================
-- Ce script insère les utilisateurs test dans la table utilisateurs
-- IMPORTANT : Les utilisateurs doivent d'abord être créés dans Supabase Auth

-- ============================================
-- 1. ADMIN - Roi Baoulé
-- ============================================
INSERT INTO utilisateurs (
  user_id,
  email,
  nom,
  prenom,
  role,
  poste,
  actif
)
SELECT
  '21cc9599-5df1-40d2-b5cd-b8e2600bcac0',
  'admin@palais-royal.ci',
  'Roi',
  'Baoule',
  'admin',
  'Sa Majesté Nanan Kouakou Djè II, Roi des Baoulé',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM utilisateurs WHERE user_id = '21cc9599-5df1-40d2-b5cd-b8e2600bcac0'
);

-- ============================================
-- 2. DIRECTEUR - DirCab Civil
-- ============================================
INSERT INTO utilisateurs (
  user_id,
  email,
  nom,
  prenom,
  role,
  poste,
  actif
)
SELECT
  '55f5f0ad-8fce-4e11-a136-d3604b1b8f66',
  'directeur@palais-royal.ci',
  'DirCab',
  'Civil',
  'directeur',
  'Directeur du Cabinet Civil',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM utilisateurs WHERE user_id = '55f5f0ad-8fce-4e11-a136-d3604b1b8f66'
);

-- ============================================
-- 3. SECRÉTAIRE - Secrétaire No1
-- ============================================
INSERT INTO utilisateurs (
  user_id,
  email,
  nom,
  prenom,
  role,
  poste,
  actif
)
SELECT
  'fa312c14-5bfb-472b-ba43-116ad5174b8b',
  'secretaire@palais-royal.ci',
  'Secretaire',
  'No1',
  'secretaire',
  'Secrétaire du Cabinet Civil',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM utilisateurs WHERE user_id = 'fa312c14-5bfb-472b-ba43-116ad5174b8b'
);

-- ============================================
-- 4. TRÉSORIER - Trésorier No2
-- ============================================
INSERT INTO utilisateurs (
  user_id,
  email,
  nom,
  prenom,
  role,
  poste,
  actif
)
SELECT
  'c600167c-e4cd-47f4-a1fe-caed38dfe1c8',
  'tresorier@palais-royal.ci',
  'Tresorier',
  'No2',
  'tresorier',
  'Trésorier du Cabinet Civil',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM utilisateurs WHERE user_id = 'c600167c-e4cd-47f4-a1fe-caed38dfe1c8'
);

-- ============================================
-- 5. CONSEILLER - Conseiller No3
-- ============================================
INSERT INTO utilisateurs (
  user_id,
  email,
  nom,
  prenom,
  role,
  poste,
  specialisation,
  actif
)
SELECT
  '07757b84-717f-4772-acae-8cf3d40b708f',
  'conseiller@palais-royal.ci',
  'Conseiller',
  'No3',
  'conseiller',
  'Conseiller du Cabinet Civil',
  'juridique',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM utilisateurs WHERE user_id = '07757b84-717f-4772-acae-8cf3d40b708f'
);

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Afficher tous les utilisateurs créés
SELECT
  email,
  nom,
  prenom,
  role,
  poste,
  specialisation,
  actif
FROM utilisateurs
ORDER BY
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'directeur' THEN 2
    WHEN 'secretaire' THEN 3
    WHEN 'tresorier' THEN 4
    WHEN 'conseiller' THEN 5
  END;
