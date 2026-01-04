# 🔗 URL Shortener – Full Stack Application

A modern **full-stack URL Shortener** built with **React, Node.js, Express, and MongoDB Atlas**, featuring **custom expiry**, **real-time analytics**, **QR code generation**, and **manual link expiration**.

Designed with **scalability**, **clean architecture**, and **production-ready practices** in mind.

---

## ✨ Features

- 🔗 Shorten long URLs instantly  
- ⏳ Custom expiry time (5 min, 30 min, 1 hour, 1 day)  
- 🧮 Real-time analytics  
  - Click count  
  - Creation time  
  - Expiry time  
- ❌ Manual expiration (invalidate links anytime)  
- 📱 QR code generation + download  
- 🟢 Live status indicator (Active / Expired)  
- 🎨 Modern responsive UI (desktop & mobile)  
- 🔐 Secure environment variable handling  

---

## 🧱 Tech Stack

### Frontend
- React (Vite)  
- JavaScript (ES6+)  
- qrcode.react  
- Responsive inline styling  

### Backend
- Node.js  
- Express.js  
- MongoDB Atlas  
- Mongoose  
- nanoid (short code generation)  

---

## 📁 Project Structure

```
url-shortener/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── src/
│   │   ├── controllers/
│   │   │   └── urlController.js
│   │   ├── models/
│   │   │   └── Url.js
│   │   ├── routes/
│   │   │   └── urlRoutes.js
│   │   └── server.js
│   ├── .env            # ignored
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── App.jsx
│   ├── .env            # ignored
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 Environment Variables

### Backend (backend/.env)
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
BASE_URL=http://localhost:5000
```

### Frontend (frontend/.env)
```
VITE_API_BASE_URL=http://localhost:5000
```

⚠️ .env files are intentionally ignored to protect secrets.

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```
git clone https://github.com/algorithmist-yash/url-shortener.git
cd url-shortener
```

### 2️⃣ Backend Setup
```
cd backend
npm install
npm run dev
```

Backend will start at:
http://localhost:5000

### 3️⃣ Frontend Setup
```
cd ../frontend
npm install
npm run dev
```

Frontend will run at:
http://localhost:5173

---

## 🔌 API Endpoints

### ➕ Create Short URL
POST /shorten

**Body**
```json
{
  "originalUrl": "https://example.com",
  "expiresInMinutes": 30
}
```

### 🔁 Redirect
GET /:shortCode

### 📊 Analytics
GET /analytics/:shortCode

### ❌ Manual Expire
PATCH /expire/:shortCode

---

## 📸 Screenshots

(Add screenshots here later for extra polish)

---

## 🧠 Key Learnings

- REST API design  
- MongoDB TTL & expiry handling  
- Secure environment configuration  
- Full-stack integration  
- Error handling & edge cases  
- Clean UI/UX for real-world apps  

---

## 🛡️ Security Notes

- No secrets committed to GitHub  
- MongoDB Atlas credentials protected  
- .env files ignored properly  

---

## 📈 Future Improvements

- User authentication  
- Custom aliases  
- Dashboard with charts  
- Rate limiting  
- Link previews  
- Dark/light mode toggle  

---

## 👤 Author

**Yash Raj**  
📧 Email: [yash.algorithmist@gmail.com](mailto:yash.algorithmist@gmail.com)  
🐙 GitHub: [https://github.com/algorithmist-yash](https://github.com/algorithmist-yash)  
💼 LinkedIn: [https://www.linkedin.com/in/yash-raj-476290369/](https://www.linkedin.com/in/yash-raj-476290369/)


---

## ⭐ If you like this project

Give it a ⭐ on GitHub — it really helps!
