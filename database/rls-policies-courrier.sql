-- =====================================================
-- RLS POLICIES - TABLE COURRIER
-- Module 3 - Gestion du Courrier
-- =====================================================

-- Activer RLS sur la table courrier
ALTER TABLE courrier ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLITIQUE 1 : SELECT (Lecture)
-- Tous les utilisateurs authentifiés peuvent lire tous les courriers
-- =====================================================
DROP POLICY IF EXISTS courrier_select_all ON courrier;
CREATE POLICY courrier_select_all ON courrier
  FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- POLITIQUE 2 : INSERT (Création)
-- Tous les utilisateurs authentifiés peuvent créer des courriers
-- Le created_by sera automatiquement renseigné
-- =====================================================
DROP POLICY IF EXISTS courrier_insert_authenticated ON courrier;
CREATE POLICY courrier_insert_authenticated ON courrier
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================================================
-- POLITIQUE 3 : UPDATE (Modification)
-- Peuvent modifier :
-- - Le créateur du courrier
-- - Les administrateurs
-- - Les directeurs
-- - Les secrétaires
-- =====================================================
DROP POLICY IF EXISTS courrier_update_own_or_privileged ON courrier;
CREATE POLICY courrier_update_own_or_privileged ON courrier
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid()
      AND role IN ('admin', 'directeur', 'secretaire')
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid()
      AND role IN ('admin', 'directeur', 'secretaire')
    )
  );

-- =====================================================
-- POLITIQUE 4 : DELETE (Suppression)
-- Seuls les admin et directeurs peuvent supprimer
-- =====================================================
DROP POLICY IF EXISTS courrier_delete_admin_directeur ON courrier;
CREATE POLICY courrier_delete_admin_directeur ON courrier
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid()
      AND role IN ('admin', 'directeur')
    )
  );

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Politiques RLS pour courrier créées avec succès';
  RAISE NOTICE '- SELECT: Tous les utilisateurs authentifiés';
  RAISE NOTICE '- INSERT: Tous les utilisateurs authentifiés';
  RAISE NOTICE '- UPDATE: Créateur ou Admin/Directeur/Secrétaire';
  RAISE NOTICE '- DELETE: Admin/Directeur uniquement';
END $$;
