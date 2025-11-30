# Plan de continuation opérationnel

## Méthode de priorisation
- **P0 (Critique)** : empêche l’application de fonctionner (build, auth, RLS, CRUD critiques).
- **P1 (Urgent)** : bloque l’usage normal d’un module Phase 1 ou 2.
- **P2 (Important)** : fonctionnalités manquantes Phase 2 ou 3.
- **P3 (Confort/UX)** : optimisations, UX/polish.

## Sprint 1 – Stabilisation & Phase 1 complète
Objectif : livrer tous les modules Phase 1 fonctionnels et stables, corriger tous les P0.

- [S1-P0-01] Build/Config – `package.json`, `vite.config.ts`, `tsconfig.app.json` – **P0 (S)**
  - Ajouter/retirer `vite-plugin-pwa` pour débloquer `npm run build`, ajuster types globaux.
- [S1-P0-02] Schéma DB Phase 1 – `supabase/migrations/*` ou `database/*.sql` – **P0 (L)**
  - Créer tables `utilisateurs`, `courrier` (alignée), `documents`, `evenements`, `audiences`; triggers `update_updated_at_column`, numérotation courrier; seeds de base.
- [S1-P0-03] RLS Phase 1 – `database/policies.sql` – **P0 (M)**
  - Activer RLS sur toutes les tables Phase 1, policies par rôle (admin/directeur/secrétaire/conseiller) conformément au cahier.
- [S1-P1-04] Auth renforcée – `src/contexts/AuthContext.tsx`, `src/hooks/useAuth.ts`, `src/pages/Login.tsx` – **P1 (M)**
  - Gestion erreurs Supabase, guards par rôle, flux reset password, redirections selon profil utilisateur.
- [S1-P1-05] Courrier complet – `src/types`, `src/lib/validations`, `src/hooks/useCourrier.ts`, `src/components/courrier/*`, `src/pages/Courrier.tsx` – **P1 (L)**
  - Zod schemas, hooks dédiés React Query, upload pièces jointes via storage, filtres/tri, affichage RLS, alignement des champs (`numero`, dates, statut), synchronisation avec nouveau schéma.
- [S1-P1-06] Documents/GED – `src/components/documents/*`, `src/pages/Documents.tsx`, `src/lib/validations/documents.ts`, `src/hooks/useDocuments.ts` – **P1 (L)**
  - CRUD documents, catégories/tags, storage, versioning basique, workflow de validation juridique.
- [S1-P1-07] Calendrier & Audiences – `src/components/calendrier/*`, `src/components/audiences/*`, `src/hooks/useAudiences.ts`, `src/pages/Calendrier.tsx`, `src/pages/Audiences.tsx` – **P1 (L)**
  - Intégrer react-big-calendar, création audience, workflow de validation, synchro automatique événement ↔ audience.
- [S1-P1-08] Utilisateurs – `src/pages/Utilisateurs.tsx`, `src/hooks/useUtilisateurs.ts`, `src/components/utilisateurs/*` – **P1 (M)**
  - CRUD utilisateurs, rôles/spécialisations, activation/désactivation, upload photo.
- [S1-P1-09] Config & DX – `.env.example`, `docs/*` – **P1 (S)**
  - Documenter variables d’environnement, instructions d’installation, mise à jour docs.

## Sprint 2 – Trésorerie & CRM (Phase 2)
Objectif : rendre Trésorerie et CRM Contacts opérationnels.

- [S2-P0-01] Schéma Trésorerie & CRM – migrations SQL – **P0 (M)**
  - Tables `treasury_transactions`, `contacts_externes`, indexes, triggers, RLS (workflow multi-niveaux pour trésorerie, tags pour CRM).
- [S2-P1-02] Types & validations – `src/types/tresorerie.types.ts`, `src/types/crm.types.ts`, `src/lib/validations/*.ts` – **P1 (M)**
  - Zod schemas (justificatif obligatoire, montants, statuts), types partagés.
- [S2-P1-03] Hooks métiers – `src/hooks/useTresorerie.ts`, `src/hooks/useCRM.ts` – **P1 (M)**
  - Queries/mutations avec React Query, calculs KPIs, filtres, pagination.
- [S2-P1-04] UI/Forms – `src/components/tresorerie/*`, `src/components/crm/*`, `src/pages/Tresorerie.tsx`, `src/pages/CRM.tsx` – **P1 (L)**
  - Formulaires création/édition, workflow approbation N1/N2/N3 selon montant, affichage historique, export CSV/XLSX, filtres/tags.
- [S2-P2-05] Exports & rapports – utilitaires – **P2 (M)**
  - Génération PDF/Excel pour transactions et contacts, graphiques Recharts/KPI tableau de bord.

## Sprint 3 – Finition UI/UX + Phase 3
Objectif : implémenter/amorcer Communications, Décisions Royales, Workflows et améliorer l’UX.

- [S3-P1-01] Module Communications – `src/components/communications/*`, `src/pages/Communications.tsx`, migrations SQL – **P1 (M)**
  - CRUD communications, canaux, notifications, intégration RLS.
- [S3-P1-02] Décisions Royales – `src/components/decisions/*`, `src/pages/Decisions.tsx`, migrations SQL – **P1 (M)**
  - Saisie décision, rattachement aux audiences/communications, validation multi-rôle, archivage.
- [S3-P1-03] Workflows – `src/components/workflows/*`, `src/hooks/useWorkflows.ts`, triggers SQL – **P1 (L)**
  - Modélisation étapes, assignations, audit logs, règles configurables, intégration cross-modules.
- [S3-P2-04] UX/Responsive/Perf – global – **P2 (M)**
  - Optimisation responsive, gestion erreurs/chargement, accessibilité, tests e2e/visuels.
- [S3-P3-05] Polish & DX – docs/tests – **P3 (S)**
  - Documentation utilisateur/admin, échantillons de données, amélioration tooling (lint/ts strict).
