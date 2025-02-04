<h1 align="center">✨ User Management System (UMS) ✨</h1>
<h2>🚀 Introduction</h2>
<p>UMS (User Management System) is a <b>MERN</b>-based starter template designed for full-stack projects requiring a robust user and role management system. It provides authentication, dynamic role-based permissions, and a structured way to manage users. The project utilizes <b>ShadCN</b> and <b>Tailwind CSS</b> for the UI, with <b>TypeScript</b> on both frontend and backend.</p>

## ✨ Features
- **User Table**: Displays all registered users.
- **Admin Controls**:
  - Lock/unlock users.
  - Create, update, and delete users.
  - Create, update, and delete roles dynamically.
  - Assign permissions to roles.
- **Role Management**:
  - Users can have multiple roles.
  - Roles follow precedence: lower-ranked users can't edit higher-ranked users.
  - Permissions are assigned dynamically.
- **Authentication**:
  - Secure authentication system.
  - JWT-based authentication.
- **Full CRUD Support**:
  - CRUD operations for users and roles.

## 🛠️ Tech Stack
### Frontend
- **React** (Vite)
- **TypeScript**
- **ShadCN** (UI Components)
- **Tailwind CSS**
- **Zustand** (State Management)
- **Tanstack Query** (Data Fetching, Caching, Synchronization)
- **Zod** (Validation Library)

### Backend
- **Node.js** (Express)
- **TypeScript**
- **MongoDB** (Mongoose ORM)
- **JWT Authentication**
- **Bcrypt** (Hashing Library)

## 📂 Project Structure
```
UMS/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── index.ts
│   │   └── seed.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── scss/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vercel.json
│   └── vite.config.ts
├── LICENSE
├── package.json
└── README.md
```

## 🏗️ Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/s-adi-dev/ums.git
cd ums
```

### 2️⃣ Server Setup
```sh
cd server
npm install
cp .env.example .env  # Configure your environment variables
npm run seed # For creating a super admin
npm run dev
```

### 3️⃣ Client Setup
```sh
cd ../client
npm install
cp .env.example .env
npm run dev
```

## 🔑 Environment Variables
Create a `.env` file in the `server` directory with the following:
```
PORT=3000
JWT_SECRET="your_secret"
NODE_ENV="development" # production || development
MONGO=your_mongodb_uri
SUPER_ADMIN_USERNAME="your_username"
FRONTEND_URL="http://localhost:5173" #url where frontend will run
```

Create a `.env` file in the `client` directory with the following:
```
VITE_BACK_END_PORT="http://localhost:3000" #url where backend will run
```

## 🤝 Contributing
Feel free to contribute by submitting issues or pull requests.

## 📜 License
This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

## 📧 Contact
For any queries, reach out via [github](https://github.com/s-adi-dev).
