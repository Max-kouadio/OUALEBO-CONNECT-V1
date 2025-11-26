# 🏛️ Cabinet Civil Numérique V2 - Palais Royal de Sakassou

Application web de gestion administrative pour le Palais Royal de Sakassou, Côte d'Ivoire, sous l'autorité de **Sa Majesté Nanan Kouakou Djè II, Roi des Baoulé**.

---

## ✅ Phase 1 - Module 1: Authentification (COMPLÉTÉ)

### Ce qui a été implémenté :

#### 1. Setup du projet
- ✅ Vite + React + TypeScript
- ✅ Tailwind CSS avec palette royale Baoulé
- ✅ Shadcn/ui pour les composants
- ✅ Structure de dossiers complète
- ✅ Configuration des alias de chemins (@/)

#### 2. Configuration Supabase
- ✅ Client Supabase configuré
- ✅ Variables d'environnement (.env)
- ✅ Types TypeScript pour utilisateurs

#### 3. Système d'authentification
- ✅ AuthContext avec hooks personnalisés
- ✅ Gestion des sessions persistantes
- ✅ Mise à jour automatique de la dernière connexion
- ✅ Compteur de connexions

#### 4. Interface utilisateur
- ✅ Page Login responsive avec gradient royal
- ✅ Dashboard simplifié avec profil utilisateur
- ✅ Routes protégées et publiques
- ✅ Gestion du chargement
- ✅ Notifications toast (Sonner)

---

## ✅ Phase 1 - Module 2: Dashboard avec KPIs (COMPLÉTÉ)

### Ce qui a été implémenté :

#### 1. Layout Professionnel
- ✅ Sidebar responsive avec navigation
- ✅ Navigation filtrée par rôles utilisateur
- ✅ Header avec profil et notifications
- ✅ Menu mobile (burger) pour tablette/smartphone
- ✅ AppLayout wrapper pour toutes les pages

#### 2. KPIs en Temps Réel
- ✅ **Courriers en attente** : Comptage dynamique (statuts 'recu', 'en_cours')
- ✅ **Documents récents** : Derniers 7 jours
- ✅ **Audiences planifiées** : Statuts 'approuvee', 'planifiee'
- ✅ **Transactions en attente** : Pour Admin/Directeur/Trésorier

#### 3. KPIs Financiers (Conditionnels)
- ✅ **Permissions par rôle** : Admin, Directeur, Trésorier uniquement
- ✅ **Recettes du mois** : Total approuvé depuis début du mois
- ✅ **Dépenses du mois** : Total approuvé depuis début du mois
- ✅ **Solde budgétaire** : Différence avec indicateur visuel
  - ✅ Vert si solde > 100 000 FCFA
  - ⚠️ Orange si solde entre -50 000 et 100 000 FCFA
  - 🚨 Rouge si solde < -50 000 FCFA

#### 4. Graphiques Recharts
- ✅ **Évolution financière** : Graphique ligne sur 6 derniers mois
- ✅ 3 lignes : Recettes (vert), Dépenses (rouge), Solde (bleu)
- ✅ Responsive avec tooltips formatés en FCFA
- ✅ Visible uniquement pour les rôles financiers

#### 5. Navigation par Rôles
- ✅ **Admin** : Accès total (tous les modules)
- ✅ **Directeur** : Accès à tout sauf Workflows
- ✅ **Secrétaire** : Courrier, Documents, Calendrier, Audiences, CRM
- ✅ **Trésorier** : Dashboard, Trésorerie
- ✅ **Conseiller** : Dashboard, Documents, selon spécialisation

---

## 🚀 Démarrage rapide

### 1. Configuration de la base de données Supabase

**IMPORTANT** : Avant de lancer l'application, vous devez :

