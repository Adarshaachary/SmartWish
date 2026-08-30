import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "smartwish",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test MySQL connection
db.getConnection()
  .then((connection) => {
    console.log("✅ MySQL connected successfully");
    connection.release();
  })
  .catch((error) => {
    console.error("❌ MySQL connection failed");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  });

export default db;