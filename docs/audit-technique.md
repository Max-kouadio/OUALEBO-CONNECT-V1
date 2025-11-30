# Audit technique (TypeScript, build, dépendances)

## Dépendances vs stack imposée
- **Alignés** : React 18, React Router 6, React Query, Supabase JS 2.x, Tailwind 3, Zod, React Hook Form, date-fns, lucide-react, sonner, recharts, react-big-calendar.
- **Écarts / manquants** :
  - Pas de paquet `vite-plugin-pwa` installé alors que référencé dans `tsconfig.app.json` et `vite.config.ts` → build impossible.
  - Pas de dossier généré Shadcn/UI (pas d’utilisation de la CLI), certains composants UI custom mais pas tous ceux listés (ex : dropdown-menu, tabs, calendar, popover).
  - Pas de types générés Supabase (`src/lib/supabase/types`), aucune validation Zod partagée.

## Résultats commandes
- `npm run build` échoue avec :
  - `TS2688: Cannot find type definition file for 'vite-plugin-pwa/client'.`
  - `TS2307: Cannot find module 'vite-plugin-pwa' or its corresponding type declarations.`

## Causes principales des erreurs TS/Build
1. Dépendance manquante `vite-plugin-pwa` non ajoutée au package.json alors qu’elle est importée dans la config Vite.
2. Types globaux référencés (`vite-plugin-pwa/client`) absents, empêchant la compilation TypeScript.
3. Potentiel écart versions React (18.2.0) vs documentation (18.3) mais non bloquant.
4. Pas de vérification stricte des types Supabase (réponses `any`), ce qui masquera des erreurs runtime.

## Corrections techniques prioritaires
- Ajouter `vite-plugin-pwa` (runtime + types) ou retirer les références si le PWA n’est pas encore livré ; mettre à jour `tsconfig.app.json` en conséquence.
- Générer les types Supabase et centraliser les validations Zod par module.
- Ajouter un `.env.example` documentant `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
- Mettre en place des hooks métiers + React Query pour chaque module afin de limiter la logique directement dans les pages.
