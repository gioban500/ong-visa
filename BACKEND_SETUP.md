# Mise en service du backend de la refonte

Le nouveau backend utilise PostgreSQL sur Neon et écrit dans des tables `refonte_*` dédiées. La migration d'import copie des données des anciennes tables vers les nouvelles sans supprimer ni modifier les enregistrements d'origine.

## 1. Appliquer la migration Neon

Dans le SQL Editor du projet Neon utilisé par le site, exécuter dans l'ordre :

1. `db/migrations/001_refonte_backend.sql` pour créer les premières tables.
2. `db/migrations/002_import_legacy_refonte_data.sql` pour copier les anciennes demandes, les fiches cancer et les centres qui étaient déjà affichés dans le site.
3. `db/migrations/003_manage_homepage_content.sql` pour rendre administrables les sujets et les réponses de la page d’accueil.
4. `db/migrations/004_manage_abnormal_results_section.sql` pour créer les étapes numérotées et supprimer la FAQ ajoutée par erreur sous le guide d’auto-observation.
5. `db/migrations/005_remove_fixed_result_settings.sql` pour supprimer les réglages de la carte fixe de gauche ; seules les étapes déroulantes à droite restent administrables.
6. `db/migrations/006_security_rate_limits.sql` pour créer le stockage des compteurs de limitation des requêtes.

La seconde migration est réexécutable : elle ignore les enregistrements déjà importés. Elle conserve les anciennes données, laisse les demandes au statut « nouveau », et importe les centres ainsi que les fiches médicales comme non publiés, sans date de vérification médicale ou de centre. Elle ne crée ni ne modifie de compte administrateur.

## 2. Configurer les variables du serveur

Définir ces variables dans l’environnement local (`.env.local`) et dans l’environnement de déploiement :

- `POSTGRES_URL` : chaîne de connexion PostgreSQL du projet Neon, avec SSL activé.
- `ADMIN_SESSION_SECRET` : secret aléatoire d’au moins 32 caractères utilisé pour signer les sessions.
- `ADMIN_SETUP_TOKEN` : secret aléatoire d’au moins 32 caractères pour créer le tout premier compte administrateur.

Ne pas préfixer ces variables par `NEXT_PUBLIC_`. Ne pas publier leur valeur ni la committer.

La migration 006 doit être appliquée avant le déploiement du code qui active le rate limiting. Les compteurs enregistrent un HMAC de l’adresse IP, jamais l’adresse brute, signé avec `ADMIN_SESSION_SECRET`. Si l’application est déployée derrière un proxy autre que Vercel, configurer ce proxy pour écraser l’en-tête `x-real-ip` avec l’adresse du client ; ne pas faire confiance à un `x-real-ip` fourni librement par les clients.

**Avant de configurer `POSTGRES_URL`, réinitialiser dans Neon tout mot de passe de base de données qui a été partagé dans une conversation ou un autre canal non confidentiel. Ne jamais réutiliser l’ancienne chaîne de connexion.**

## 3. Créer le premier compte administrateur

Après la migration et le déploiement avec les trois variables, appeler une seule fois `POST /api/admin/bootstrap`, avec l’en-tête `x-admin-setup-token` et un corps JSON contenant l’adresse e-mail et un mot de passe d’au moins 14 caractères. Exemple PowerShell :

```powershell
$headers = @{ 'x-admin-setup-token' = $env:ADMIN_SETUP_TOKEN }
$body = @{ email = 'admin@exemple.org'; password = 'remplacer-par-un-mot-de-passe-fort' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'https://votre-site.example/api/admin/bootstrap' -Headers $headers -ContentType 'application/json' -Body $body
```

Renseigner localement le jeton de configuration dans `$env:ADMIN_SETUP_TOKEN` avant l’appel. Une fois le compte créé, supprimer `ADMIN_SETUP_TOKEN` des variables de déploiement. L’endpoint refuse de créer un second compte initial.

## Données gérées

- `refonte_contact_messages` : messages effectivement envoyés, sans adresse factice ; nom et moyen de réponse restent facultatifs.
- `refonte_centers` : centres que l’équipe a ajoutés ; un centre ne peut être publié qu’avec une date de vérification.
- `refonte_topics` : sujets et textes des cadres affichés dans l’explorateur de zones.
- `refonte_question_responses` : cartes de questions et de réponses affichées sur l’accueil.
- `refonte_abnormal_result_steps` : titres, textes, ordre et visibilité des lignes déroulantes numérotées à droite de la section « Résultat atypique ou anormal : et après ? ».
- `refonte_admins` : comptes et empreintes bcrypt des mots de passe.

Les sujets, les cartes de réponses et les étapes déroulantes après un résultat sont modifiables dans « Sections du site ». Dans la section « Résultat atypique ou anormal : et après ? », la carte de gauche (titre, texte, encadré et bouton) reste fixe dans le code ; seules les lignes numérotées de l’accordéon à droite peuvent être ajoutées, modifiées, réordonnées, masquées ou supprimées.

## Protections HTTP

- Connexion administrateur : 10 tentatives par adresse IP sur 15 minutes.
- Initialisation du compte administrateur : 5 tentatives sur une heure.
- Envoi de messages : 5 demandes sur 10 minutes.
- Inscriptions événementielles : 10 demandes sur 15 minutes.
- Les corps JSON de ces endpoints ont des tailles maximales et les champs d’inscription sont validés.
- Les en-têtes anti-framing, anti-MIME-sniffing, de référent et de permissions sont ajoutés par Next.js ; HSTS est envoyé en production.
- Le rate limiting dépend de la table Neon `refonte_rate_limits` et échoue de façon fermée si son stockage est indisponible.

Le calculateur et le carnet restent côté navigateur. Les dons et inscriptions événementielles ne sont pas inclus dans ce nouveau périmètre.
