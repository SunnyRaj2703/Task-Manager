# Team Task Manager

A full-stack production-ready team task manager application built with:

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT-based auth
- Deployment-ready for Railway

## Folder structure

```
Task-Manager-Tutorial-main/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── roleMiddleware.js
│   │   └── validateRequest.js
│   ├── models/
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── Topbar.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── ProjectView.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── postcss.config.js
└── README.md
```

## Backend setup

1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example` and configure:
   ```bash
   cp .env.example .env
   ```
4. Start backend locally:
   ```bash
   npm run dev
   ```

### Backend environment variables

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_SECRET=your_admin_registration_secret
FRONTEND_URL=http://localhost:5173
PORT=3000
```

## Frontend setup

1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend locally:
   ```bash
   npm run dev
   ```

## Sample API endpoints

### Auth
- `POST /api/auth/signup` - register user
- `POST /api/auth/login` - login user
- `GET /api/auth/profile` - current user profile

### Users
- `GET /api/users` - list all users (admin only)
- `GET /api/users/:id` - get user details (admin only)

### Projects
- `GET /api/projects` - list projects
- `GET /api/projects/:id` - get a project
- `POST /api/projects` - create project (admin only)
- `PUT /api/projects/:id` - update project (admin only)
- `DELETE /api/projects/:id` - delete project (admin only)

### Tasks
- `GET /api/tasks` - list tasks
- `GET /api/tasks/:id` - get task details
- `POST /api/tasks` - create task (admin only)
- `PUT /api/tasks/:id` - update task metadata
- `PATCH /api/tasks/:id/status` - update task status
- `DELETE /api/tasks/:id` - delete task (admin only)

## Deployment notes

- The backend is Railway-compatible and uses `server.js` as the entry point.
- Configure environment variables in Railway with the same keys from `.env.example`.
- The frontend expects `VITE_API_URL` when deployed, otherwise it defaults to `http://localhost:3000/api`.

## Notes

- JWT is stored in `localStorage`.
- Role-based access control is enforced in backend routes.
- The app uses React Context for authentication state on the frontend.
- Tailwind CSS provides responsive UI styles.
