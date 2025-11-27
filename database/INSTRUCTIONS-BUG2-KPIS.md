# 🔧 INSTRUCTIONS - CORRECTION BUG #2 - KPIs FINANCIERS

## 🚨 PROBLÈME

**Symptômes** :
- Les KPIs "Recettes du Mois", "Dépenses du Mois", "Solde Budgétaire" affichent **0 FCFA** ou valeurs nulles
- Le graphique d'évolution financière est vide ou affiche "Chargement..."

**Causes possibles** :
1. ❌ La table `treasury_transactions` n'existe pas
2. ❌ La table existe mais n'a pas de données de test
3. ❌ Les RLS policies bloquent les requêtes (comme pour `utilisateurs`)

---

## ✅ SOLUTION : APPLIQUER LE SCRIPT SQL

### **📋 ÉTAPE 1 : DIAGNOSTIC (OPTIONNEL)**

Si tu veux d'abord vérifier l'état actuel, exécute ce script de diagnostic dans **Supabase SQL Editor** :

```sql
-- Voir le fichier: database/debug-bug2-kpis-financiers.sql
-- Ou copie le contenu ci-dessous
```

**Ce script va vérifier** :
- ✅ Si la table existe
- ✅ Combien de transactions sont présentes
- ✅ Les RLS policies actives

---

### **📋 ÉTAPE 2 : CORRECTION (OBLIGATOIRE)**

Dans **Supabase SQL Editor**, copie-colle ce script :

```sql
-- ============================================
-- CORRECTION BUG #2 - KPIs FINANCIERS
-- ============================================

-- 1. CRÉER LA TABLE SI ELLE N'EXISTE PAS
CREATE TABLE IF NOT EXISTS treasury_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('recette', 'depense')),
  categorie VARCHAR(50),
  montant DECIMAL(15, 2) NOT NULL CHECK (montant > 0),
  description TEXT,
  date_transaction DATE NOT NULL DEFAULT CURRENT_DATE,
  statut VARCHAR(30) NOT NULL DEFAULT 'brouillon' CHECK (
    statut IN ('brouillon', 'en_attente_n1', 'en_attente_n2', 'en_attente_n3', 'approuvee', 'rejetee')
  ),
  createur_id UUID REFERENCES utilisateurs(id),
  validateur_n1_id UUID REFERENCES utilisateurs(id),
  validateur_n2_id UUID REFERENCES utilisateurs(id),
  validateur_n3_id UUID REFERENCES utilisateurs(id),
  date_validation_n1 TIMESTAMP,
  date_validation_n2 TIMESTAMP,
  date_validation_n3 TIMESTAMP,
  commentaire TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. RESET RLS POLICIES
ALTER TABLE treasury_transactions DISABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'treasury_transactions')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON treasury_transactions CASCADE';
    END LOOP;
END $$;

ALTER TABLE treasury_transactions ENABLE ROW LEVEL SECURITY;

-- 3. CRÉER LES POLICIES SIMPLES
CREATE POLICY "treasury_transactions_read_all"
ON treasury_transactions FOR SELECT TO authenticated USING (true);

CREATE POLICY "treasury_transactions_insert_authenticated"
ON treasury_transactions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "treasury_transactions_update_own"
ON treasury_transactions FOR UPDATE TO authenticated
USING (createur_id IN (SELECT id FROM utilisateurs WHERE user_id = auth.uid()))
WITH CHECK (createur_id IN (SELECT id FROM utilisateurs WHERE user_id = auth.uid()));

-- 4. INSÉRER LES DONNÉES DE TEST
DO $$
DECLARE
  admin_id UUID;
  today DATE := CURRENT_DATE;
  debut_mois DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
BEGIN
  SELECT id INTO admin_id FROM utilisateurs WHERE role = 'admin' LIMIT 1;

  IF admin_id IS NOT NULL THEN
    -- RECETTES DU MOIS EN COURS
    INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, createur_id)
    VALUES
      ('recette', 'Dotation Royale', 5000000, 'Dotation mensuelle du Royaume', debut_mois, 'approuvee', admin_id),
      ('recette', 'Cérémonies', 1500000, 'Revenus cérémonies traditionnelles', debut_mois + 5, 'approuvee', admin_id),
      ('recette', 'Donations', 800000, 'Dons des dignitaires', debut_mois + 10, 'approuvee', admin_id),
      ('recette', 'Services', 300000, 'Prestations diverses', debut_mois + 15, 'approuvee', admin_id),

      -- DÉPENSES DU MOIS EN COURS
      ('depense', 'Fonctionnement', 1200000, 'Salaires personnel Cabinet', debut_mois + 1, 'approuvee', admin_id),
      ('depense', 'Protocole', 800000, 'Frais de protocole et réceptions', debut_mois + 7, 'approuvee', admin_id),
      ('depense', 'Maintenance', 500000, 'Entretien Palais Royal', debut_mois + 12, 'approuvee', admin_id),
      ('depense', 'Communications', 200000, 'Téléphonie et internet', debut_mois + 3, 'approuvee', admin_id),

      -- TRANSACTIONS EN ATTENTE
      ('recette', 'Partenariats', 2000000, 'Partenariat économique', today, 'en_attente_n1', admin_id),
      ('depense', 'Événements', 1500000, 'Organisation festival culturel', today, 'en_attente_n2', admin_id);

    -- MOIS PRÉCÉDENTS (pour le graphique)
    INSERT INTO treasury_transactions (type, categorie, montant, description, date_transaction, statut, createur_id)
    VALUES
      -- Mois -1
      ('recette', 'Dotation Royale', 5000000, 'Dotation', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE, 'approuvee', admin_id),
      ('recette', 'Cérémonies', 1200000, 'Revenus', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 10, 'approuvee', admin_id),
      ('depense', 'Fonctionnement', 1100000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 5, 'approuvee', admin_id),
      ('depense', 'Protocole', 700000, 'Protocole', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE + 8, 'approuvee', admin_id),

      -- Mois -2
      ('recette', 'Dotation Royale', 5000000, 'Dotation', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE, 'approuvee', admin_id),
      ('recette', 'Donations', 600000, 'Dons', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 12, 'approuvee', admin_id),
      ('depense', 'Fonctionnement', 1200000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 5, 'approuvee', admin_id),
      ('depense', 'Maintenance', 800000, 'Entretien', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 month')::DATE + 15, 'approuvee', admin_id),

      -- Mois -3
      ('recette', 'Dotation Royale', 5000000, 'Dotation', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE, 'approuvee', admin_id),
      ('depense', 'Fonctionnement', 1100000, 'Salaires', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE + 5, 'approuvee', admin_id),
      ('depense', 'Protocole', 900000, 'Protocole', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')::DATE + 10, 'approuvee', admin_id);

    RAISE NOTICE 'Données de test insérées!';
  END IF;
END $$;

-- 5. VÉRIFICATION
SELECT
  'Recettes mois:' as info,
  SUM(montant) as total
FROM treasury_transactions
WHERE type = 'recette'
  AND statut = 'approuvee'
  AND date_transaction >= DATE_TRUNC('month', CURRENT_DATE);

SELECT
  'Dépenses mois:' as info,
  SUM(montant) as total
FROM treasury_transactions
WHERE type = 'depense'
  AND statut = 'approuvee'
  AND date_transaction >= DATE_TRUNC('month', CURRENT_DATE);
```

