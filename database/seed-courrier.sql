-- =====================================================
-- SEED DATA - TABLE COURRIER
-- 10 courriers de test pour le Cabinet Civil
-- =====================================================

-- Récupérer l'ID d'un utilisateur admin pour created_by
DO $$
DECLARE
  admin_id UUID;
  directeur_id UUID;
  secretaire_id UUID;
BEGIN
  -- Récupérer les IDs des utilisateurs
  SELECT id INTO admin_id FROM utilisateurs WHERE role = 'admin' LIMIT 1;
  SELECT id INTO directeur_id FROM utilisateurs WHERE role = 'directeur' LIMIT 1;
  SELECT id INTO secretaire_id FROM utilisateurs WHERE role = 'secretaire' LIMIT 1;

  -- Si aucun utilisateur n'existe, afficher un avertissement
  IF admin_id IS NULL THEN
    RAISE NOTICE 'ATTENTION: Aucun utilisateur admin trouvé. Créez d''abord des utilisateurs.';
    RETURN;
  END IF;

  -- =====================================================
  -- COURRIERS ARRIVÉE (5 courriers)
  -- =====================================================

  -- Courrier 1: Demande d'audience
  INSERT INTO courrier (
    numero_reference, type, objet, expediteur, date_reception,
    priorite, statut, categorie, created_by, observations
  ) VALUES (
    'AR-2025-001',
    'arrivee',
    'Demande d''audience avec Son Excellence Monsieur le Directeur de Cabinet',
    'Ministère de l''Économie et des Finances',
    CURRENT_DATE - INTERVAL '5 days',
    'urgente',
    'en_cours',
    'Audience',
    admin_id,
    'Demande transmise au service du protocole pour planification'
  );

  -- Courrier 2: Invitation officielle
  INSERT INTO courrier (
    numero_reference, type, objet, expediteur, date_reception,
    priorite, statut, categorie, created_by, affecte_a
  ) VALUES (
    'AR-2025-002',
    'arrivee',
    'Invitation à la cérémonie de présentation des vœux 2025',
    'Présidence de la République',
    CURRENT_DATE - INTERVAL '3 days',
    'tres_urgente',
    'traite',
    'Protocole',
    admin_id,
    directeur_id
  );

  -- Courrier 3: Rapport mensuel
  INSERT INTO courrier (
    numero_reference, type, objet, expediteur, date_reception,
    priorite, statut, categorie, created_by
  ) VALUES (
    'AR-2025-003',
    'arrivee',
    'Rapport mensuel des activités - Décembre 2024',
    'Direction Générale du Budget',
    CURRENT_DATE - INTERVAL '7 days',
    'normale',
    'recu',
    'Rapport',
    secretaire_id
  );

  -- Courrier 4: Requête administrative
  INSERT INTO courrier (
    numero_reference, type, objet, expediteur, date_reception,
    priorite, statut, categorie, created_by, affecte_a
  ) VALUES (
    'AR-2025-004',
    'arrivee',
    'Demande de réexamen du dossier de recrutement',
    'Association des Fonctionnaires',
    CURRENT_DATE - INTERVAL '2 days',
    'normale',
    'en_cours',
    'Ressources Humaines',
    secretaire_id,
    directeur_id
  );

  -- Courrier 5: Note de service
  INSERT INTO courrier (
    numero_reference, type, objet, expediteur, date_reception,
    priorite, statut, categorie, created_by, piece_jointe_url
  ) VALUES (
    'AR-2025-005',
    'arrivee',
    'Circulaire sur les nouvelles procédures budgétaires 2025',
    'Ministère du Budget',
    CURRENT_DATE - INTERVAL '1 day',
    'urgente',
    'recu',
    'Circulaire',
    admin_id,
    '/uploads/circulaire-budget-2025.pdf'
  );

  -- =====================================================
  -- COURRIERS DÉPART (5 courriers)
  -- =====================================================

  -- Courrier 6: Réponse à une demande
  INSERT INTO courrier (
    numero_reference, type, objet, destinataire, date_envoi,
    priorite, statut, categorie, created_by
  ) VALUES (
    'DP-2025-001',
    'depart',
    'Réponse à la demande d''information sur le budget 2025',
    'Assemblée Nationale - Commission des Finances',
    CURRENT_DATE - INTERVAL '4 days',
    'urgente',
    'traite',
    'Réponse Officielle',
    directeur_id
  );

  -- Courrier 7: Convocation
  INSERT INTO courrier (
    numero_reference, type, objet, destinataire, date_envoi,
    priorite, statut, categorie, created_by, piece_jointe_url
  ) VALUES (
    'DP-2025-002',
    'depart',
    'Convocation à la réunion du Conseil de Cabinet - 15 Janvier 2025',
    'Ensemble des Directeurs de Cabinet',
    CURRENT_DATE - INTERVAL '2 days',
    'tres_urgente',
    'traite',
    'Convocation',
    admin_id,
    '/uploads/convocation-conseil-15-01-2025.pdf'
  );

  -- Courrier 8: Transmission de documents
  INSERT INTO courrier (
    numero_reference, type, objet, destinataire, date_envoi,
    priorite, statut, categorie, created_by
  ) VALUES (
    'DP-2025-003',
    'depart',
    'Transmission du rapport d''activités Q4 2024',
    'Primature - Secrétariat Général',
    CURRENT_DATE - INTERVAL '6 days',
    'normale',
    'traite',
    'Transmission',
    secretaire_id
  );

  -- Courrier 9: Notification officielle
  INSERT INTO courrier (
    numero_reference, type, objet, destinataire, date_envoi,
    priorite, statut, categorie, created_by, observations
  ) VALUES (
    'DP-2025-004',
    'depart',
    'Notification de décision concernant le dossier XYZ-2024-789',
    'Ministère de la Fonction Publique',
    CURRENT_DATE,
    'urgente',
    'en_cours',
    'Décision',
    directeur_id,
    'En attente de signature finale'
  );

  -- Courrier 10: Demande d'information
  INSERT INTO courrier (
    numero_reference, type, objet, destinataire, date_envoi,
    priorite, statut, categorie, created_by
  ) VALUES (
    'DP-2025-005',
    'depart',
    'Demande de transmission des états financiers consolidés',
    'Direction Générale du Trésor et de la Comptabilité Publique',
    CURRENT_DATE - INTERVAL '1 day',
    'normale',
    'recu',
    'Demande',
    admin_id
  );

  RAISE NOTICE '10 courriers de test créés avec succès';
  RAISE NOTICE '- 5 courriers ARRIVÉE (AR-2025-001 à AR-2025-005)';
  RAISE NOTICE '- 5 courriers DÉPART (DP-2025-001 à DP-2025-005)';
END $$;
