# ✨ SmartWish

SmartWish is a full-stack automatic wish scheduling web application that helps users schedule personalized wishes for important occasions such as birthdays, anniversaries, and other special moments.

Instead of remembering every important date manually, users can create a wish, select the date and time, and let SmartWish automatically send the message through email.

---

## 📸 Screenshots

### 🔐 Login

![SmartWish Login](./screenshots/login.png)

### 📝 Register

![SmartWish Register](./screenshots/register.png)

### 📊 Dashboard

![SmartWish Dashboard](./screenshots/dashboard.png)

### 🎁 Add Wish

![SmartWish Add Wish](./screenshots/add-wish.png)

### 📅 Custom Calendar

![SmartWish Calendar](./screenshots/calendar.png)

### ⏰ Custom Time Picker

![SmartWish Time Picker](./screenshots/time-picker.png)

### 📧 Email History

![SmartWish Email History](./screenshots/email-history.png)

---

## 🚀 Features

### 🔐 User Authentication
- User registration and login
- JWT-based authentication
- Protected application sections
- Secure authentication token handling
- Persistent login session

### 🎁 Wish Scheduling
- Add wishes for different occasions
- Enter recipient name and email
- Select an occasion
- Write a personalized message
- Schedule wishes for a specific date and time

### 🎂 Occasion Support
SmartWish currently supports:

- Birthday
- Anniversary
- Other

### 📅 Custom Calendar
- Modern custom calendar interface
- Previous month navigation
- Next month navigation
- Today button
- Current date highlighting
- Selected date highlighting
- Date preview

### ⏰ Custom Time Picker
- 12-hour time format
- AM/PM selection
- Hour controls
- Minute controls
- Quick time selection
- Time preview
- Done button

The calendar and time picker are designed so that only one picker is open at a time.

### 🔁 Yearly Repeat
- Repeat wishes every year
- Useful for birthdays and anniversaries
- Automatically keeps the same date for future years

### 💌 Personalized Messages
- Create custom wish messages
- Character counter
- Maximum message length
- Personalized recipient information

### 👀 Live Preview
Users can preview their scheduled wish before submitting it.

The preview includes:

- Recipient name
- Occasion
- Occasion icon
- Message
- Date
- Time
- Yearly repeat status

### 📧 Automatic Email Sending
SmartWish uses the backend email service to automatically send scheduled wishes to recipients.

### 📜 Email History
Users can view previously processed wishes and email-related information from the application.

---

## 🛠️ Tech Stack

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
- Nodemailer
- node-cron

### Database

- MySQL

---

## 🏗️ Project Architecture

SmartWish is divided into three main parts:

```text
SmartWish
│
├── Frontend
│   └── React + TypeScript + Vite
│
├── Backend
│   └── Node.js + Express + TypeScript
│
└── Database
    └── MySQL