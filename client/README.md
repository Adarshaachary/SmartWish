# ✨ SmartWish

> A full-stack automatic wish scheduling application that allows users to create, schedule, and automatically send personalized wishes for birthdays, anniversaries, and other special occasions.

---

## 📸 Application Preview

### 🔐 Login Page

<p align="center">
  <img src="./screenshots/login.png" alt="SmartWish Login Page" width="900"/>
</p>

---

### 📝 Register Page

<p align="center">
  <img src="./screenshots/register.png" alt="SmartWish Register Page" width="900"/>
</p>

---

### 🏠 Dashboard

<p align="center">
  <img src="./screenshots/dashboard.png" alt="SmartWish Dashboard" width="900"/>
</p>

---

### ✨ Create a Wish

<p align="center">
  <img src="./screenshots/add-wish.png" alt="SmartWish Add Wish Page" width="900"/>
</p>

---

### 📱 Mobile Responsive Design

<p align="center">
  <img src="./screenshots/mobile.png" alt="SmartWish Mobile Responsive Design" width="400"/>
</p>

---

## 📌 About the Project

**SmartWish** is a full-stack web application designed to make sending special wishes easier.

Instead of remembering someone's birthday or anniversary and manually sending a message, users can schedule a personalized wish in advance.

Users can:

- Create an account
- Login securely
- Create personalized wishes
- Select a recipient
- Select an occasion
- Choose a date
- Choose a specific time
- Schedule wishes for future delivery
- Repeat wishes every year
- Preview the wish before scheduling
- Automatically send scheduled wishes through email

---

# 🚀 Features

## 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Authentication middleware
- Secure token handling

## 🎉 Wish Scheduling

Users can schedule a wish using:

- Recipient name
- Recipient email
- Occasion
- Event date
- Send time
- Personalized message

Supported occasions:

- 🎂 Birthday
- ❤️ Anniversary
- 🎉 Other

## 📅 Custom Calendar

The application includes a custom calendar with:

- Previous/next month navigation
- Current date highlighting
- Selected date highlighting
- Today button
- Modern calendar interface

## ⏰ Custom Time Picker

The application provides a custom 12-hour time picker with:

- Hour selection
- Minute selection
- AM/PM selection
- Quick time selection
- Time preview

## 🔁 Yearly Repeat

Users can enable:

**Repeat every year**

This allows the wish to be automatically scheduled every year on the selected date.

## 💌 Live Message Preview

Users can preview their wish before scheduling.

The preview dynamically displays:

- Recipient name
- Occasion
- Message
- Event date
- Send time
- Yearly repeat status

## 📧 Automatic Email Delivery

Scheduled wishes are processed by the backend scheduler and sent automatically through email.

Technologies used:

- Nodemailer
- Gmail SMTP
- Node Cron

## 📱 Responsive Design

SmartWish is designed to work on:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile
- 📲 Tablet

---

# 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- React Icons
- CSS

### Backend

- Node.js
- Express.js
- TypeScript
- JWT
- Nodemailer
- Node Cron

### Database

- MySQL

### Tools

- VS Code
- Git
- GitHub
- npm

---

# 🏗️ Project Structure

```text
SmartWish/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Login.css
│   │   │   ├── Register.tsx
│   │   │   ├── AddWish.tsx
│   │   │   └── ...
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── package.json
│   └── ...
│
├── screenshots/
│   ├── login.png
│   ├── register.png
│   ├── dashboard.png
│   ├── add-wish.png
│   └── mobile.png
│
├── .gitignore
└── README.md