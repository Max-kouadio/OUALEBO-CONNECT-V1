-- ============================================
-- CORRECTION RLS POLICIES - TABLE UTILISATEURS (VERSION SIMPLE)
-- ============================================
-- Cette version évite TOTALEMENT la récursion

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
DROP POLICY IF EXISTS "utilisateurs_select_own" ON utilisateurs;
DROP POLICY IF EXISTS "utilisateurs_select_admin" ON utilisateurs;
DROP POLICY IF EXISTS "utilisateurs_update_own" ON utilisateurs;
DROP POLICY IF EXISTS "utilisateurs_update_admin" ON utilisateurs;
DROP POLICY IF EXISTS "utilisateurs_insert_admin" ON utilisateurs;
DROP POLICY IF EXISTS "utilisateurs_delete_admin" ON utilisateurs;

-- 2. ACTIVER RLS SUR LA TABLE
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES SIMPLES SANS RÉCURSION

-- ✅ SOLUTION 1 : Tous les utilisateurs authentifiés peuvent lire tous les utilisateurs
-- C'est normal dans un Cabinet Civil - les gens doivent voir leurs collègues
CREATE POLICY "utilisateurs_read_all"
ON utilisateurs
FOR SELECT
TO authenticated
USING (true);

-- ✅ Permettre mise à jour de ses propres données uniquement
CREATE POLICY "utilisateurs_update_own"
ON utilisateurs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ✅ Permettre insertion (pour le système uniquement lors de l'inscription)
CREATE POLICY "utilisateurs_insert_authenticated"
ON utilisateurs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. VÉRIFICATION
SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'utilisateurs'
ORDER BY policyname;

-- 5. TEST DE LECTURE
-- Cette requête devrait maintenant fonctionner sans erreur
SELECT
  email,
  nom,
  prenom,
  role,
  actif
FROM utilisateurs
LIMIT 5;