1. Créer un projet sur [Supabase](https://supabase.com)

2. Exécuter les scripts SQL fournis dans le prompt (dans cet ordre) :
   - **Étape 1** : Créer toutes les tables (utilisateurs, courrier, documents, etc.)
   - **Étape 2** : Activer RLS sur toutes les tables
   - **Étape 3** : Créer les RLS Policies
   - **Étape 4** : Insérer les données initiales (seed)

3. Créer un utilisateur test dans Supabase Auth :
   - Aller dans `Authentication > Users > Add User`
   - Email : `admin@palais-royal.ci`
   - Mot de passe : (choisir un mot de passe)
   - **Copier l'UUID de l'utilisateur créé**

4. Insérer l'utilisateur dans la table `utilisateurs` :
   ```sql
   INSERT INTO utilisateurs (user_id, email, nom, prenom, role, poste, actif)
   VALUES (
     'VOTRE_UUID_ICI',  -- Remplacer par l'UUID copié ci-dessus
     'admin@palais-royal.ci',
     'Admin',
     'Système',
     'admin',
     'Administrateur Système',
     true
   );
   ```

### 2. Configuration de l'application

1. Récupérer les credentials Supabase :
   - Aller dans `Settings > API`
   - Copier `Project URL`
   - Copier `anon public key`

2. Mettre à jour le fichier `.env` :
   ```bash
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-anon-key-ici
   ```

### 3. Lancer l'application

```bash
# Installer les dépendances (déjà fait)
npm install

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur : `http://localhost:5173`

---

## 🔐 Test de l'authentification

1. Ouvrir `http://localhost:5173`
2. Vous serez redirigé vers `/login`
3. Se connecter avec :
   - Email : `admin@palais-royal.ci`
   - Mot de passe : (celui choisi lors de la création)
4. Vous serez redirigé vers le Dashboard

---

## 📁 Structure du projet

```
/OUALEBO-CONNECT-V1
├── /src
│   ├── /components
│   │   ├── /ui                  # Composants Shadcn/ui
│   │   ├── /layout              # [À venir] Sidebar, Header
│   │   ├── /courrier            # [À venir] Module Courrier
│   │   └── /common              # Composants réutilisables
│   ├── /pages
│   │   ├── Login.tsx            # ✅ Page de connexion
│   │   ├── Dashboard.tsx        # ✅ Dashboard simplifié
│   │   └── ...                  # [À venir] Autres pages
│   ├── /lib
│   │   ├── /supabase
│   │   │   └── client.ts        # ✅ Client Supabase
│   │   └── utils.ts             # ✅ Utilitaires (cn)
│   ├── /hooks                   # [À venir] Custom hooks
│   ├── /types
│   │   ├── utilisateur.types.ts # ✅ Types utilisateur
│   │   └── index.ts             # ✅ Export des types
│   ├── /contexts
│   │   └── AuthContext.tsx      # ✅ Context d'authentification
│   ├── App.tsx                  # ✅ Router principal
│   ├── main.tsx                 # ✅ Point d'entrée
│   └── index.css                # ✅ Styles Tailwind
├── tailwind.config.js           # ✅ Config Tailwind
├── vite.config.ts               # ✅ Config Vite
├── tsconfig.json                # ✅ Config TypeScript
├── .env                         # ⚠️ À configurer
└── package.json
```

---

## 🎨 Palette de couleurs royales

```css
--royal-gold: #D4AF37
--royal-burgundy: #800020
--royal-navy: #003366
```

---

## 📦 Technologies utilisées

- **Frontend** : React 19, TypeScript
- **Styling** : Tailwind CSS, Shadcn/ui
- **Backend** : Supabase (PostgreSQL, Auth, Storage)
- **State Management** : React Query (TanStack Query)
- **Routing** : React Router v6
- **Forms** : React Hook Form + Zod
- **Notifications** : Sonner

---

## ⏭️ Prochaines étapes (Phase 1 - Suite)

### ~~Module 2 : Dashboard avec KPIs (Jours 3-4)~~ ✅ COMPLÉTÉ
- [x] Layout principal (Sidebar + Header)
- [x] Navigation responsive
- [x] KPIs en temps réel
- [x] Graphiques Recharts

### Module 3 : Courrier CRUD (Jours 5-7) 🔄 PROCHAINE ÉTAPE
- [ ] CRUD complet
- [ ] Upload pièces jointes
- [ ] Filtres et recherche
- [ ] Archivage

### Module 4 : Documents GED (Jours 8-10)
- [ ] Upload fichiers
- [ ] Catégorisation
- [ ] Versioning
- [ ] Workflow validation

### Module 5 : Calendrier + Audiences (Jours 11-12)
- [ ] React Big Calendar
- [ ] Workflow audiences
- [ ] Synchronisation

### Module 6 : Utilisateurs (Jours 13-14)
- [ ] CRUD utilisateurs
- [ ] Gestion rôles
- [ ] Upload photo profil

---

## 🐛 Dépannage

### Erreur "Missing Supabase environment variables"
- Vérifier que le fichier `.env` existe et contient les bonnes valeurs
- Redémarrer le serveur de développement

### Erreur de connexion
- Vérifier que les scripts SQL ont été exécutés
- Vérifier que l'utilisateur existe dans Supabase Auth ET dans la table `utilisateurs`
- Vérifier que les RLS policies sont actives

### Problème de compilation TypeScript
- Exécuter `npm install` à nouveau
- Vérifier que `@types/node` est installé

---

## 📝 Notes importantes

1. **RLS (Row Level Security)** est activé sur toutes les tables
2. Les permissions sont strictement contrôlées par rôle
3. Toujours tester avec plusieurs utilisateurs de rôles différents
4. Ne jamais commit le fichier `.env` (déjà dans `.gitignore`)

---

## 🎯 CHECKPOINT 2 : Validation requise

**Module 2 - Dashboard avec KPIs est COMPLÉTÉ** ✅

Avant de continuer vers le Module 3, veuillez :
1. Tester le Dashboard avec les KPIs en temps réel
2. Vérifier la navigation dans la Sidebar (responsive)
3. Tester avec un utilisateur Admin pour voir les KPIs financiers et le graphique
4. Vérifier le Header et le profil utilisateur
5. Tester la navigation responsive (desktop/tablette/mobile)

**Ce qui fonctionne maintenant :**
- ✅ Layout professionnel avec Sidebar et Header
- ✅ KPIs en temps réel depuis Supabase
- ✅ KPIs financiers conditionnels (Admin/Directeur/Trésorier)
- ✅ Graphique d'évolution financière (Recharts)
- ✅ Navigation filtrée par rôles
- ✅ Responsive design

Une fois validé, je passerai au **Module 3 : Courrier CRUD** !

---

**Développé pour le Palais Royal de Sakassou** 👑
