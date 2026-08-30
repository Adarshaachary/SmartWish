import { Response } from "express";
import db from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

/* =========================================
   CREATE EVENT
   POST /api/events
========================================= */

export const createEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      senderName,
      personName,
      email,
      occasion,
      eventDate,
      eventTime,
      message,
      repeatYearly,
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (
      !senderName ||
      !personName ||
      !email ||
      !occasion ||
      !eventDate ||
      !eventTime ||
      !message
    ) {
      res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
      return;
    }

    /* =========================================
       CLEAN SENDER DATA
       
       Keep the sender name exactly as entered
       by the logged-in user.
    ========================================= */

    const cleanSenderName =
      String(senderName).trim();

    const cleanPersonName =
      String(personName).trim();

    const cleanRecipientEmail =
      String(email).trim().toLowerCase();

    const cleanMessage =
      String(message).trim();

    /* =========================================
       INSERT INTO MYSQL
    ========================================= */

    const [result]: any = await db.execute(
      `
      INSERT INTO events
      (
        user_id,
        sender_name,
        person_name,
        email,
        occasion,
        event_date,
        event_time,
        message,
        repeat_yearly,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        cleanSenderName,
        cleanPersonName,
        cleanRecipientEmail,
        occasion,
        eventDate,
        eventTime,
        cleanMessage,
        repeatYearly ? 1 : 0,
        "scheduled",
      ]
    );

    console.log("==========================================");
    console.log("✅ EVENT CREATED");
    console.log("Event ID:", result.insertId);
    console.log("Sender Name:", cleanSenderName);
    console.log("Recipient:", cleanRecipientEmail);
    console.log("==========================================");

    res.status(201).json({
      success: true,
      message: "Wish scheduled successfully",
      event: {
        id: result.insertId,
        userId,
        senderName: cleanSenderName,
        personName: cleanPersonName,
        email: cleanRecipientEmail,
        occasion,
        eventDate,
        eventTime,
        message: cleanMessage,
        repeatYearly: Boolean(repeatYearly),
        status: "scheduled",
      },
    });
  } catch (error: any) {
    console.error("==========================================");
    console.error("CREATE EVENT ERROR");
    console.error("==========================================");
    console.error(error);
    console.error("==========================================");

    res.status(500).json({
      success: false,
      message: "Failed to schedule wish",
      error: error?.message || "Unknown error",
    });
  }
};

/* =========================================
   GET EVENTS
   GET /api/events
========================================= */

export const getEvents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const [rows] = await db.execute(
      `
      SELECT
        id,
        user_id AS userId,
        sender_name AS senderName,
        person_name AS personName,
        email,
        occasion,
        event_date AS eventDate,
        event_time AS eventTime,
        message,
        repeat_yearly AS repeatYearly,
        status,
        created_at AS createdAt
      FROM events
      WHERE user_id = ?
      ORDER BY event_date ASC, event_time ASC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      events: rows,
    });
  } catch (error: any) {
    console.error("==========================================");
    console.error("GET EVENTS ERROR");
    console.error("==========================================");
    console.error(error);
    console.error("==========================================");

    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error?.message || "Unknown error",
    });
  }
};

/* =========================================
   DELETE EVENT
   DELETE /api/events/:id
========================================= */

export const deleteEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
      return;
    }

    const [result]: any = await db.execute(
      `
      DELETE FROM events
      WHERE id = ?
      AND user_id = ?
      `,
      [id, userId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Wish deleted successfully",
    });
  } catch (error: any) {
    console.error("==========================================");
    console.error("DELETE EVENT ERROR");
    console.error("==========================================");
    console.error(error);
    console.error("==========================================");

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error?.message || "Unknown error",
    });
  }
};