# Configuration PWA - Service Worker

## 🎯 Problème Résolu

La page **Audience** restait bloquée sur un ancien placeholder en raison du cache navigateur agressif. Une configuration PWA complète avec Service Worker a été implémentée pour résoudre ce problème.

## ✅ Modifications Apportées

### 1. Installation des dépendances PWA
```bash
npm install -D vite-plugin-pwa workbox-window
```

### 2. Configuration Vite (`vite.config.ts`)

**Stratégies de cache implémentées :**

- **Network-First pour HTML** : Toujours chercher la version réseau d'abord
- **Network-First pour JS/CSS** : Assure la dernière version du code
- **Cache-First pour Images** : Optimise les performances
- **Network-First pour API** : Garantit les données fraîches

**Fonctionnalités Service Worker :**
- ✅ `skipWaiting: true` - Activation immédiate du nouveau SW
- ✅ `clientsClaim: true` - Prise de contrôle immédiate de tous les onglets
- ✅ `cleanupOutdatedCaches: true` - Suppression automatique des anciens caches
- ✅ **Version de cache v2** - Tous les caches utilisent la version 2

### 3. Headers HTML (`index.html`)

Ajout de meta tags pour empêcher le cache agressif :
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

### 4. Enregistrement du Service Worker (`src/main.tsx`)

Le Service Worker s'enregistre automatiquement avec :
- Auto-update lors de nouvelles versions détectées
- Vérification des mises à jour toutes les heures
- Logs console pour le debugging

## 🧪 Tests de Validation

### En développement (`npm run dev`)
1. Ouvrir DevTools > Application > Service Workers
2. Vérifier que le Service Worker est enregistré
3. Activer "Update on reload" pour le développement

### En production (`npm run build && npm run preview`)
1. Build le projet : `npm run build`
2. Servir localement : `npm run preview`
3. Ouvrir DevTools > Application :
   - **Service Workers** : Vérifier l'activation
   - **Cache Storage** : Vérifier les caches v2
   - **Manifest** : Vérifier la configuration PWA

### Test de mise à jour de cache
1. Modifier le contenu d'Audiences.tsx
2. Rebuild : `npm run build`
3. Recharger la page (le SW auto-update s'active)
4. Vérifier que les changements sont visibles immédiatement

## 🔧 Pour l'utilisateur final

### Résoudre le cache bloquant

Si la page Audience est toujours bloquée sur l'ancien contenu :

1. **Méthode 1 - Forcer la mise à jour** (Recommandée)
   - Ouvrir DevTools (F12)
   - Aller dans Application > Service Workers
   - Cliquer sur "Unregister" pour l'ancien Service Worker
   - Cliquer sur "Clear storage" > "Clear site data"
   - Recharger la page (Ctrl+F5)

2. **Méthode 2 - Hard Reload**
   - Windows/Linux : `Ctrl + Shift + R`
   - Mac : `Cmd + Shift + R`

3. **Méthode 3 - Vider le cache navigateur**
   - Chrome : Paramètres > Confidentialité > Effacer les données de navigation
   - Sélectionner "Images et fichiers en cache"
   - Effacer

## 📦 Fichiers générés au build

```
dist/
├── sw.js                    # Service Worker principal
├── workbox-354287e6.js      # Runtime Workbox
├── manifest.webmanifest     # Manifest PWA
└── assets/                  # Fichiers de l'application
```

## 🚀 Déploiement

Lors du déploiement :
1. Les utilisateurs recevront automatiquement la nouvelle version
2. Le Service Worker se met à jour automatiquement
3. Les anciens caches sont nettoyés automatiquement

## 📊 Monitoring

Vérifier les logs console pour :
- `Service Worker registered successfully` - Enregistrement réussi
- `New content available, updating...` - Nouvelle version détectée
- `App ready to work offline` - Mode offline activé

## 🔄 Cycle de vie du Service Worker

1. **Install** : Précache les fichiers essentiels
2. **Activate** : Nettoie les anciens caches (skipWaiting)
3. **Fetch** : Applique les stratégies de cache (Network-First/Cache-First)
4. **Update** : Auto-détection et installation des nouvelles versions

## ⚠️ Notes importantes

- Le Service Worker fonctionne uniquement sur **HTTPS** (ou localhost en dev)
- Les mises à jour sont vérifiées automatiquement toutes les heures
- En développement, activer "Update on reload" dans DevTools pour voir les changements immédiatement
- La stratégie Network-First garantit que la page Audience affichera toujours la dernière version

## 🎓 Ressources

- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
