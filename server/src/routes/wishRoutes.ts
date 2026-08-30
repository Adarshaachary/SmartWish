import express from "express";
import db from "../config/db";

const router = express.Router();

/* =========================================
   CREATE WISH
========================================= */

router.post("/wishes", async (req, res) => {
  try {
    console.log("📩 Wish received:");
    console.log(req.body);

    const {
      senderName,
      senderEmail,
      personName,
      recipientEmail,
      occasion,
      message,
      eventDate,
      eventTime,
      scheduledAt,
    } = req.body;

    /* =========================================
       VALIDATION
    ========================================= */

    if (
      !senderName ||
      !senderEmail ||
      !personName ||
      !recipientEmail ||
      !occasion ||
      !message ||
      !eventDate ||
      !eventTime ||
      !scheduledAt
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    /* =========================================
       EMAIL VALIDATION
    ========================================= */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(senderEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sender email.",
      });
    }

    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient email.",
      });
    }

    /* =========================================
       DATE/TIME VALIDATION
    ========================================= */

    const scheduledDate = new Date(scheduledAt);

    if (Number.isNaN(scheduledDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduled date or time.",
      });
    }

    /* =========================================
       FUTURE TIME CHECK
    ========================================= */

    const now = new Date();

    if (scheduledDate <= now) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a future date and time.",
      });
    }

    /* =========================================
       INSERT INTO MYSQL
    ========================================= */

    const sql = `
      INSERT INTO wishes
      (
        sender_name,
        sender_email,
        person_name,
        recipient_email,
        occasion,
        message,
        event_date,
        event_time,
        scheduled_at,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')
    `;

    const values = [
      senderName,
      senderEmail,
      personName,
      recipientEmail,
      occasion,
      message,
      eventDate,
      eventTime,
      scheduledAt,
    ];

    console.log("💾 Saving wish to MySQL...");

    const [result]: any = await db.execute(
      sql,
      values
    );

    console.log(
      `✅ Wish saved successfully. ID: ${result.insertId}`
    );

    /* =========================================
       SUCCESS RESPONSE
    ========================================= */

    return res.status(201).json({
      success: true,
      message: "Wish scheduled successfully.",
      wishId: result.insertId,
    });

  } catch (error: any) {

    console.error("❌ DATABASE ERROR");
    console.error(error);

    /* =========================================
       DEVELOPMENT ERROR
    ========================================= */

    return res.status(500).json({
      success: false,

      message:
        error?.sqlMessage ||
        error?.message ||
        "Failed to schedule wish.",

    });
  }
});


/* =========================================
   GET ALL WISHES
========================================= */

router.get("/wishes", async (_req, res) => {
  try {

    const [rows] = await db.execute(`
      SELECT *
      FROM wishes
      ORDER BY scheduled_at ASC
    `);

    return res.json({
      success: true,
      wishes: rows,
    });

  } catch (error: any) {

    console.error(
      "❌ Failed to fetch wishes:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error?.sqlMessage ||
        error?.message ||
        "Failed to fetch wishes.",
    });
  }
});


export default router;