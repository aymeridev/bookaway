# BookAway

## Équipe

- **Tourneur, Aymeri** : myoshipro@gmail.com
- **Oger, Alexandre** : alexandreoger35680@gmail.com

## Présentation du projet

**BookAway** est une plateforme web de réservation de logements (type Airbnb), permettant aux utilisateurs de rechercher, réserver et gérer des hébergements (hôtels, campings). Les propriétaires peuvent publier leurs annonces, gérer leurs biens et communiquer directement avec les voyageurs via une messagerie intégrée.

### L'idée

L'idée était de créer une plateforme complète de location de logements entre particuliers, en couvrant l'ensemble du parcours utilisateur : de la recherche géolocalisée à la réservation avec paiement, en passant par la messagerie entre hôte et voyageur, et le système d'avis.

### Points les plus faciles

- La mise en place du CRUD basique des propriétés et des utilisateurs avec Laravel, grâce à l'ORM Eloquent.
- L'intégration de l'authentification via Laravel Sanctum (tokens API).
- Le scaffolding du projet frontend avec Vite + React, qui offre un démarrage très rapide.

### Points les plus difficiles

- La recherche géolocalisée avec filtrage par distance (formule de Haversine) et l'intégration du géocodage via Nominatim (OpenStreetMap).
- La gestion transactionnelle des réservations (création simultanée du paiement, de la réservation, de la conversation et du message de bienvenue automatique).
- Le système de messagerie en temps réel avec gestion des messages lus/non-lus et des conversations liées aux réservations.

## Technologies utilisées

### Backend

| Technologie | Version | Rôle |
|---|---|---|
| **PHP** | ^8.2 | Langage serveur |
| **Laravel** | ^12.0 | Framework PHP principal |
| **Laravel Sanctum** | ^4.0 | Authentification par tokens API |
| **Scramble** | ^0.13.16 | Génération automatique de documentation OpenAPI / Swagger |
| **Intervention Image** | ^4.0 | Traitement et upload d'images (conversion WebP) |
| **PHPUnit** | ^11.5 | Tests unitaires |

**Pourquoi Laravel ?** : Laravel est le framework PHP le plus populaire et le plus complet. Il fournit un ORM puissant (Eloquent), un système de migrations, une gestion native de l'authentification API (Sanctum), et une architecture MVC claire qui accélère le développement.

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| **React** | ^19.2 | Bibliothèque UI |
| **TypeScript** | ~5.9 | Typage statique |
| **Vite** | ^8.0 | Bundler / serveur de développement |
| **TailwindCSS** | ^4.2 | Framework CSS utilitaire |
| **React Router** | ^7.13 | Routage côté client |
| **Zustand** | ^5.0 | Gestion d'état global (authentification) |
| **Axios** | ^1.13 | Client HTTP pour les appels API |
| **Leaflet / React Leaflet** | ^1.9 / ^5.0 | Carte interactive |
| **Radix UI** | ^1.6 | Composants UI accessibles |
| **i18next / react-i18next** | ^25.10 / ^16.6 | Internationalisation |
| **react-hook-form** | ^7.72 | Gestion des formulaires |
| **react-hot-toast** | ^2.6 | Notifications toast |
| **react-day-picker** | ^9.14 | Sélecteur de dates |
| **react-image-gallery** | ^2.1 | Galerie d'images |
| **react-dropzone** | ^15.0 | Upload d'images par drag & drop |
| **date-fns** | ^4.1 | Manipulation de dates |
| **Vitest** | ^4.1 | Tests unitaires frontend |

**Pourquoi React + Vite ?** : React est la bibliothèque UI la plus utilisée avec un écosystème très riche. Vite offre un démarrage instantané en développement grâce au HMR (Hot Module Replacement) et des builds de production ultra-rapides.

### Base de données

| Technologie | Version | Rôle |
|---|---|---|
| **PostgreSQL** | 18.3 | Base de données relationnelle |
| **Adminer** | latest | Interface web d'administration de la BDD |

