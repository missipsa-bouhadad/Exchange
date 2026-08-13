# Échange Local

> Échange est une plateforme d'échanges de biens et de services entre particuliers : publiez une annonce (objet à prêter/donner ou compétence à offrir), cherchez autour de vous, proposez un échange et bâtissez votre réputation grâce aux avis laissés par la communauté.

## Fonctionnalités

- **Annonces** : créez des annonces de type `objet` ou `compétence/service`, avec photo (Cloudinary), dates de disponibilité, description de ce que vous cherchez en échange.

- **Recherche avec filtres** : tri par distance autour de votre position (rayon en km paramétrable, géolocalisation via OpenStreetMap) + filtres classiques (texte, ville, date, type).

- **Authentification** : inscription et connexion par email + mot de passe réinitialisation de mot de passe par email (via Resend).

- **Demandes d'échange** : envoyez une demande sur une annonce, acceptez ou refusez les demandes reçues, consultez l'historique des demandes envoyées avec leur statut (`PENDING` / `ACCEPTED` / `REJECTED`).

- **Messagerie** : chat 1-1 par demande acceptée et listing des conversations.

- **Notifications temps réel** : flux SSE qui pousse les nouvelles notifications (demande reçue, nouveau message) directement dans la cloche de la navbar.

- **Favoris** : sauvegarder / retirer une annonce avec une page dédiée listant les annonces favorites.

- **Notation post-échange** : après acceptation d'une demande, notez votre partenaire de 1 à 5 étoiles avec commentaire (1 notation par échange).

- **Profil** : édition des informations (nom, email, bio, localisation, téléphone, photo), statistiques personnelles.

## Stack technique

| Type             | Outil / Librairie                              |
| ---------------- | ---------------------------------------------- |
| Frontend         | **React 19** + **Vite 7**                     |
| Style            | **TailwindCSS 4** (+ composants Radix UI)      |
| Gestion d'état   | **Redux Toolkit** + **redux-persist**         |
| Utilitaires      | **axios**, **date-fns**, **clsx**, **tailwind-merge** |
| Backend          | **Node.js** + **Express 5**                    |
| Base de données  | **MongoDB**                                    |
| Auth             | **JWT** + **bcryptjs**               |
| Upload d'images  | **multer** + **Cloudinary** |
| Emails           | **Resend**                            |
| Géocodage        | **OpenStreetMap Nominatim**  |
| Temps réel       | **Server-Sent Events**  |
| Tests            | **Jest** + **Supertest** + **mongodb-memory-server** |

## Modèles de données (Mongoose)

| Modèle         | Description                                                       | Attributs principaux |
| -------------- | ----------------------------------------------------------------- | -------------------- |
| `User`         | Utilisateur de l'application                                      | `firstName`, `lastName`, `email`, `password`, `location`, `tel`, `bio`, `occupation`, `photoUrl`, `favorites` (ref `Ad`), `resetPasswordToken`, `resetPasswordExpires` |
| `Ad`           | objet ou compétence                                     | `title`, `description`, `type` (`GOOD`/`SKILL`), `city`, `location` (GeoJSON Point + index 2dsphere), `imageUrl`, `user` (ref `User`), `availabilityStart`, `availabilityEnd`, `exchangeWith`, `status` (`AVAILABLE`/`EXCHANGED`) |
| `Request`      | Demande d'échange sur une annonce                                 | `ad`, `fromUser`, `toUser`, `message`, `status` (`PENDING`/`ACCEPTED`/`REJECTED`) |
| `Chat`         | Conversation liée à une demande acceptée                          | `chatName`, `users[]`, `latestMessage`, `adDescription`, `request` |
| `Message`      | Message dans un chat                                              | `sender` (ref `User`), `content`, `chat` (ref `Chat`) |
| `Notification` | Notification pushed via SSE                                       | `receiver`, `sender`, `type` (`REQUEST`/`MESSAGE`), `message`, `link`, `isRead` |
| `Rating`       | Note post-échange (unique par couple `fromUser` / `request`)      | `fromUser`, `toUser`, `request`, `value`, `comment` |

Relations principales :

