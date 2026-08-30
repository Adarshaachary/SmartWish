# SmartWish

SmartWish is a full-stack web application that helps users schedule personalized wishes for birthdays, anniversaries, and other special occasions. Users can create a wish, choose the recipient, select the date and time, write a personalized message, and optionally repeat the wish every year.

## Live Demo

https://adarshaachary.github.io/SmartWish/

> Note: The frontend is currently hosted on GitHub Pages, while the backend runs locally during development. Therefore, features that require the backend, such as login, registration, wish scheduling, and automated email delivery, require the backend server to be running locally.

## GitHub Repository

https://github.com/Adarshaachary/SmartWish

---

## Features

- User registration and login
- Secure authentication using JWT
- Personalized wish creation
- Birthday, Anniversary, and Other occasion options
- Recipient name and email management
- Custom date picker
- Custom 12-hour AM/PM time picker
- Quick time selection
- Schedule preview
- Live wish message preview
- Character count for messages
- Yearly repeat option
- Upcoming events management
- Email history
- Automated email delivery
- Scheduled email processing using Node-Cron
- Email delivery using Nodemailer and Gmail
- Protected API routes
- Responsive frontend interface
- Modern dashboard interface

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- React Icons
- CSS

### Backend

- Node.js
- Express
- TypeScript
- JWT
- bcryptjs
- Node-Cron
- Nodemailer

### Database

- MySQL
- mysql2

### Development & Deployment

- Git
- GitHub
- GitHub Pages
- npm

---

## Project Structure

```text
SmartWish/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   ├── StatsCards/
│   │   │   ├── UpcomingEvents/
│   │   │   └── Welcome/
│   │   │
│   │   ├── EmailHistory/
│   │   ├── pages/
│   │   │   ├── AddWish.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── UpcomingEvents.tsx
│   │   │   └── UpdateAccount.tsx
│   │   │
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.ts
│   │   ├── scheduler.ts
│   │   └── server.ts
│   │
│   └── package.json
│
└── README.md