# ONG VISA — site de sensibilisation et de dépistage

Site Next.js de l’ONG VISA consacré à l’information sur les cancers féminins, au dépistage et à l’accompagnement au Togo.

## Fonctionnalités du site

- Accueil avec sujets de santé, guide d’auto-observation et conseils après un résultat atypique.
- Formulaire de contact et espace d’écoute confidentiel.
- Répertoire des centres de dépistage.
- Questions et réponses éditoriales.
- Calculateur et carnet de suivi conservés dans le navigateur.
- Pages d’information, blog, témoignages, événements et dons selon les contenus disponibles.
- Administration protégée pour les messages, les centres et les sections éditoriales.

## Technologies

- Next.js 16, React 19 et TypeScript.
- PostgreSQL hébergé sur Neon pour le nouveau backend.
- `pg`, `bcryptjs` et JWT pour l’accès aux données et les sessions d’administration.
- Déploiement possible sur Vercel ou sur un serveur Node.js compatible.

## Lancer le site en local

Prérequis : Node.js et npm.

```powershell
npm install
npm run dev
```

Ouvrir `http://localhost:3000`.

Créer un fichier local `.env.local` contenant les variables serveur nécessaires :

```env
POSTGRES_URL=postgresql://<utilisateur>:<mot-de-passe>@<hote>/<base>?sslmode=require
ADMIN_SESSION_SECRET=<secret-aleatoire-d-au-moins-32-caracteres>
```

Ne jamais ajouter ces valeurs au code, au dépôt ou à une variable préfixée par `NEXT_PUBLIC_`. Les identifiants initiaux d’administration ne doivent pas être conservés dans le dépôt.

## Base de données Neon

Les migrations sont dans `db/migrations/` et doivent être exécutées dans l’ordre, dans l’éditeur SQL du bon projet Neon :

1. `001_refonte_backend.sql` — tables du backend de la refonte.
2. `002_import_legacy_refonte_data.sql` — copie des anciennes demandes, fiches cancer et centres vers les nouvelles tables, sans supprimer les données d’origine.
3. `003_manage_homepage_content.sql` — sujets éditoriaux et réponses aux questions.
4. `004_manage_abnormal_results_section.sql` — création des étapes déroulantes et retrait de la FAQ ajoutée par erreur sous le guide.
5. `005_remove_fixed_result_settings.sql` — suppression des réglages de la carte fixe à gauche ; seules les étapes numérotées à droite sont administrables.
6. `006_security_rate_limits.sql` — table des compteurs de limitation des requêtes.

La connexion utilise `POSTGRES_URL` (ou `DATABASE_URL`) et le secret de session `ADMIN_SESSION_SECRET`. Pour créer le tout premier compte d’une base vierge, l’endpoint temporaire `/api/admin/bootstrap` requiert aussi `ADMIN_SETUP_TOKEN`; retirez cette variable après l’initialisation. Cette étape n’est pas à refaire sur la base contenant déjà le compte administrateur.

La migration 006 doit être appliquée avant de déployer les modifications qui activent la limitation des requêtes. Les limites actuelles sont de 10 tentatives de connexion par adresse IP sur 15 minutes, 5 initialisations sur une heure, 5 messages sur 10 minutes et 10 inscriptions événementielles sur 15 minutes. Les identifiants IP sont hachés avec `ADMIN_SESSION_SECRET` avant leur stockage. En déploiement derrière un proxy différent de Vercel, celui-ci doit remplacer et définir l’en-tête `x-real-ip` ; sans adresse reconnue, les demandes de production partagent volontairement un même quota.

Les API protégées rejettent aussi les corps JSON trop volumineux. Des en-têtes HTTP de sécurité sont configurés dans Next.js ; la politique CSP se limite volontairement à interdire l’intégration du site dans une iframe pour éviter de casser les scripts et ressources existants. Les connexions TLS du pool historique vérifient maintenant le certificat serveur.

Le nouveau backend utilise des tables `refonte_*` et ne remplace pas automatiquement toutes les anciennes tables. Les pages historiques (par exemple blog, cancers et témoignages) peuvent encore s’appuyer sur le modèle antérieur.

## Administration

Connectez-vous sur `/admin/login`. Les sections principales sont :

- **Messages reçus** : demandes de contact et d’écoute, statut et suppression.
- **Centres de dépistage** : coordonnées, services, vérification et publication.
- **Sections du site** : sujets et textes de leurs cadres, cartes de réponses et étapes numérotées de l’accordéon après un résultat atypique. La carte d’information à gauche de cet accordéon reste fixe dans le code.

Un centre ne doit être publié qu’après vérification de ses informations. Les contenus éditoriaux peuvent être masqués sans être supprimés.

## Données et confidentialité

- Le calculateur et le carnet de suivi ne sont pas enregistrés sur le serveur.
- Les demandes sont conservées lorsqu’elles sont effectivement envoyées.
- Les coordonnées de centre doivent être validées par l’association avant publication.
- Les données médicales affichées et les réponses publiées doivent être relues et validées par l’équipe compétente.
- Les anciennes tables ne doivent pas être supprimées sans migration et sauvegarde préalables.

## Images

Les images utilisées sur la page d’accueil sont décrites dans [`public/images/README.md`](./public/images/README.md). Les images publiques doivent être placées dans `public/` et référencées par leur chemin web (par exemple `/images/anathomie.png`).

## Vérifications

```powershell
npm run lint
npm run build
```

Le dépôt peut contenir des erreurs de lint préexistantes dans des zones non liées aux changements en cours ; utiliser le lint ciblé lors d’une modification localisée.
