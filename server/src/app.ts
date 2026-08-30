import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import wishRoutes from "./routes/wishRoutes";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartWish API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/wishes", wishRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("SERVER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error?.message || "Unknown error",
    });
  }
);

export default app;