**Clique sur "RUN"** et attends le message de succès.

---

## ✅ RÉSULTATS ATTENDUS

### **Dans Supabase (après exécution)** :

Tu devrais voir dans les résultats :

| info | total |
|------|-------|
| Recettes mois: | 7,600,000 |
| Dépenses mois: | 2,700,000 |

**Solde = 7,600,000 - 2,700,000 = +4,900,000 FCFA** (affiché en **vert** ✅)

---

### **Dans l'Application (après rechargement)** :

1. **Retourne dans l'app** : `npm run dev`
2. **Recharge la page** : Ctrl+Shift+R
3. **Connecte-toi avec admin** : `admin@palais-royal.ci`

**Tu devrais maintenant voir** :

#### **KPIs Financiers** :
- 💰 **Transactions en attente** : 2
- 📈 **Recettes du Mois** : 7,600,000 FCFA (en vert)
- 📉 **Dépenses du Mois** : 2,700,000 FCFA (en rouge)
- 💵 **Solde Budgétaire** : +4,900,000 FCFA (en vert avec ✅ Excellent)

#### **Graphique d'évolution** :
- Graphique avec **3 courbes** :
  - Ligne **verte** : Recettes
  - Ligne **rouge** : Dépenses
  - Ligne **bleue** : Solde
- **Données sur les derniers mois** visibles
- **Tooltip au survol** avec montants

---

## 📋 CHECKLIST DE VALIDATION

- [ ] Script SQL exécuté sans erreur
- [ ] Vérification montre les totaux (7.6M recettes, 2.7M dépenses)
- [ ] 3 policies RLS créées
- [ ] Application rechargée (Ctrl+Shift+R)
- [ ] Admin voit les 4 KPIs financiers
- [ ] Recettes affichent 7,600,000 FCFA
- [ ] Dépenses affichent 2,700,000 FCFA
- [ ] Solde affiche +4,900,000 FCFA en vert
- [ ] Graphique s'affiche avec 3 courbes
- [ ] Tooltip fonctionne au survol

---

## 🆘 SI ÇA NE FONCTIONNE PAS

**Si tu vois toujours 0 FCFA** :
1. Vide le cache navigateur (Ctrl+Shift+Delete)
2. Déconnecte-toi et reconnecte-toi
3. Vérifie dans Supabase Table Editor que les données sont bien présentes

**Si erreur "admin not found"** :
- Le script cherche un utilisateur avec `role = 'admin'`
- Vérifie que tu as bien créé l'admin dans la table `utilisateurs`

**Si graphique vide** :
- Ouvre la console (F12)
- Cherche des erreurs Supabase
- Copie-colle les erreurs et envoie-les moi

---

**Bonne chance ! 🚀**

**Une fois validé, nous passerons au Bug #3 : Graphique d'évolution financière**
