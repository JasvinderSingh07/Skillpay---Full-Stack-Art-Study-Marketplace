<p align="center">
  <h1>🎨 SkillPay: Full-Stack Art & Study Marketplace</h1>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" />
 
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs" />
</p>

---

## 🌟 Overview

A sophisticated **Full-Stack ecosystem** designed for browsing, selecting, and purchasing **art and study resources**.

This project combines a modern **vanilla JavaScript frontend** with a powerful **Node.js backend** and a persistent **MongoDB database**, following a clean and scalable **MVC architecture**.

---

## 🛠️ Tech Stack

### 💻 Frontend (Client-Side)

- 🔵 HTML5, CSS3, JavaScript (ES6+)
- 🎨 Tailwind CSS (Utility-first framework)
- 📡 Fetch API for backend communication
- ✨ Lucide Icons & Google Fonts (Inter)

### ⚙️ Backend (Server-Side)

- 🟢 Node.js
- 🚀 Express.js (MVC Architecture)
- 📄 EJS (Templating engine)
- 🍃 MongoDB (Mongoose ODM)
- 🔒 Authentication using middleware

---

## 🔌 Data Flow & Connectivity

- 🔐 **Authentication:**  
  Login credentials are sent to backend → validated → stored securely in database

- 📦 **Products:**  
  Loaded from JSON files (`study-products.json`, `art-products.json`)

- 🛒 **Order System:**  
  User cart data is sent to backend and stored in MongoDB for persistence

  

---

---

## 🎯 Key Features

- ⚡ RESTful API architecture  
- 💾 Persistent MongoDB storage  
- 📂 Dynamic product loading via JSON  
- 🛒 Cart & Order management system  
- 🔐 Authentication system  
- 💎 Modern glassmorphic UI  
- 📱 Fully responsive design  
- 🔄 Real-time frontend ↔ backend data flow
---

## 📂 Project Structure


```text
SkillPay/
├── 📂 backend/
│   ├── 🎮 controllers/
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   │
│   ├── 📝 models/
│   │   ├── User.js
│   │   └── Order.js
│   │
│   ├── 🛣️ routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   │
│   ├── 🖼️ views/
│   │   ├── index.ejs
│   │   ├── login.ejs
│   │   └── order.ejs
│   │
│   ├── ⚙️ config/
│   │   └── db.js
│   │
│   ├── 🔐 middleware/
│   │   └── authMiddleware.js
│   │
│   ├── 📄 .env
│   ├── 📦 package.json
│   └── 🏁 server.js
│
├── 📂 frontend/
│   ├── 🎨 art-simple.html
│   ├── 📚 study.html
│   ├── 🔑 login.html
│   ├── 🧾 order.html
│   │
│   ├── 📁 css/
│   │   └── styles.css
│   │
│   ├── 📁 js/
│   │   ├── app.js
│   │   ├── cart.js
│   │   └── auth.js
│   │
│   ├── 📁 data/
│   │   ├── art-products.json
│   │   └── study-products.json
│   │
│   └── 📁 images/
│       └── (all images here)
│
├── 📄 README.md
└── 📄 .gitignore

