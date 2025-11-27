-- ============================================
-- RLS POLICIES - TABLE COURRIER
-- ============================================

-- 1. ACTIVER RLS
ALTER TABLE courrier ENABLE ROW LEVEL SECURITY;

-- 2. SUPPRIMER LES POLICIES EXISTANTES (si elles existent)
DROP POLICY IF EXISTS "courrier_select_all" ON courrier;
DROP POLICY IF EXISTS "courrier_insert_authenticated" ON courrier;
DROP POLICY IF EXISTS "courrier_update_own_or_admin" ON courrier;
DROP POLICY IF EXISTS "courrier_delete_admin_only" ON courrier;

-- 3. POLICY SELECT : Tous les utilisateurs authentifiés peuvent lire
CREATE POLICY "courrier_select_all"
ON courrier
FOR SELECT
TO authenticated
USING (true);

-- 4. POLICY INSERT : Tous les utilisateurs authentifiés peuvent créer
CREATE POLICY "courrier_insert_authenticated"
ON courrier
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. POLICY UPDATE : Utilisateur peut modifier son propre courrier OU admin/directeur/secrétaire peuvent tout modifier
CREATE POLICY "courrier_update_own_or_admin"
ON courrier
FOR UPDATE
TO authenticated
USING (
  created_by IN (SELECT id FROM utilisateurs WHERE user_id = auth.uid())
  OR
  EXISTS (
    SELECT 1 FROM utilisateurs
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'directeur', 'secretaire')
  )
)
WITH CHECK (
  created_by IN (SELECT id FROM utilisateurs WHERE user_id = auth.uid())
  OR
  EXISTS (
    SELECT 1 FROM utilisateurs
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'directeur', 'secretaire')
  )
);

-- 6. POLICY DELETE : Seuls admin et directeur peuvent supprimer
CREATE POLICY "courrier_delete_admin_only"
ON courrier
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM utilisateurs
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'directeur')
  )
);

-- 7. VÉRIFICATION DES POLICIES
SELECT
  'Policies RLS courrier:' as info,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'courrier'
ORDER BY policyname;
