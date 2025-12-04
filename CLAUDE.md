# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nulltagram is an Instagram-like social network for sharing photos. It's a full-stack JavaScript application with:
- **Backend**: Express.js + Firebase Admin SDK (Firestore + Auth)
- **Frontend**: React 18 + Vite + Firebase Auth SDK

## Development Commands

```bash
# Install all dependencies (uses pnpm workspaces)
pnpm install

# Run backend server (Express, port 5001)
pnpm dev

# Run React frontend with Vite (in separate terminal)
cd ntagram && pnpm dev

# Run React tests
cd ntagram && pnpm test

# Build React for production
pnpm build
```

## Docker Commands

```bash
# Build and run with Docker
docker compose up --build

# Run in background
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f app
```

## Environment Setup

### Backend (root `.env`)
Copy `.env-sample` to `.env` and configure:
- `PORT` - Server port (default 5001)
- `FIREBASE_SERVICE_ACCOUNT` - Firebase Admin SDK service account JSON (stringified)

### Frontend (`ntagram/.env`)
Copy `ntagram/.env.sample` to `ntagram/.env` and configure Firebase client config:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Dokploy Deployment

1. Create a new project in Dokploy
2. Connect your Git repository
3. Set environment variables:
   - `PORT=5001`
   - `FIREBASE_SERVICE_ACCOUNT` (stringified service account JSON)
4. For frontend Firebase config, set build args with `VITE_` prefix
5. Deploy - Dokploy will use the Dockerfile automatically

## Architecture

### Backend (root directory)
- `app.js` - Express server entry point, Firebase initialization, Scalar API docs
- `config/firebase.js` - Firebase Admin SDK initialization (Firestore + Auth)
- `config/openapi.js` - OpenAPI 3.0 specification
- `routes/` - API endpoints:
  - `auth.js` - Profile creation after Firebase Auth signup
  - `post.js` - CRUD operations for posts, likes, comments (Firestore)
  - `user.js` - User profiles, follow/unfollow (Firestore)
- `middleware/requireLogin.js` - Firebase Auth token verification middleware

### API Documentation
- `/docs` - Scalar API documentation UI
- `/openapi.json` - Raw OpenAPI 3.0 specification

### Frontend (`ntagram/` directory)
- React 18 app with Vite
- React Router v6 for routing
- Firebase Auth for authentication (email/password + Google sign-in)
- Uses Materialize CSS for styling
- Vite dev server proxies API requests to `http://localhost:5001`
- `src/config/firebase.js` - Firebase client SDK initialization
- `src/App.jsx` - Main app with Firebase auth state listener and UserContext
- `src/reducers/userReducer.js` - User state management
- `src/components/screens/` - Page components (Home, Profile, Signin, Signup, CreatePost, UserProfile)

### Firestore Collections
- `users` - User profiles (name, email, image, followers, following)
- `posts` - Posts (title, body, picture, likes, comments, postedBy, createdAt)

## API Authentication

All protected routes require Firebase ID token in Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

The `requireLogin` middleware verifies the token with Firebase Admin and fetches user data from Firestore.
