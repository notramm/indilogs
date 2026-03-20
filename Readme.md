# 📝 IndiLogs — A Full Stack Blog Platform

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)

A clean, full-stack blogging platform where users can write, publish, and explore posts across multiple categories.

---

## ✨ Features

- 🔐 **Auth** — Register, login, logout with JWT
- ✍️ **Rich Text Editor** — Write posts using Quill editor
- 🖼️ **Image Uploads** — Thumbnails and avatars via Cloudinary
- 📂 **Categories** — Filter posts by Agriculture, Business, Art, and more
- 👤 **User Profiles** — Update name, email, password and avatar
- 📋 **Dashboard** — Manage your own posts (view, edit, delete)
- 🌐 **Authors Page** — Browse all registered authors

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router v7 |
| Styling | Plain CSS with CSS variables |
| Editor | react-quill-new |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Storage | Cloudinary |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/indilogs.git
cd indilogs
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## 📁 Project Structure

```
indilogs/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Header, Footer, PostItem, etc.
│   │   ├── pages/        # Home, Login, Register, Dashboard, etc.
│   │   ├── context/      # UserContext
│   │   └── constants/    # Quill config, categories
│   └── vite.config.js
│
└── server/               # Express backend
    ├── controllers/      # userControllers, postControllers
    ├── middleware/        # auth, error handling
    ├── models/           # User, Post, HttpError
    ├── routes/           # userRoutes, postRoutes
    ├── config/           # Cloudinary setup
    └── index.js
```

---

## 🌐 Deployment

Both frontend and backend are deployed on **Vercel**.

- Frontend uses `vercel.json` with Vite rewrites for SPA routing
- Backend uses `@vercel/node` to serve Express as a serverless function
- Images are stored on **Cloudinary** (no local filesystem dependency)

---

## 👨‍💻 Author

**Ram Muduli** — [@notramm](https://github.com/notramm)