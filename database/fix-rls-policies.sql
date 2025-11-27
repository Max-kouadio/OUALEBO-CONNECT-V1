-- ============================================
-- CORRECTION RLS POLICIES - TABLE UTILISATEURS
-- ============================================
-- Ce script corrige l'erreur "infinite recursion detected in policy"

-- 1. SUPPRIMER TOUTES LES POLICIES EXISTANTES
DROP POLICY IF EXISTS "Users can read their own data" ON utilisateurs;
DROP POLICY IF EXISTS "Users can update their own data" ON utilisateurs;
DROP POLICY IF EXISTS "Admins can read all users" ON utilisateurs;
DROP POLICY IF EXISTS "Admins can update all users" ON utilisateurs;
DROP POLICY IF EXISTS "Admins can insert users" ON utilisateurs;
DROP POLICY IF EXISTS "Admins can delete users" ON utilisateurs;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON utilisateurs;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON utilisateurs;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON utilisateurs;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON utilisateurs;

-- 2. ACTIVER RLS SUR LA TABLE
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

-- 3. CRÉER DES POLICIES SIMPLES SANS RÉCURSION

-- Policy 1: Permettre à un utilisateur de lire SES PROPRES données
-- Utilise directement auth.uid() sans référencer la table utilisateurs
CREATE POLICY "utilisateurs_select_own"
ON utilisateurs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Permettre à un admin de tout lire
-- Utilise une fonction helper pour éviter la récursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM utilisateurs
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "utilisateurs_select_admin"
ON utilisateurs
FOR SELECT
TO authenticated
USING (is_admin());

-- Policy 3: Permettre mise à jour de ses propres données
CREATE POLICY "utilisateurs_update_own"
ON utilisateurs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Permettre aux admins de tout mettre à jour
CREATE POLICY "utilisateurs_update_admin"
ON utilisateurs
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Policy 5: Permettre aux admins d'insérer des utilisateurs
CREATE POLICY "utilisateurs_insert_admin"
ON utilisateurs
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Policy 6: Permettre aux admins de supprimer des utilisateurs
CREATE POLICY "utilisateurs_delete_admin"
ON utilisateurs
FOR DELETE
TO authenticated
USING (is_admin());

-- 4. VÉRIFICATION
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'utilisateurs';
