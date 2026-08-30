# SmartWish 🎉

SmartWish is a full-stack web application that helps users schedule personalized wishes for birthdays, anniversaries, and other special occasions. Users can choose a recipient, set a date and time, write a custom message, and schedule the wish to be delivered automatically.

## 🚀 Live Demo

**[View SmartWish Live Demo](https://adarshaachary.github.io/SmartWish/)**

> **Note:** The live demo currently hosts the frontend on GitHub Pages. Backend-dependent features such as authentication, database operations, and automated email scheduling require the backend server to be running.

## 📂 GitHub Repository

**[View Source Code](https://github.com/Adarshaachary/SmartWish)**

---

## ✨ Features

* 🔐 User registration and login
* 🎂 Birthday wish scheduling
* 💕 Anniversary wish scheduling
* 🎉 Custom occasion scheduling
* 📅 Custom event date selection
* ⏰ Custom wish sending time
* 💌 Personalized wish messages
* 🔁 Yearly recurring wishes
* 📧 Automated email delivery
* 📋 Email history
* 📱 Responsive user interface
* ⚡ Modern and interactive dashboard

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS
* React Router
* React Icons
* Axios

### Backend

* Node.js
* Express.js
* TypeScript
* MySQL
* Nodemailer
* Node-Cron

### Development Tools

* Git
* GitHub
* VS Code

---

## 🏗️ Project Structure

```text
SmartWish/
│
├── client/
│   ├── public/
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
```

---

## 🔄 How SmartWish Works

1. Create an account or log in.
2. Enter the recipient's name and email address.
3. Select the occasion.
4. Choose the event date.
5. Select the preferred sending time.
6. Write a personalized message.
7. Enable yearly repetition if required.
8. Schedule the wish.
9. The backend scheduler checks for scheduled wishes.
10. Nodemailer sends the email at the scheduled time.

---

## 💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Adarshaachary/SmartWish.git
```

Navigate into the project:

```bash
cd SmartWish
```

---

### 2. Setup the Frontend

```bash
cd client
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

### 3. Setup the Backend

Open a new terminal and navigate to the server:

```bash
cd server
npm install
```

Start the backend server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=smartwish

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Important:** Never upload `.env` files containing passwords, API keys, email credentials, or other secrets to GitHub.

---

## 📧 Email Scheduling

SmartWish uses:

* **Node-Cron** for checking scheduled wishes.
* **Nodemailer** for sending emails.
* **MySQL** for storing scheduled events.

The scheduler periodically checks the database for wishes that are ready to be sent and sends them automatically.

---

## 📸 Screenshots

### Login

Add your Login page screenshot here.

### Dashboard

Add your Dashboard screenshot here.

### Create Wish

Add your Add Wish page screenshot here.

### Email History

Add your Email History screenshot here.

---

## 🌱 Future Improvements

* Deploy the backend to a cloud platform
* Connect the live frontend with the deployed backend
* Add password reset functionality
* Add customizable email templates
* Add email delivery status tracking
* Add reminder notifications
* Add more recurring scheduling options
* Improve email deliverability

---

## 👨‍💻 Author

**Adarsha Achary**

[GitHub](https://github.com/Adarshaachary)

---

## 📄 License

This project was developed for learning and portfolio purposes.
