import { Router } from "express";

import {
  createEvent,
  getEvents,
  deleteEvent,
} from "../controllers/eventController";

import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

/* =========================================
   CREATE EVENT

   POST /api/events
========================================= */

router.post(
  "/",
  authenticateToken,
  createEvent
);

/* =========================================
   GET EVENTS

   GET /api/events
========================================= */

router.get(
  "/",
  authenticateToken,
  getEvents
);

/* =========================================
   DELETE EVENT

   DELETE /api/events/:id
========================================= */

router.delete(
  "/:id",
  authenticateToken,
  deleteEvent
);

export default router;