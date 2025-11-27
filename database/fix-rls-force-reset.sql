-- ============================================
-- RESET COMPLET DES RLS POLICIES - FORCE
-- ============================================
-- Ce script force la suppression de TOUTES les policies
-- et les recrée proprement

-- 1. DÉSACTIVER TEMPORAIREMENT RLS (pour nettoyer)
ALTER TABLE utilisateurs DISABLE ROW LEVEL SECURITY;

-- 2. SUPPRIMER TOUTES LES POLICIES (FORCE)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'utilisateurs')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON utilisateurs CASCADE';
    END LOOP;
END $$;

-- 3. RÉACTIVER RLS
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

-- 4. CRÉER LES NOUVELLES POLICIES PROPRES

-- Policy 1: Tous les utilisateurs authentifiés peuvent lire tous les utilisateurs
-- C'est sécurisé car ils doivent être authentifiés
CREATE POLICY "utilisateurs_read_all"
ON utilisateurs
FOR SELECT
TO authenticated
USING (true);

-- Policy 2: Chaque utilisateur peut modifier ses propres données
CREATE POLICY "utilisateurs_update_own"
ON utilisateurs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Permettre l'insertion (pour le système lors de l'inscription)
CREATE POLICY "utilisateurs_insert_authenticated"
ON utilisateurs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. VÉRIFICATION FINALE
SELECT
  'Policies actives:' as info,
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename = 'utilisateurs'
ORDER BY policyname;

-- 6. TEST DE LECTURE
SELECT
  'Test de lecture:' as info,
  COUNT(*) as nombre_utilisateurs
FROM utilisateurs;

SELECT
  'Détail utilisateurs:' as info,
  email,
  role
FROM utilisateurs
ORDER BY role
LIMIT 5;
