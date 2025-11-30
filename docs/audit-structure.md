# Audit de structure du projet

## Synthèse
Le repository contient une base Vite/React/TypeScript avec Tailwind et Supabase, mais la structure reste partielle par rapport au cahier des charges complet (modules phases 1-3, répertoires dédiés et migrations Supabase complètes).

## Répertoires et fichiers présents
- **Frontend** : `src/components` (sous-dossiers `courrier`, `dashboard`, `layout`, `ui`), `src/pages` (pages pour tous les modules mais majoritairement des écrans placeholder), `src/contexts` (auth), `src/hooks` (uniquement `useAuth`), `src/lib` (client Supabase, utilitaires), `src/types` (courrier et utilisateur).
- **Configuration** : `vite.config.ts`, `tailwind.config.js`, `tsconfig*.json`, `eslint.config.js`, `postcss.config.js`, `index.html`, `package.json`.
- **Base de données** : `database/` contient uniquement des scripts pour le module Courrier et la création d’utilisateurs Auth (`create-table-courrier.sql`, `rls-policies-courrier.sql`, `seed-courrier.sql`, `create-auth-users.sql`).

## Manques majeurs vs structure cible
- Dossiers attendus absents ou incomplets : `src/hooks` (manque les hooks métiers pour courrier/documents/trésorerie/audiences/CRM), `src/lib/validations`, `src/lib/constants`, `src/lib/utils` spécialisés, `src/types` pour tous les domaines (documents, trésorerie, CRM, audiences, communications, décisions, workflows), `src/lib/supabase/types` générés.
- Côté composants/pages, seuls les modules Auth/Dashboard/Courrier disposent de logique ; les autres pages sont des placeholders sans composants dédiés (`src/components/documents`, `src/components/tresorerie`, etc. inexistants).
- Dossier `supabase/migrations` ou `database/*.sql` incomplet : seul le module Courrier dispose d’une table/policies, aucune migration pour `utilisateurs`, `documents`, `evenements`, `audiences`, `treasury_transactions`, `contacts_externes`, `notifications`, `audit_logs`, etc.
- Fichier `.env.example` manquant alors que les variables Supabase sont requises.

## Incohérences / divergences
- Les pages et composants métiers ne suivent pas toujours la hiérarchie cible (`src/components/<module>` manquants pour la plupart des modules ; logique courrier mêlée dans la page sans hooks dédiés réutilisables).
- La structure de `database/` n’est pas alignée avec le découpage migrations/indexes/policies attendu et ne couvre qu’un seul module.
- Absence de dossier `docs/` (ajouté dans cette itération) pour tracer audits et planification.
