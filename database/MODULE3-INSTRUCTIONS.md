# Module 3 - Gestion du Courrier
## Guide d'Installation et d'Utilisation

---

## 📋 Vue d'ensemble

Le Module 3 permet la gestion complète des courriers (arrivée et départ) pour le Cabinet Civil avec :
- ✅ Numérotation automatique (AR-2025-001, DP-2025-042)
- ✅ Création, modification, suppression de courriers
- ✅ Filtrage avancé (type, statut, recherche)
- ✅ KPIs en temps réel
- ✅ Permissions par rôle (Admin, Directeur, Secrétaire)
- ✅ Interface moderne avec React + TypeScript

---

## 🚀 Installation

### Étape 1 : Exécuter les scripts SQL dans Supabase

Rendez-vous dans votre projet Supabase > SQL Editor et exécutez les scripts **dans cet ordre** :

#### 1. Créer la table courrier
```sql
-- Exécuter le fichier: database/create-table-courrier.sql
```
Ce script crée :
- La table `courrier` avec tous les champs nécessaires
- La fonction `generate_courrier_numero()` pour la numérotation automatique
- Les triggers et indexes

#### 2. Configurer les politiques de sécurité (RLS)
```sql
-- Exécuter le fichier: database/rls-policies-courrier.sql
```
Ce script définit :
- SELECT : Tous les utilisateurs authentifiés
- INSERT : Tous les utilisateurs authentifiés
- UPDATE : Créateur du courrier OU Admin/Directeur/Secrétaire
- DELETE : Admin et Directeur uniquement

#### 3. Insérer les données de test (OPTIONNEL)
```sql
-- Exécuter le fichier: database/seed-courrier.sql
```
Ce script insère 10 courriers de test :
- 5 courriers arrivée (AR-2025-001 à AR-2025-005)
- 5 courriers départ (DP-2025-001 à DP-2025-005)

### Étape 2 : Installer les dépendances (DÉJÀ FAIT)
```bash
npm install date-fns --legacy-peer-deps
```

### Étape 3 : Démarrer l'application
```bash
npm run dev
```

---

## 🎯 Fonctionnalités

### 1. Statistiques (KPIs)
Affichage en temps réel de :
- Total des courriers
- Nombre de courriers arrivée
- Nombre de courriers départ
- Courriers en attente de traitement

### 2. Filtres
- **Recherche** : Numéro de référence, objet, expéditeur, destinataire
- **Type** : Tous / Arrivée / Départ
- **Statut** : Tous / Reçu / En cours / Traité / Archivé

### 3. Liste des courriers
Tableau avec :
- Numéro de référence (ex: AR-2025-001)
- Type (badge coloré)
- Objet
- Expéditeur ou Destinataire (selon le type)
- Date (réception ou envoi)
- Priorité (Normale / Urgente / Très urgente)
- Statut (Reçu / En cours / Traité / Archivé)
- Actions (Voir / Modifier / Supprimer)

### 4. Création de courrier
Formulaire avec :
- Type : Arrivée ou Départ
- Objet (minimum 5 caractères)
- Expéditeur (si arrivée) ou Destinataire (si départ)
- Date de réception (si arrivée) ou Date d'envoi (si départ)
- Priorité : Normale / Urgente / Très urgente
- Statut : Reçu / En cours / Traité / Archivé
- Catégorie (optionnelle)
- Pièce jointe URL (optionnelle)
- Observations (optionnelles)

**Le numéro de référence est généré automatiquement !**

### 5. Modification de courrier
- Tous les champs sont modifiables sauf le type et le numéro de référence
- Seuls Admin, Directeur et Secrétaire peuvent modifier

### 6. Suppression de courrier
- Confirmation obligatoire avant suppression
- Seuls Admin et Directeur peuvent supprimer

