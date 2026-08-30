import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { startEmailScheduler } from "./services/emailScheduler";
import { verifyEmailService } from "./services/emailServices";

/* =========================================
   PORT
========================================= */

const PORT = Number(process.env.PORT) || 5000;

/* =========================================
   START SERVER
========================================= */

app.listen(PORT, async () => {
  console.log("==========================================");
  console.log("       SMARTWISH BACKEND SERVER");
  console.log("==========================================");

  console.log(
    `Server running on: http://localhost:${PORT}`
  );

  console.log(
    `API base URL: http://localhost:${PORT}/api`
  );

  console.log(
    `Auth API: http://localhost:${PORT}/api/auth`
  );

  console.log("==========================================");

  /* =======================================
     VERIFY GMAIL
  ======================================= */

  await verifyEmailService();

  /* =======================================
     START SCHEDULER
  ======================================= */

  startEmailScheduler();
});