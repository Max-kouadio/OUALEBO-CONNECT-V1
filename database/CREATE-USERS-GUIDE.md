# 👥 Guide de Création des Utilisateurs Test

Ce guide explique comment créer les 5 utilisateurs test pour l'application Cabinet Civil Numérique.

---

## ⚠️ IMPORTANT : Ordre des Opérations

**Vous devez créer les utilisateurs dans CET ORDRE :**

1. **D'ABORD** : Créer les utilisateurs dans Supabase Auth
2. **ENSUITE** : Exécuter le script SQL pour insérer dans la table `utilisateurs`

---

## 📋 Étape 1 : Créer les Utilisateurs dans Supabase Auth

### Comment procéder :

1. Ouvrir votre projet Supabase
2. Aller dans `Authentication` > `Users`
3. Cliquer sur `Add User` > `Create New User`
4. Pour chaque utilisateur, utiliser **EXACTEMENT** les UUIDs fournis ci-dessous

---

### 👤 Utilisateur 1 : ADMIN (Roi Baoulé)

```
Email: admin@palais-royal.ci
Password: 123
```

**⚠️ IMPORTANT : UUID à utiliser**
```
21cc9599-5df1-40d2-b5cd-b8e2600bcac0
```

**Comment forcer l'UUID dans Supabase Auth :**
- Si Supabase génère automatiquement un UUID différent, vous devrez utiliser l'API REST ou le SQL Editor
- Ou noter l'UUID généré et modifier le script SQL `seed-users.sql` en conséquence

---

### 👤 Utilisateur 2 : DIRECTEUR (DirCab Civil)

```
Email: directeur@palais-royal.ci
Password: 123
```

**⚠️ UUID à utiliser :**
```
55f5f0ad-8fce-4e11-a136-d3604b1b8f66
```

---

### 👤 Utilisateur 3 : SECRÉTAIRE (Secrétaire No1)

```
Email: secretaire@palais-royal.ci
Password: 123
```

**⚠️ UUID à utiliser :**
```
fa312c14-5bfb-472b-ba43-116ad5174b8b
```

---

### 👤 Utilisateur 4 : TRÉSORIER (Trésorier No2)

```
Email: tresorier@palais-royal.ci
Password: 123
```

**⚠️ UUID à utiliser :**
```
c600167c-e4cd-47f4-a1fe-caed38dfe1c8
```

---

### 👤 Utilisateur 5 : CONSEILLER (Conseiller No3)

```
Email: conseiller@palais-royal.ci
Password: 123
```

**⚠️ UUID à utiliser :**
```
07757b84-717f-4772-acae-8cf3d40b708f
```

---

## 📋 Étape 2 : Méthode Recommandée (SQL Editor)

Si vous ne pouvez pas forcer les UUIDs via l'interface, utilisez le SQL Editor de Supabase :

### Créer les utilisateurs dans Auth avec SQL :

```sql
-- ============================================
-- CRÉER LES UTILISATEURS DANS AUTH.USERS
-- ============================================
-- ATTENTION : Exécuter AVANT seed-users.sql

-- 1. Admin
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  '21cc9599-5df1-40d2-b5cd-b8e2600bcac0',
  '00000000-0000-0000-0000-000000000000',
  'admin@palais-royal.ci',
  crypt('123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Directeur
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  '55f5f0ad-8fce-4e11-a136-d3604b1b8f66',
  '00000000-0000-0000-0000-000000000000',
  'directeur@palais-royal.ci',
  crypt('123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Secrétaire
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  'fa312c14-5bfb-472b-ba43-116ad5174b8b',
  '00000000-0000-0000-0000-000000000000',
  'secretaire@palais-royal.ci',
  crypt('123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Trésorier
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  'c600167c-e4cd-47f4-a1fe-caed38dfe1c8',
  '00000000-0000-0000-0000-000000000000',
  'tresorier@palais-royal.ci',
  crypt('123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Conseiller
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  '07757b84-717f-4772-acae-8cf3d40b708f',
  '00000000-0000-0000-0000-000000000000',
  'conseiller@palais-royal.ci',
  crypt('123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;
```

---

## 📋 Étape 3 : Exécuter le Script seed-users.sql

Une fois les utilisateurs créés dans Auth, exécutez :