### 7. Détails du courrier
Modal affichant toutes les informations :
- Badges de type, statut et priorité
- Toutes les données du courrier
- Lien vers la pièce jointe (si présente)
- Dates de création et dernière mise à jour

---

## 🔐 Permissions par rôle

| Action | Admin | Directeur | Secrétaire | Trésorier | Conseiller |
|--------|-------|-----------|------------|-----------|------------|
| Voir (SELECT) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Créer (INSERT) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Modifier (UPDATE) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Supprimer (DELETE) | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 🧪 Tests

### Test #1 : Affichage des statistiques
1. Connectez-vous avec n'importe quel utilisateur
2. Accédez à la page "Gestion du Courrier"
3. Vérifiez que les 4 KPIs s'affichent avec les bonnes valeurs

**Résultat attendu** : Affichage de Total, Arrivées, Départs, En attente

---

### Test #2 : Création d'un courrier (Admin/Directeur/Secrétaire)
1. Connectez-vous avec admin@palais-royal.ci
2. Cliquez sur "Nouveau Courrier"
3. Remplissez le formulaire :
   - Type : Arrivée
   - Objet : "Test de courrier arrivée"
   - Expéditeur : "Ministère de Test"
   - Date de réception : Aujourd'hui
   - Priorité : Urgente
   - Statut : Reçu
4. Cliquez sur "Créer"

**Résultat attendu** :
- Toast de succès "Courrier créé avec succès"
- Un nouveau courrier apparaît avec le numéro AR-2025-XXX
- Les KPIs sont mis à jour

---

### Test #3 : Filtrage des courriers
1. Dans la section "Filtres", sélectionnez :
   - Type : Arrivée
2. Vérifiez que seuls les courriers arrivée s'affichent
3. Changez le filtre :
   - Type : Départ
4. Vérifiez que seuls les courriers départ s'affichent

**Résultat attendu** : Le tableau se met à jour en temps réel

---

### Test #4 : Recherche textuelle
1. Dans le champ "Rechercher", tapez "audience"
2. Vérifiez que seuls les courriers contenant "audience" s'affichent

**Résultat attendu** : Filtrage dynamique dans l'objet, expéditeur, destinataire et numéro

---

### Test #5 : Détails d'un courrier
1. Cliquez sur l'icône "Œil" (Eye) d'un courrier
2. Vérifiez que le modal s'ouvre avec toutes les informations
3. Vérifiez les badges de type, statut et priorité

**Résultat attendu** : Modal avec informations complètes et formatées

---

### Test #6 : Modification d'un courrier (Admin/Directeur/Secrétaire)
1. Cliquez sur l'icône "Crayon" (Edit) d'un courrier
2. Modifiez le statut : "En cours"
3. Ajoutez une observation : "Courrier en cours de traitement"
4. Cliquez sur "Modifier"

**Résultat attendu** :
- Toast de succès "Courrier modifié avec succès"
- Les modifications sont visibles dans la liste

---

### Test #7 : Suppression d'un courrier (Admin/Directeur)
1. Connectez-vous avec admin@palais-royal.ci
2. Cliquez sur l'icône "Poubelle" (Trash) d'un courrier
3. Confirmez la suppression dans le dialog

**Résultat attendu** :
- Toast de succès "Courrier supprimé avec succès"
- Le courrier disparaît de la liste
- Les KPIs sont mis à jour

---

### Test #8 : Permissions - Conseiller (lecture seule)
1. Connectez-vous avec conseiller@palais-royal.ci
2. Accédez à la page "Gestion du Courrier"
3. Vérifiez que :
   - Le bouton "Nouveau Courrier" n'apparaît PAS
   - Les icônes "Modifier" et "Supprimer" n'apparaissent PAS
   - Seule l'icône "Voir" est visible

**Résultat attendu** : Accès en lecture seule

---

