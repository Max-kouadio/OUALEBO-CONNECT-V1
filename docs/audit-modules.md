# Audit des modules fonctionnels

## Tableau récapitulatif
| Module                 | Phase | État (ND/Partiel/Buggé/Fonctionnel) | Progression (%) | Bugs critiques | Bugs majeurs | Bugs mineurs |
|------------------------|-------|-------------------------------------|-----------------|----------------|--------------|--------------|
| Authentification       | 1     | Partiel                             | 60%             | 1              | 2            | 1            |
| Dashboard & Layout     | 1     | Partiel                             | 50%             | 1              | 2            | 1            |
| Courrier               | 1     | Partiel                             | 45%             | 2              | 2            | 1            |
| Documents / GED        | 1     | Non démarré (placeholder)           | 10%             | 1              | 1            | 0            |
| Calendrier & Audiences | 1     | Non démarré (placeholder)           | 10%             | 1              | 1            | 0            |
| Utilisateurs           | 1     | Non démarré (placeholder)           | 10%             | 1              | 1            | 0            |
| Trésorerie             | 2     | Non démarré (placeholder)           | 10%             | 1              | 1            | 0            |
| CRM Contacts           | 2     | Non démarré (placeholder)           | 10%             | 1              | 1            | 0            |
| Communications         | 3     | Non démarré (placeholder)           | 5%              | 0              | 1            | 0            |
| Décisions Royales      | 3     | Non démarré (placeholder)           | 5%              | 0              | 1            | 0            |
| Workflows              | 3     | Non démarré (placeholder)           | 5%              | 0              | 1            | 0            |

## Détails par module

### Authentification (Phase 1)
- **Présent** : AuthContext avec persistance Supabase, routes protégées/public, page Login responsive.
- **Manques** : Pas de gestion d’inscription ou récupération de mot de passe, absence de garde sur les rôles, pas de tests d’état bloquant (ex: utilisateur sans entrée dans `utilisateurs`).
- **Bugs/problèmes** : build TypeScript échoue à cause d’une dépendance manquante (impact global), aucune RLS vérifiée côté frontend.

### Dashboard & Layout (Phase 1)
- **Présent** : Layout Sidebar/Header, KPIs basés sur Supabase pour courriers/transactions (requêtes directes), affichage conditionnel par rôle.
- **Manques** : Graphiques Recharts promis dans README non présents, pas de composants Shadcn spécifiques au dashboard ni de données réelles pour documents/audiences, navigation par rôle non reliée à RLS réelle.
- **Bugs/problèmes** : KPIs supposent tables non créées (transactions/audiences/documents) → requêtes échoueront, absence de gestion d’erreurs réseau.

### Courrier (Phase 1)
- **Présent** : Formulaire/dialogues Shadcn (CourrierForm/Details/List/Filters/Stats), mutations Supabase (create/update/delete), génération de numéro via RPC `generate_courrier_numero`.
- **Manques** : Pas de hook métier dédié (logique dans la page), validations Zod absentes, pièces jointes non gérées (pas de storage), pas de workflow d’affectation ni filtres avancés, pas de contrôles RLS côté UI.
- **Bugs/problèmes** : Table `courrier` du repo ne contient pas toutes colonnes attendues (ex: `numero_reference` au lieu de `numero`, dates manquantes côté formulaire), policies très permissives (lecture totale), dépendance à des tables `utilisateurs` non créées dans les migrations du repo.

### Documents / GED (Phase 1)
- **Présent** : Page placeholder uniquement.
- **Manques** : Aucun type, validation, hook, composant d’upload, storage Supabase, workflow de validation ou versioning.
- **Bugs/problèmes** : Table `documents` absente, KPIs Dashboard référencent des données inexistantes.

### Calendrier & Audiences (Phase 1)
- **Présent** : Pages placeholder.
- **Manques** : Aucun composant react-big-calendar, pas de synchro audience → évènement, absence de types/validations/hooks.
- **Bugs/problèmes** : Tables `evenements`/`audiences` absentes, KPIs Dashboard dépendants de ces tables.

### Utilisateurs (Phase 1)
- **Présent** : Page placeholder.
- **Manques** : Pas de CRUD utilisateurs, pas de gestion des rôles/spécialisations, pas d’upload photo, pas de validations.
- **Bugs/problèmes** : Table `utilisateurs` absente des migrations, policies inexistantes.

### Trésorerie (Phase 2)
- **Présent** : Page placeholder rappelant le workflow théorique.
- **Manques** : Aucun type, Zod schema, hook ou composant de saisie/listing, pas de gestion des justificatifs ni du workflow multi-niveaux.
- **Bugs/problèmes** : Table `treasury_transactions` absente, KPI Dashboard fera échouer les requêtes.

### CRM Contacts (Phase 2)
- **Présent** : Page placeholder.
- **Manques** : Aucun modèle de données, formulaires, filtres ou tags.
- **Bugs/problèmes** : Table `contacts_externes` absente.

### Communications (Phase 3)
- Placeholder, aucune implémentation (types/hooks/DB) → nécessitera création complète.

### Décisions Royales (Phase 3)
- Placeholder, aucune implémentation (types/hooks/DB) → nécessitera création complète.

### Workflows (Phase 3)
- Placeholder, aucune implémentation (types/hooks/DB) → nécessite architecture workflow + triggers/audit.