- `User` **1-N** `Ad` (via `Ad.user`)
- `User` **1-N** `Request` à la fois en `fromUser` et en `toUser`
- `Ad` **1-N** `Request`
- `Request` **1-1** `Chat` (créé à l'acceptation)
- `Chat` **1-N** `Message`
- `Request` **1-1** `Rating` (contrainte d'unicité `{ fromUser, request }`)

## Routes API (préfixe `/api/v1`)

| Méthode | Endpoint                          | Description                                      |
| ------- | --------------------------------- | ------------------------------------------------ |
| POST    | `/user/register`                  | Inscription                                      |
| POST    | `/user/login`                     | Connexion (cookie JWT)                           |
| GET     | `/user/logout`                    | Déconnexion                                      |
| GET     | `/user/me`                        | Utilisateur courant                              |
| GET     | `/user/:id`                       | Profil public d'un utilisateur                   |
| PUT     | `/user/profile/update`            | Mise à jour du profil (avec photo)               |
| POST    | `/user/forgot-password`           | Demande de réinitialisation (envoi email)        |
| POST    | `/user/reset-password/:token`     | Réinitialisation avec le token                   |
| POST    | `/user/favorites/:adId`           | Ajouter / retirer une annonce des favoris       |
| GET     | `/user/favorites`                 | Liste des annonces favorites                     |
| POST    | `/ad/create`                      | Créer une annonce (avec image)                   |
| GET     | `/ad/ads`                         | Lister les annonces (filtres, géo)               |
| GET     | `/ad/:id`                         | Détail d'une annonce                             |
| PUT     | `/ad/update/:id`                  | Mettre à jour une annonce                        |
| DELETE  | `/ad/delete/:id`                  | Supprimer une annonce                            |
| GET     | `/ad/user/:id`                    | Annonces d'un utilisateur                        |
| POST    | `/requests`                       | Créer une demande d'échange                      |
| GET     | `/requests/received`              | Demandes reçues                                  |
| GET     | `/requests/sent`                  | Demandes envoyées                                |
| POST    | `/requests/:id/accept`            | Accepter (crée le chat, statut `EXCHANGED`)      |
| POST    | `/requests/:id/reject`            | Refuser                                          |
| GET     | `/chats`                          | Lister les conversations                         |
| POST    | `/chats`                          | Créer une conversation                           |
| POST    | `/messages`                       | Envoyer un message                               |
| GET     | `/messages/:chatId`               | Lister les messages d'un chat                    |
| GET     | `/notifications`                  | Lister les notifications                         |
| GET     | `/notifications/stream`           | Flux SSE temps réel                              |
| PATCH   | `/notifications/:id/read`         | Marquer une notification comme lue               |
| PATCH   | `/notifications/read-all`         | Tout marquer comme lu                            |
| POST    | `/ratings`                        | Noter un partenaire                              |
| GET     | `/ratings/user/:userId`           | Notes reçues par un utilisateur                  |
| GET     | `/ratings/request/:requestId/me`  | Ma note pour une demande donnée                  |

## Structure du projet

```
exchange/
├── backend/
│   ├── app.js                       # Config Express + middlewares + routes + error handler
│   ├── server.js                    # Connexion DB + listen
│   ├── controllers/                 # Logique métier 
│   ├── models/                      # Schémas Mongoose
│   ├── routes/                      # Définitions Express Router
│   ├── middleware/                   
│   ├── utils/                       
│   ├── database/db.js               # Connexion MongoDB
│   ├── data/data.js                 # Jeu de données pour Mongo (chats)
│   ├── tests/ad.test.js             # Tests d'intégration (Jest + Supertest + MongoMemoryServer)
│   └── package.json
├── frontend/
│   ├── index.html                   # Page d'entrée Vite
│   ├── vite.config.js               
│   ├── public/                      # Assets 
│   └── src/
│       ├── main.jsx                 # Provider, PersistGate, ThemeProvider, ChatProvider
│       ├── App.jsx                  # Router
│       ├── index.css                # Thème Tailwind + variables CSS 
│       ├── pages/                   # Pages
│       ├── components/              # Composants
│       │   └── ui/                  
│       ├── context/ChatProvider.jsx # Contexte React partagé
│       ├── hooks/                   
│       ├── redux/                   # store, authSlice 
│       ├── lib/utils.js             
│       └── assets/                  
├── rapport.md                       
└── README.md                        
```

## Démarrage

### Pré-requis

- **Node.js 18+**
- Une base **MongoDB** 
- Un compte **Cloudinary** pour l'upload d'images
- Un compte **Resend** pour l'envoi des emails (récupértion de mot de passe)

### 1. Cloner le projet

```bash
git clone https://github.com/missipsa2/Exchange.git
cd Exchange
```

### 2. Configurer le backend

Créez un fichier `backend/.env` à partir de .env.example:

| Variable              | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `MONGODB_URI`         | URI de connexion à MongoDB                   |
| `CLOUD_NAME`          | Cloud name Cloudinary                                       |
| `API_KEY`             | API key Cloudinary                         |
| `API_SECRET`          | API secret Cloudinary            |
| `SECRET_KEY`          | Secret utilisé pour signer les JWT          |
| `PORT`                | Port d'écoute du backend (par défaut 3000) |
| `RESEND_API_KEY`      | Clé d'API Resend |
| `RESEND_FROM`         | Adresse d'expéditeur (exp: `onboarding@resend.dev` en dev)                  |
| `FRONTEND_URL`        | URL du frontend (exp: `http://localhost:5173`)|
| `NODE_ENV`            | `development` ou `production`|

### 3. Lancer le backend

```bash
cd backend
npm install
npm run dev
```

Le serveur écoute sur `http://localhost:3000` (ou le port configuré).

### 4. Lancer le frontend

```bash
cd ../frontend
npm install
npm run dev
```

Le frontend est accessible sur [http://localhost:5173](http://localhost:5173).

> L'URL de l'API backend est codée en dur sur `http://localhost:8000` dans les fichiers front (`NavBar`, `Announcements`, `useFavorites`, etc.). Si vous lancez le backend sur un autre port, ajustez en conséquence ou passez par une variable d'env `VITE_API_URL` (refactor prévu, voir `rapport.md` #63).

### 5. Lancement des tests

```bash
cd backend
npm test
```

## Remarques

### Resend en dev

L'offre gratuite de Resend n'autorise l'envoi qu'à l'adresse qui a créé le compte. Pensez à adapter le destinataire dans `utils/resend.js` si vous testez la réinitialisation de mot de passe.