**Pourquoi PostgreSQL ?** :  PostgreSQL est une base de données relationnelle robuste et performante, particulièrement adaptée aux requêtes géospatiales (calculs de distance avec Haversine).

## Gestion de projet

- **Gestion de version** : Git + GitLab
- **Communication** : Discord + GitLab
- **Répartition des tâches** : Organisation informelle avec répartition backend / frontend

## Expérience générale

### Niveau de l'équipe

- **Laravel (PHP)** : Niveau débutant. L'équipe avait déjà une base en PHP mais a approfondi ses connaissances sur Laravel 12 (Sanctum, Eloquent, policies, etc.).
- **React / TypeScript** : Niveau intermédiaire à avancé. Bonne maîtrise de React avec découverte de React 19, Zustand, et react-hook-form.
- **PostgreSQL** : Niveau intermédiaire. Première utilisation avec Docker pour certains membres.
- **TailwindCSS** : Niveau intermédiaire. Utilisation de la v4 avec le plugin Vite.

### Ce que nous avons appris

- L'utilisation de **Laravel Sanctum** pour sécuriser une API REST avec des tokens.
- L'intégration de **cartes interactives** (Leaflet) avec géocodage via une API externe.
- La gestion d'un **système de messagerie** complet avec conversations, messages, et statuts de lecture.
- Le déploiement d'une base de données avec **Docker Compose**.

### Outils que nous continuerons d'utiliser

- **Laravel** : Excellent pour les APIs REST.
- **React** : Outil performant pour le frontend.
- **Tailwind** : Gain de temps considérable pour le styling.
- **Docker** : Indispensable pour standardiser les environnements de développement.
- **Zustand** : Alternative légère à Redux pour la gestion d'état.

## Installation

### Prérequis

Assurez-vous d'avoir installé les outils suivants sur votre machine :

