-- ============================================
-- DONNÉES DE TEST - TABLE COURRIER
-- ============================================

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

  -- Si admin trouvé, insérer les données de test
  IF admin_id IS NOT NULL THEN

    -- COURRIERS ARRIVÉE
    INSERT INTO courrier (
      numero_reference, type, objet, expediteur, date_reception,
      priorite, statut, categorie, affecte_a, observations, created_by
    ) VALUES
    (
      generate_courrier_numero('arrivee'),
      'arrivee',
      'Demande d''audience - Délégation des Chefs de Village',
      'Association des Chefs Traditionnels de Sakassou',
      CURRENT_DATE - INTERVAL '5 days',
      'urgente',
      'en_cours',
      'Protocole',
      secretaire_id,
      'Audience sollicitée pour le 15 décembre 2025',
      admin_id
    ),
    (
      generate_courrier_numero('arrivee'),
      'arrivee',
      'Invitation - Cérémonie d''intronisation Chef Canton',
      'Préfecture de Bouaké',
      CURRENT_DATE - INTERVAL '10 days',
      'normale',
      'traite',
      'Protocole',
      directeur_id,
      'Présence confirmée de Sa Majesté',
      admin_id
    ),
    (
      generate_courrier_numero('arrivee'),
      'arrivee',
      'Projet de développement communautaire - Demande de soutien',
      'ONG Développement Baoulé',
      CURRENT_DATE - INTERVAL '2 days',
      'normale',
      'recu',
      'Administratif',
      NULL,
      'À étudier par la commission de développement',
      secretaire_id
    ),
    (
      generate_courrier_numero('arrivee'),
      'arrivee',
      'Convocation - Conseil des Sages du Royaume',
      'Doyen des Notables',
      CURRENT_DATE - INTERVAL '1 day',
      'tres_urgente',
      'en_cours',
      'Administratif',
      admin_id,
      'Conseil prévu pour demain matin',
      admin_id
    ),
    (
      generate_courrier_numero('arrivee'),
      'arrivee',
      'Rapport mensuel - Activités du Cabinet Civil',
      'Secrétariat Général',
      CURRENT_DATE - INTERVAL '30 days',
      'normale',
      'archive',
      'Administratif',
      directeur_id,
      'Rapport du mois précédent - archivé',
      secretaire_id
    );

    -- COURRIERS DÉPART
    INSERT INTO courrier (
      numero_reference, type, objet, destinataire, date_envoi,
      priorite, statut, categorie, observations, created_by
    ) VALUES
    (
      generate_courrier_numero('depart'),
      'depart',
      'Réponse - Autorisation cérémonie funéraire traditionnelle',
      'Famille KONé - Village de N''Gokro',
      CURRENT_DATE - INTERVAL '3 days',
      'urgente',
      'traite',
      'Protocole',
      'Autorisation accordée selon rites traditionnels',
      admin_id
    ),
    (
      generate_courrier_numero('depart'),
      'depart',
      'Invitation - Festival culturel Baoulé 2025',
      'Ensemble des Chefs Traditionnels de Côte d''Ivoire',
      CURRENT_DATE - INTERVAL '15 days',
      'normale',
      'traite',
      'Protocole',
      'Invitations envoyées à 50 chefferies',
      directeur_id
    ),
    (
      generate_courrier_numero('depart'),
      'depart',
      'Demande de subvention - Réfection Palais Royal',
      'Ministère de l''Intérieur et de la Sécurité',
      CURRENT_DATE - INTERVAL '7 days',
      'normale',
      'en_cours',
      'Administratif',
      'En attente de réponse du ministère',
      admin_id
    ),
    (
      generate_courrier_numero('depart'),
      'depart',
      'Convocation - Assemblée générale des Conseillers',
      'Ensemble des Conseillers du Cabinet Civil',
      CURRENT_DATE,
      'urgente',
      'recu',
      'Administratif',
      'Assemblée prévue le 10 décembre',
      secretaire_id
    ),
    (
      generate_courrier_numero('depart'),
      'depart',
      'Remerciements - Don pour construction école',
      'Fondation Education Baoulé',
      CURRENT_DATE - INTERVAL '60 days',
      'normale',
      'archive',
      'Protocole',
      'Lettre de remerciements archivée',
      directeur_id
    );

    RAISE NOTICE 'Données de test insérées avec succès!';
  ELSE
    RAISE NOTICE 'Aucun admin trouvé - créer d''abord les utilisateurs';
  END IF;
END $$;

-- VÉRIFICATION
SELECT
  'Courriers insérés:' as info,
  type,
  statut,
  COUNT(*) as nombre
FROM courrier
GROUP BY type, statut
ORDER BY type, statut;

SELECT
  'Liste des courriers:' as info,
  numero_reference,
  type,
  objet,
  statut,
  priorite,
  created_at
FROM courrier
ORDER BY created_at DESC
LIMIT 10;
