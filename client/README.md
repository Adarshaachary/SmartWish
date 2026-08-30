# SmartWish 🎉

SmartWish is a full-stack web application that helps users schedule personalized wishes for birthdays, anniversaries, and other special occasions. Users can choose a recipient, set a date and time, write a custom message, and schedule the wish to be delivered automatically.

---

## ✨ Features

- 🔐 User registration and login
- 🎂 Birthday wish scheduling
- 💕 Anniversary wish scheduling
- 🎉 Custom occasion scheduling
- 📅 Custom event date selection
- ⏰ Custom wish sending time
- 💌 Personalized wish messages
- 🔁 Yearly recurring wishes
- 📧 Automated email delivery
- 📋 Email history
- 📱 Responsive user interface
- ⚡ Modern and interactive dashboard

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- React Router
- React Icons
- Axios

### Backend

- Node.js
- Express.js
- TypeScript
- MySQL
- Nodemailer
- Node-Cron

### Development Tools

- Git
- GitHub
- VS Code

---

## 🏗️ Project Structure

```text
SmartWish/
│
├── client/
│   ├── public/
│   ├── screenshots/
│   │   ├── Login.png
│   │   ├── Dashboard.png
│   │   ├── Addwish.png
│   │   ├── Upcoming.png
│   │   └── email.png
│   │
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── EmailHistory/
│       ├── types/
│       ├── utils/
│       ├── App.tsx
│       └── main.tsx
│
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── app.ts
│       ├── scheduler.ts
│       └── server.ts
│
└── README.md