# Résumé exécutif de l’audit

## Progression globale estimée
- **~20%** de l’application globale couverte : seuls Auth/Dashboard/Courrier sont esquissés, le reste est placeholder.

## État par phase
- **Phase 1 (modules de base)** : partiellement implémentée (~35%). Auth/Dashboard/Courrier existent mais incomplets (validations, hooks, RLS, workflow pièces jointes). Documents, Calendrier/Audiences, Utilisateurs sont à construire.
- **Phase 2 (Trésorerie & CRM)** : non démarrée, pages placeholders sans schéma ni logique (~5%).
- **Phase 3 (Communications, Décisions, Workflows)** : non démarrée (~0-5%), aucune base de données ni composants.

## Bugs / Problèmes identifiés
- **Critiques** : 5 (build TypeScript cassé, absence de tables clés `utilisateurs/documents/treasury_transactions/...`, RLS insuffisante ouvrant les données, numérotation courrier divergente, KPIs pointant vers des tables inexistantes).
- **Majeurs** : 12 (manque validations Zod, absence hooks métiers, pas de fichiers .env.example, policies courrier trop larges, absence storage pour pièces jointes, absence migrations versionnées, etc.).
- **Mineurs** : 5 (versions lib légèrement divergentes, placeholder UX, absence de feedback d’erreur, etc.).

## Priorités absolues (P0)
1. **Réparer le build TypeScript** en installant ou enlevant `vite-plugin-pwa` et en alignant `tsconfig`/`vite.config`.
2. **Créer le schéma Supabase complet** (tables + triggers + indexes) pour Phase 1 et activer RLS selon les rôles définis.
3. **Mettre en place les policies RLS conformes** (courrier/documents/audiences/trésorerie/CRM) et vérifier les rôles côté frontend.
4. **Finaliser les modules Phase 1** : Auth renforcée (reset/guards rôles), Courrier avec validations Zod + storage + workflow, Documents/GED, Calendrier/Audiences, Utilisateurs.
5. **Fournir un `.env.example` et générer les types Supabase** pour sécuriser la configuration et les types côté frontend.
