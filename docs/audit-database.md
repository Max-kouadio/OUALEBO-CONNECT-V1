# Audit base de données Supabase & RLS

## État actuel des scripts
- Seuls des scripts orientés **Courrier** et création d’utilisateurs Auth sont présents (`database/create-table-courrier.sql`, `database/rls-policies-courrier.sql`, `database/create-auth-users.sql`, `database/seed-courrier.sql`).
- Aucun répertoire `supabase/migrations` ni scripts pour les autres tables décrites dans le cahier des charges.

## Conformité au cahier des charges
- **Tables manquantes** : `utilisateurs`, `documents`, `evenements`, `audiences`, `treasury_transactions`, `contacts_externes`, `notifications`, `audit_logs`, ainsi que les fonctions/triggers communs (`update_updated_at_column`, numérotation courrier standard `CR-YYYY-XXX`).
- **Divergences Courrier** : la table actuelle utilise `numero_reference` et une fonction `generate_courrier_numero(courrier_type)` qui génère des préfixes `AR/DP` ; le cahier des charges impose un champ `numero` unique avec format `CR-YYYY-XXX` sans dépendance au type.
- **Traces Auth** : les seeds insèrent des utilisateurs directement dans `auth.users` mais la table `utilisateurs` référencée par la FK de `courrier` n’est pas créée.

## RLS et sécurité
- **RLS activée uniquement sur `courrier`** : absence d’activation RLS et de policies pour tous les autres modules critiques.
- **Policies Courrier trop permissives** : lecture/insert ouverts à tout rôle authentifié, sans filtrage par rôle ou appartenance, ce qui contredit les règles d’accès par rôle (admin/directeur/secrétaire) prévues dans le cahier des charges.
- **Absence de policies fines** : aucun contrôle par rôle pour trésorerie, documents internes, audiences/calendrier, CRM, notifications, audit logs.

## Points de correction proposés
1. **Aligner le schéma** : ajouter toutes les tables manquantes avec contraintes, indexes et triggers `update_updated_at_column()` ; harmoniser la numérotation courrier (`numero` + trigger) au format attendu.
2. **Rétablir la table `utilisateurs`** et ses indexes/constraints, puis ajuster les FK des modules existants.
3. **Appliquer RLS** sur chaque table avec des policies conformes aux rôles (admin/directeur/secrétaire/trésorier/conseiller) et vérifier les contraintes d’accès (lecture restreinte, création limitée par rôle, suppression limitée aux responsables).
4. **Compléter les fonctions métier** (génération numéro courrier, synchro audiences→évènements, audit logs) et prévoir un dossier `supabase/migrations` versionné.