```sql
-- Fichier : database/seed-users.sql
```

Ce script va insérer les utilisateurs dans la table `utilisateurs` avec tous les détails :
- Nom, Prénom
- Rôle, Poste
- Spécialisation (pour Conseiller)

---

## ✅ Étape 4 : Vérification

### Vérifier que les utilisateurs existent dans Auth :

```sql
SELECT
  id,
  email,
  created_at
FROM auth.users
WHERE email IN (
  'admin@palais-royal.ci',
  'directeur@palais-royal.ci',
  'secretaire@palais-royal.ci',
  'tresorier@palais-royal.ci',
  'conseiller@palais-royal.ci'
);
```

### Vérifier que les utilisateurs existent dans la table utilisateurs :

```sql
SELECT
  user_id,
  email,
  nom,
  prenom,
  role,
  poste,
  specialisation,
  actif
FROM utilisateurs
ORDER BY
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'directeur' THEN 2
    WHEN 'secretaire' THEN 3
    WHEN 'tresorier' THEN 4
    WHEN 'conseiller' THEN 5
  END;
```

**Résultat attendu :** 5 utilisateurs

---

## 🧪 Étape 5 : Tester la Connexion

Testez la connexion avec chaque utilisateur :

### 1. Admin
```
Email: admin@palais-royal.ci
Password: 123
```
**Attendu :** Accès à tous les modules + KPIs financiers

### 2. Directeur
```
Email: directeur@palais-royal.ci
Password: 123
```
**Attendu :** Accès à tous sauf Workflows + KPIs financiers

### 3. Secrétaire
```
Email: secretaire@palais-royal.ci
Password: 123
```
**Attendu :** Courrier, Documents, Calendrier, Audiences, CRM (PAS de KPIs financiers)

### 4. Trésorier
```
Email: tresorier@palais-royal.ci
Password: 123
```
**Attendu :** Dashboard, Trésorerie + KPIs financiers

### 5. Conseiller
```
Email: conseiller@palais-royal.ci
Password: 123
```
**Attendu :** Dashboard, Documents, CRM (PAS de KPIs financiers)

---

## 📊 Récapitulatif des Rôles et Permissions

| Rôle | Modules Accessibles | KPIs Financiers |
|------|---------------------|-----------------|
| **Admin** | Tous (11 modules) | ✅ Oui |
| **Directeur** | Tous sauf Workflows (10 modules) | ✅ Oui |
| **Secrétaire** | Dashboard, Courrier, Documents, Calendrier, Audiences, CRM (6 modules) | ❌ Non |
| **Trésorier** | Dashboard, Trésorerie (2 modules) | ✅ Oui |
| **Conseiller** | Dashboard, Documents, CRM (3 modules) | ❌ Non |

---

## 🔧 Dépannage

### Problème : "User already exists"
- Les utilisateurs existent déjà dans Auth
- Vous pouvez ignorer cette erreur et passer directement à l'Étape 3

### Problème : "Cannot insert into auth.users"
- Vous n'avez peut-être pas les permissions nécessaires
- Utilisez l'interface Supabase Auth > Users > Add User
- Notez les UUIDs générés et modifiez `seed-users.sql` en conséquence

### Problème : RLS Policy bloque l'insertion
- Les policies RLS sont actives
- Utilisez le SQL Editor qui a les permissions admin
- Ou désactivez temporairement RLS sur la table utilisateurs :
  ```sql
  ALTER TABLE utilisateurs DISABLE ROW LEVEL SECURITY;
  -- Insérer les utilisateurs
  ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;
  ```

---

## ✅ Checklist Finale

- [ ] Les 5 utilisateurs existent dans `auth.users`
- [ ] Les 5 utilisateurs existent dans la table `utilisateurs`
- [ ] Les UUIDs correspondent entre les deux tables
- [ ] Connexion testée pour Admin
- [ ] Connexion testée pour Directeur
- [ ] Connexion testée pour Secrétaire
- [ ] Connexion testée pour Trésorier
- [ ] Connexion testée pour Conseiller
- [ ] Les permissions par rôle fonctionnent correctement
- [ ] Les KPIs financiers ne s'affichent que pour Admin/Directeur/Trésorier

---

**Une fois tous les utilisateurs créés, vous êtes prêt à tester toute l'application ! 🎉**
