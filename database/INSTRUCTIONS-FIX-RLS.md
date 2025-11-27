# 🔧 INSTRUCTIONS - CORRECTION BUG RLS POLICIES

## 🚨 PROBLÈME IDENTIFIÉ

**Erreur** : `infinite recursion detected in policy for relation "utilisateurs"`

**Cause** : Les politiques RLS (Row Level Security) sur la table `utilisateurs` créent une boucle infinie, empêchant le chargement des données utilisateur.

**Conséquence** : L'admin ne voit pas les modules avec restrictions (Trésorerie, Utilisateurs, Workflows) car `utilisateur` reste `null`.

---

## ✅ SOLUTION : APPLIQUER LE SCRIPT SQL

### **Étape 1 : Aller dans Supabase**

1. Ouvre https://supabase.com
2. Connecte-toi à ton compte
3. Sélectionne ton projet **OUALEBO-CONNECT-V1**

### **Étape 2 : Ouvrir l'éditeur SQL**

1. Dans le menu latéral gauche, clique sur **"SQL Editor"** (icône `</>`)
2. Clique sur **"New query"**

### **Étape 3 : Copier-coller le script**

Copie le contenu complet du fichier :
```
database/fix-rls-policies-simple.sql
```

Ou copie directement ce script :

```sql
-- ============================================
-- CORRECTION RLS POLICIES - TABLE UTILISATEURS
-- ============================================

-- 1. SUPPRIMER TOUTES LES POLICIES EXISTANTES
DROP POLICY IF EXISTS "Users can read their own data" ON utilisateurs;
DROP POLICY IF EXISTS "Users can update their own data" ON utilisateurs;
DROP POLICY IF EXISTS "Admins can read all users" ON utilisateurs;
DROP POLICY IF EXISTS "Admins can update all users" ON utilisateurs;
DROP POLICY IF EXISTS "Admins can insert users" ON utilisateurs;
DROP POLICY IF EXISTS "Admins can delete users" ON utilisateurs;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON utilisateurs;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON utilisateurs;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON utilisateurs;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON utilisateurs;
DROP POLICY IF EXISTS "utilisateurs_select_own" ON utilisateurs;
DROP POLICY IF EXISTS "utilisateurs_select_admin" ON utilisateurs;
DROP POLICY IF EXISTS "utilisateurs_update_own" ON utilisateurs;
DROP POLICY IF EXISTS "utilisateurs_update_admin" ON utilisateurs;
DROP POLICY IF EXISTS "utilisateurs_insert_admin" ON utilisateurs;
DROP POLICY IF EXISTS "utilisateurs_delete_admin" ON utilisateurs;

-- 2. ACTIVER RLS SUR LA TABLE
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES SIMPLES SANS RÉCURSION

-- ✅ Tous les utilisateurs authentifiés peuvent lire tous les utilisateurs
CREATE POLICY "utilisateurs_read_all"
ON utilisateurs
FOR SELECT
TO authenticated
USING (true);

-- ✅ Permettre mise à jour de ses propres données uniquement
CREATE POLICY "utilisateurs_update_own"
ON utilisateurs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ✅ Permettre insertion (pour le système)
CREATE POLICY "utilisateurs_insert_authenticated"
ON utilisateurs
FOR INSERT
TO authenticated
WITH CHECK (true);
```

### **Étape 4 : Exécuter le script**

1. Clique sur le bouton **"Run"** (en haut à droite)
2. Attends quelques secondes
3. Vérifie qu'il n'y a pas d'erreurs

**Résultat attendu** :
```
Success. No rows returned.
```

### **Étape 5 : Vérifier les policies**

Exécute cette requête de vérification :

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'utilisateurs'
ORDER BY policyname;
```

**Tu devrais voir** :
- `utilisateurs_read_all` (SELECT)
- `utilisateurs_update_own` (UPDATE)
- `utilisateurs_insert_authenticated` (INSERT)

### **Étape 6 : Tester dans l'application**

1. Retourne dans l'application : `npm run dev`
2. Recharge la page (Ctrl+R)
3. Connecte-toi avec `admin@palais-royal.ci`
4. Vérifie la console (F12) :
   - ✅ Plus d'erreur `infinite recursion`
   - ✅ Tu devrais voir les logs `🔍 DEBUG Sidebar - Rôle: admin`
5. Vérifie la Sidebar :
   - ✅ L'admin devrait maintenant voir **11/11 modules**
   - ✅ Y compris Trésorerie, Utilisateurs et Workflows

---

## 📋 CHECKLIST DE VALIDATION

- [ ] Script SQL exécuté sans erreur
- [ ] 3 policies créées (read_all, update_own, insert_authenticated)
- [ ] Plus d'erreur `infinite recursion` dans la console
- [ ] Admin voit les 11 modules
- [ ] Logs de debug affichent `Rôle: admin`

---

## 🆘 SI ÇA NE FONCTIONNE TOUJOURS PAS

Si après avoir appliqué le script, le problème persiste :

1. Vide le cache du navigateur (Ctrl+Shift+Delete)
2. Déconnecte-toi et reconnecte-toi
3. Vérifie que les données utilisateurs existent bien :

```sql
SELECT email, role FROM utilisateurs WHERE email = 'admin@palais-royal.ci';
```

4. Copie-colle les nouvelles erreurs de la console et envoie-les moi

---

**Bonne chance ! 🚀**
