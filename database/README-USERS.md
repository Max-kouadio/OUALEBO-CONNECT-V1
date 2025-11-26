# 🚀 Création Rapide des Utilisateurs Test

## 📋 Méthode Simple (Recommandée)

### Étape 1 : Créer les comptes Auth
Dans le **SQL Editor** de Supabase, exécutez :
```sql
-- Fichier : create-auth-users.sql
```

### Étape 2 : Créer les profils utilisateurs
Dans le **SQL Editor** de Supabase, exécutez :
```sql
-- Fichier : seed-users.sql
```

### Étape 3 : Tester
Connectez-vous avec :
- `admin@palais-royal.ci` / `123`
- `directeur@palais-royal.ci` / `123`
- `secretaire@palais-royal.ci` / `123`
- `tresorier@palais-royal.ci` / `123`
- `conseiller@palais-royal.ci` / `123`

---

## 👥 Liste des Utilisateurs

| Email | Mot de passe | Rôle | UUID |
|-------|--------------|------|------|
| admin@palais-royal.ci | 123 | Admin | 21cc9599-5df1-40d2-b5cd-b8e2600bcac0 |
| directeur@palais-royal.ci | 123 | Directeur | 55f5f0ad-8fce-4e11-a136-d3604b1b8f66 |
| secretaire@palais-royal.ci | 123 | Secrétaire | fa312c14-5bfb-472b-ba43-116ad5174b8b |
| tresorier@palais-royal.ci | 123 | Trésorier | c600167c-e4cd-47f4-a1fe-caed38dfe1c8 |
| conseiller@palais-royal.ci | 123 | Conseiller | 07757b84-717f-4772-acae-8cf3d40b708f |

---

## ✅ Vérification Rapide

```sql
-- Vérifier que les 5 utilisateurs existent
SELECT
  email,
  nom,
  prenom,
  role,
  actif
FROM utilisateurs
ORDER BY role;
```

**Résultat attendu :** 5 lignes

---

## 📖 Documentation Complète

Consultez `CREATE-USERS-GUIDE.md` pour plus de détails.
