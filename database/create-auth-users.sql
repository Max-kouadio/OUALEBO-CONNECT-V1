-- ============================================
-- CRÉATION DES UTILISATEURS DANS AUTH.USERS
-- ============================================
-- Ce script crée les 5 utilisateurs test dans la table auth.users de Supabase
-- À exécuter AVANT seed-users.sql

-- IMPORTANT : Exécuter ce script dans le SQL Editor de Supabase
-- avec les permissions administrateur

-- ============================================
-- 1. ADMIN - Roi Baoulé
-- ============================================
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  '21cc9599-5df1-40d2-b5cd-b8e2600bcac0',
  '00000000-0000-0000-0000-000000000000',
  'admin@palais-royal.ci',
  crypt('123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. DIRECTEUR - DirCab Civil
-- ============================================
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  '55f5f0ad-8fce-4e11-a136-d3604b1b8f66',
  '00000000-0000-0000-0000-000000000000',
  'directeur@palais-royal.ci',
  crypt('123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. SECRÉTAIRE - Secrétaire No1
-- ============================================
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  'fa312c14-5bfb-472b-ba43-116ad5174b8b',
  '00000000-0000-0000-0000-000000000000',
  'secretaire@palais-royal.ci',
  crypt('123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. TRÉSORIER - Trésorier No2
-- ============================================
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  'c600167c-e4cd-47f4-a1fe-caed38dfe1c8',
  '00000000-0000-0000-0000-000000000000',
  'tresorier@palais-royal.ci',
  crypt('123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CONSEILLER - Conseiller No3
-- ============================================
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  '07757b84-717f-4772-acae-8cf3d40b708f',
  '00000000-0000-0000-0000-000000000000',
  'conseiller@palais-royal.ci',
  crypt('123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VÉRIFICATION
-- ============================================
SELECT
  id,
  email,
  created_at,
  email_confirmed_at,
  role
FROM auth.users
WHERE email IN (
  'admin@palais-royal.ci',
  'directeur@palais-royal.ci',
  'secretaire@palais-royal.ci',
  'tresorier@palais-royal.ci',
  'conseiller@palais-royal.ci'
)
ORDER BY email;

-- ============================================
-- PROCHAINE ÉTAPE
-- ============================================
-- Maintenant, exécutez le script seed-users.sql
-- pour insérer les données dans la table utilisateurs
