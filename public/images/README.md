# Images du site

Les images statiques publiques sont stockées dans ce dossier et référencées par leur chemin web à partir de la racine.

## Images utilisées actuellement

- `anathomie.png` : schéma illustratif de la section des sujets de santé.
- `autopalpation-guide.png` : infographie affichée dans le guide d’auto-observation.

Exemple dans un composant :

```tsx
<img src="/images/anathomie.png" alt="Schéma anatomique éducatif" />
```

Le logo partagé par l’en-tête public et l’administration est `public/logo.png`, en dehors de ce dossier.

N’ajoutez pas ici de données médicales nominatives ni d’images de patientes sans autorisation explicite. Pour remplacer une illustration, conservez son chemin ou mettez à jour les références dans les composants qui l’utilisent.