### Test #9 : Permissions - Secrétaire (pas de suppression)
1. Connectez-vous avec secretaire@palais-royal.ci
2. Vérifiez que :
   - Le bouton "Nouveau Courrier" apparaît
   - L'icône "Modifier" apparaît
   - L'icône "Supprimer" n'apparaît PAS

**Résultat attendu** : Peut créer et modifier, mais pas supprimer

---

### Test #10 : Numérotation automatique
1. Créez 3 courriers arrivée
2. Vérifiez que les numéros sont séquentiels :
   - AR-2025-001
   - AR-2025-002
   - AR-2025-003
3. Créez 2 courriers départ
4. Vérifiez que les numéros sont :
   - DP-2025-001
   - DP-2025-002

**Résultat attendu** : Numérotation automatique et unique par type

---

## 🐛 Dépannage

### Problème : "La fonction generate_courrier_numero n'existe pas"
**Solution** : Exécutez le script `database/create-table-courrier.sql` dans Supabase SQL Editor

### Problème : "Permission denied for table courrier"
**Solution** : Exécutez le script `database/rls-policies-courrier.sql` dans Supabase SQL Editor

### Problème : Les KPIs affichent 0
**Solution** :
1. Vérifiez que les politiques RLS sont bien configurées
2. Vérifiez que vous êtes bien connecté
3. Exécutez `database/seed-courrier.sql` pour insérer des données de test

### Problème : Erreur "date-fns not found"
**Solution** : Exécutez `npm install date-fns --legacy-peer-deps`

### Problème : Le bouton "Nouveau Courrier" n'apparaît pas
**Solution** : Vérifiez que vous êtes connecté avec un compte Admin, Directeur ou Secrétaire

---

## 📁 Architecture des fichiers

```
database/
├── create-table-courrier.sql      # Table et fonction de numérotation
├── rls-policies-courrier.sql      # Politiques de sécurité
└── seed-courrier.sql              # Données de test

src/
├── types/
│   ├── courrier.types.ts          # Types TypeScript
│   └── index.ts                   # Export des types
├── components/
│   └── courrier/
│       ├── CourrierStats.tsx      # KPIs
│       ├── CourrierFilters.tsx    # Filtres
│       ├── CourrierList.tsx       # Tableau des courriers
│       ├── CourrierForm.tsx       # Formulaire création/modification
│       └── CourrierDetails.tsx    # Modal de détails
└── pages/
    └── Courrier.tsx               # Page principale avec CRUD complet
```

---

## ✅ Checklist de déploiement

- [ ] Script SQL 1/3 exécuté : `create-table-courrier.sql`
- [ ] Script SQL 2/3 exécuté : `rls-policies-courrier.sql`
- [ ] Script SQL 3/3 exécuté (optionnel) : `seed-courrier.sql`
- [ ] Dépendance installée : `date-fns`
- [ ] Application démarrée : `npm run dev`
- [ ] Test #1 réussi : Affichage des KPIs
- [ ] Test #2 réussi : Création d'un courrier
- [ ] Test #3 réussi : Filtrage par type
- [ ] Test #4 réussi : Recherche textuelle
- [ ] Test #5 réussi : Détails d'un courrier
- [ ] Test #6 réussi : Modification d'un courrier
- [ ] Test #7 réussi : Suppression d'un courrier
- [ ] Test #8 réussi : Permissions Conseiller
- [ ] Test #9 réussi : Permissions Secrétaire
- [ ] Test #10 réussi : Numérotation automatique

---

## 🎉 Félicitations !

Le Module 3 - Gestion du Courrier est maintenant opérationnel.

**Prochaines étapes suggérées :**
- Module 4 : Gestion des Audiences
- Module 5 : Gestion des Décrets
- Amélioration : Upload de fichiers avec Supabase Storage
- Amélioration : Notifications en temps réel
- Amélioration : Export PDF/Excel des courriers

---

**Contact Support**
Si vous rencontrez des problèmes, vérifiez d'abord la section Dépannage ci-dessus.
