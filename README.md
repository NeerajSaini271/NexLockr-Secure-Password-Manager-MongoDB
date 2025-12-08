````markdown
# <PassOP/> - Password Manager (MERN Stack)

**PassOP** is a secure and responsive Password Manager application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to store, view, edit, and delete their passwords locally using a MongoDB database.

## 🚀 Features
- **Add Passwords:** Save website URLs, usernames, and passwords securely.
- **View & Toggle:** View saved passwords with a "Show/Hide" eye toggle.
- **Copy to Clipboard:** One-click copy feature for websites, usernames, and passwords.
- **Edit & Delete:** Update credentials or remove them from the database.
- **Responsive UI:** Built with **Tailwind CSS** for a modern, mobile-friendly design.
- **Backend API:** Custom Node.js/Express server connecting to MongoDB.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Toastify, Lottie/LordIcon
- **Backend:** Node.js, Express.js, Body-Parser, CORS
- **Database:** MongoDB (Local instance)

---

## ⚙️ Installation & Setup

This project is divided into two parts: the **Frontend** (root folder) and the **Backend** (`/backend` folder). You need to run both terminals simultaneously.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) installed and running locally on `mongodb://localhost:27017`.

### 2. Setup Backend (Server)
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
````

Create a `.env` file in the `backend` folder and add your database connection string:

```env
MONGO_URI=mongodb://localhost:27017
```

Start the server:

```bash
node server.js
```

*The server will run on `http://localhost:3000`*

### 3\. Setup Frontend (Client)

Open a **new** terminal (split terminal) in the project root:

```bash
npm install
npm run dev
```

*The application will run on `http://localhost:5173`*

-----

## 📂 Project Structure

```
PassOP-Mongo/
├── backend/            # Express Server & MongoDB Logic
│   ├── server.js       # API Routes (GET, POST, DELETE)
│   └── package.json    # Backend dependencies
├── src/                # React Frontend
│   ├── components/     # Navbar, Manager, Footer
│   ├── App.jsx         # Main Component
│   └── main.jsx        # Entry point
└── index.html          # HTML Root
```

## 🤝 Contributing

Feel free to fork this repository and submit pull requests to improve the UI or add features (like authentication\!).

-----

*Created by [Neeraj Saini](https://github.com/NeerajSaini271)*