| Outil | Version minimale | Lien |
|---|---|---|
| **PHP** | 8.2+ | [php.net](https://www.php.net/downloads) |
| **Composer** | 2.x | [getcomposer.org](https://getcomposer.org/download/) |
| **Node.js/npm** | 20 | [nodejs.org](https://nodejs.org/) |

### Étapes d'installation

#### 1. Cloner le dépôt

```bash
git clone https://gitlab.dpt-info.univ-littoral.fr/tourneur.aymeri/bookaway.git
cd bookaway
```

#### 2. Lancer la base de données

```bash
cd db
docker compose up -d
```

Cela lance :
- **PostgreSQL** sur le port `5439`
- **Adminer** (interface web BDD) sur le port `8080`

#### 3. Installer et configurer le backend

```bash
cd ../bookaway

composer install

cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
```

> **Configuration de la BDD** : Le fichier `.env` doit contenir les informations suivantes (déjà configurées par défaut) :
> ```
> DB_CONNECTION=pgsql
> DB_HOST=localhost
> DB_PORT=5439
> DB_DATABASE=bookaway
> DB_USERNAME=postgres
> DB_PASSWORD=example
> ```

#### 4. Installer le frontend

```bash
cd ../bookaway-front
npm install
```

## Utilisation

### Lancer le projet complet

Ouvrez **3 terminaux**  :

#### Terminal 1 : Base de données (si pas déjà lancée)

```bash
cd db
docker compose up -d
```

#### Terminal 2 : Backend Laravel

```bash
cd bookaway
php artisan serve
```

Le serveur API démarre sur **http://localhost:8000**.

#### Terminal 3 : Frontend React

```bash
cd bookaway-front
npm run dev
```

Le serveur de développement Vite démarre sur **http://localhost:5173**.

> Le frontend est configuré avec un **proxy Vite** qui redirige automatiquement les appels `/api/*` vers `http://localhost:8000`, évitant ainsi les problèmes de CORS en développement.

## Routes d'API

### Documentation Swagger

La documentation interactive de l'API est générée automatiquement par **Scramble** et est accessible à l'adresse :

```
http://localhost:8000/docs/api
```

### Authentification

```
[POST]   /api/register                      → Inscription d'un nouvel utilisateur
[POST]   /api/login                         → Connexion (retourne un token Sanctum)
```

### Properties (Annonces)

```
[GET]    /api/properties                    → Liste toutes les propriétés (filtres: travelers, from, to, lat, lon)
[GET]    /api/properties/{id}               → Détail d'une propriété
[POST]   /api/properties                    → Créer une propriété
[PUT]    /api/properties/{id}               → Modifier une propriété
[DELETE] /api/properties/{id}               → Supprimer une propriété
[GET]    /api/my-properties                 → Lister les propriétés de l'utilisateur connecté
[GET]    /api/geocode?q={query}             → Recherche de coordonnées géographiques (proxy Nominatim)
```

### Property Images

```
[POST]   /api/properties/{property}/images          → Uploader une image pour une propriété
[DELETE] /api/properties/{property}/images/{image}   → Supprimer une image d'une propriété
```

### Bookings (Réservations)

```
[GET]    /api/bookings                      → Liste toutes les réservations
[GET]    /api/bookings/{id}                 → Détail d'une réservation
[POST]   /api/bookings                      → Créer une réservation (avec paiement)
[PUT]    /api/bookings/{id}                 → Modifier une réservation (statut, annulation...)
[DELETE] /api/bookings/{id}                 → Supprimer une réservation
[GET]    /api/my-reservations               → Réservations de l'utilisateur connecté
```

### Payments (Paiements)

```
[GET]    /api/payments                      → Liste tous les paiements
[GET]    /api/payments/{id}                 → Détail d'un paiement
[POST]   /api/payments                      → Créer un paiement
[PUT]    /api/payments/{id}                 → Modifier un paiement (statut)
[DELETE] /api/payments/{id}                 → Supprimer un paiement
```

### Users (Utilisateurs)

```
[GET]    /api/users                         → Liste tous les utilisateurs
[GET]    /api/users/{id}                    → Détail d'un utilisateur (avec réservations, paiements, avis reçus)
[POST]   /api/users                         → Créer un utilisateur
[PUT]    /api/users/{id}                    → Modifier un utilisateur
[DELETE] /api/users/{id}                    → Supprimer un utilisateur
[GET]    /api/users/{id}/properties         → Lister les propriétés d'un utilisateur
```

### Conversations (Messagerie)

```
[GET]    /api/conversations                 → Liste les conversations de l'utilisateur connecté
[POST]   /api/conversations                 → Démarrer/récupérer une conversation pour un logement
[POST]   /api/conversations/{id}/messages   → Envoyer un message dans une conversation
[POST]   /api/conversations/{id}/read       → Marquer les messages d'une conversation comme lus
```

### Ratings (Avis / Évaluations)

```
[GET]    /api/ratings?ratable_type={type}&ratable_id={id}  → Liste les avis (type: property ou user)
[POST]   /api/ratings                                       → Créer un avis
[DELETE] /api/ratings/{id}                                  → Supprimer un avis
```

## Notes finales

- Le système de paiement est **simulé** : les données de carte bancaire sont hashées en base mais aucune transaction réelle n'est effectuée via un prestataire de paiement.
- Le géocodage utilise l'API **Nominatim** (OpenStreetMap) avec un cache de 24h côté serveur pour limiter les appels.
- Lors de la création d'une réservation, une **conversation est automatiquement créée** entre le voyageur et le propriétaire, avec un message de bienvenue généré automatiquement.
- L'application supporte le **mode sombre** (dark mode) avec persistance du choix dans le `localStorage`.
- L'application est **internationalisée** grâce à i18next.
- Les images uploadées sont automatiquement converties au format **WebP** pour optimiser les performances.