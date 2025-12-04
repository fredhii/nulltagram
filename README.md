[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<p align="center">
  <img src="https://img.icons8.com/carbon-copy/2x/camera.png" width="80" height="80">
  <h3 align="center">Nulltagram</h3>

  <p align="center">
    A full-stack Instagram clone built with React and Node.js, featuring real-time social interactions, Firebase authentication, and cloud-based image storage.
    <br /><br />
    <a href="https://github.com/fredhii/nulltagram/issues">Report Bug</a>
    ·
    <a href="https://github.com/fredhii/nulltagram/issues">Request Feature</a>
  </p>
</p>

## About The Project

Nulltagram is a social media platform that allows users to share photos, interact with others through likes and comments, and build a network of followers. Built as a learning project to demonstrate full-stack development skills with modern technologies.

### Key Features

- **User Authentication** - Email/password and Google OAuth via Firebase Auth
- **Photo Sharing** - Upload and share images with captions
- **Social Interactions** - Like posts, comment, follow/unfollow users
- **User Profiles** - Customizable profiles with avatar upload and bio
- **News Feed** - Paginated feed with cursor-based pagination
- **User Search** - Find and discover other users
- **API Documentation** - Interactive OpenAPI docs with Scalar UI

### Built With

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, React Router v6, Materialize CSS |
| **Backend** | Node.js, Express.js |
| **Database** | Cloud Firestore |
| **Authentication** | Firebase Auth (Email + Google OAuth) |
| **Storage** | Firebase Storage |
| **API Docs** | OpenAPI 3.0 + Scalar |
| **Containerization** | Docker, Docker Compose |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (React)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Auth    │  │  Feed    │  │ Profile  │  │ Create Post      │ │
│  │  Screens │  │  Screen  │  │  Screen  │  │ Screen           │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘ │
│       │             │             │                 │           │
│       └─────────────┴─────────────┴─────────────────┘           │
│                           │                                     │
│              ┌────────────┴────────────┐                        │
│              │    Firebase Auth SDK    │                        │
│              │   (Client-side Auth)    │                        │
│              └────────────┬────────────┘                        │
└───────────────────────────┼─────────────────────────────────────┘
                            │ JWT Token
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Server (Express.js)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              requireLogin Middleware                     │   │
│  │         (Firebase Admin Token Verification)              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│       ┌────────────────────┼────────────────────┐              │
│       ▼                    ▼                    ▼              │
│  ┌─────────┐         ┌─────────┐         ┌─────────┐          │
│  │  Auth   │         │  Post   │         │  User   │          │
│  │ Routes  │         │ Routes  │         │ Routes  │          │
│  └────┬────┘         └────┬────┘         └────┬────┘          │
│       │                   │                   │                │
│       └───────────────────┴───────────────────┘                │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Firebase Services                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Cloud         │  │   Firebase      │  │   Firebase      │ │
│  │   Firestore     │  │   Auth          │  │   Storage       │ │
│  │   (Database)    │  │   (Identity)    │  │   (Images)      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## API Endpoints

Interactive API documentation available at `/docs` when running the server.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/signup` | Create user profile after Firebase signup |
| `GET` | `/allposts` | Get paginated posts feed |
| `GET` | `/post/:id` | Get single post details |
| `POST` | `/createpost` | Create new post |
| `PUT` | `/givelike` | Like a post |
| `PUT` | `/removelike` | Unlike a post |
| `PUT` | `/insert-comment` | Add comment to post |
| `DELETE` | `/delete-comment/:postId/:idx` | Delete a comment |
| `DELETE` | `/delete-post/:postId` | Delete a post |
| `GET` | `/user/:id` | Get user profile and posts |
| `GET` | `/search-users` | Search users by name |
| `PUT` | `/follow` | Follow a user |
| `PUT` | `/unfollow` | Unfollow a user |
| `PUT` | `/update-profile` | Update name and bio |
| `PUT` | `/update-profile-image` | Update avatar |
| `GET` | `/mypost` | Get current user's posts |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Firebase project with Firestore, Auth, and Storage enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fredhii/nulltagram.git
   cd nulltagram
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Backend (`.env`):
   ```env
   PORT=5001
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   ```

   Frontend (`ntagram/.env`):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Configure Firebase Storage CORS** (via Google Cloud Shell):
   ```bash
   echo '[{"origin":["*"],"method":["GET","POST","PUT","DELETE","HEAD"],"maxAgeSeconds":3600,"responseHeader":["Content-Type","Authorization"]}]' > cors.json
   gsutil cors set cors.json gs://YOUR_BUCKET.appspot.com
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   pnpm dev

   # Terminal 2 - Frontend
   cd ntagram && pnpm start
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - API Docs: http://localhost:5001/docs

### Docker Deployment

The application uses a two-container architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Network (bridge)                      │
│                                                                 │
│   ┌─────────────────────┐      ┌─────────────────────┐         │
│   │  Frontend (nginx)   │      │  Backend (Node.js)  │         │
│   │                     │      │                     │         │
│   │  - Serves React     │ ───► │  - Express API      │         │
│   │  - Proxies /api     │      │  - Firebase Admin   │         │
│   │                     │      │                     │         │
│   │  Port: 80           │      │  Port: 5001         │         │
│   │  (exposed)          │      │  (internal only)    │         │
│   └─────────────────────┘      └─────────────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```bash
# Build and run both containers
docker compose up --build

# Run in background
docker compose up -d

# View logs
docker compose logs -f

# Stop containers
docker compose down
```

**URLs:**
- Frontend: http://localhost (port 80)
- API Docs: http://localhost/docs

## Project Structure

```
nulltagram/
├── app.js                 # Express server entry point
├── config/
│   ├── firebase.js        # Firebase Admin SDK initialization
│   └── openapi.js         # OpenAPI specification
├── middleware/
│   └── requireLogin.js    # JWT verification middleware
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── post.js            # Post CRUD operations
│   └── user.js            # User management routes
├── ntagram/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/    # Reusable components (Avatar, Modal, Search)
│   │   │   └── screens/   # Page components
│   │   ├── config/
│   │   │   └── firebase.js
│   │   ├── context/       # React contexts (Theme)
│   │   ├── reducers/
│   │   └── utils/         # Utilities (timeAgo, imageCompression)
│   └── vite.config.js
├── docker-compose.yml     # Two-container orchestration
├── Dockerfile.backend     # Backend container (Node.js)
├── Dockerfile.frontend    # Frontend container (nginx)
├── nginx.conf             # nginx reverse proxy config
└── package.json
```

## Database Schema

### Users Collection
```javascript
{
  name: string,
  email: string,
  image: string | null,
  bio: string | null,
  followers: string[],   // Array of user IDs
  following: string[]    // Array of user IDs
}
```

### Posts Collection
```javascript
{
  title: string,
  body: string,
  picture: string,       // Firebase Storage URL
  postedBy: string,      // User ID
  likes: string[],       // Array of user IDs
  comments: [{
    text: string,
    postedBy: string,    // User ID
    createdAt: string    // ISO timestamp
  }],
  createdAt: string      // ISO timestamp
}
```

## Roadmap

- [x] User authentication (Email + Google)
- [x] Post creation and deletion
- [x] Like and comment functionality
- [x] Follow/unfollow system
- [x] User profiles
- [x] Paginated API
- [x] OpenAPI documentation
- [ ] Infinite scroll
- [ ] Post detail page
- [ ] Dark mode
- [ ] Image compression
- [ ] Explore/discover page

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Fred - [@fredhii](https://linkedin.com/in/fredhii)

Project Link: [https://github.com/fredhii/nulltagram](https://github.com/fredhii/nulltagram)

[contributors-shield]: https://img.shields.io/github/contributors/fredhii/nulltagram?style=flat-square
[contributors-url]: https://github.com/fredhii/nulltagram/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/fredhii/nulltagram.svg?style=flat-square
[forks-url]: https://github.com/fredhii/nulltagram/network/members
[stars-shield]: https://img.shields.io/github/stars/fredhii/nulltagram.svg?style=flat-square
[stars-url]: https://github.com/fredhii/nulltagram/stargazers
[issues-shield]: https://img.shields.io/github/issues/fredhii/nulltagram?style=flat-square
[issues-url]: https://github.com/fredhii/nulltagram/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/fredhii
