import cron from "node-cron";
import db from "../config/db";
import { sendWishEmail } from "./emailServices";

export function startEmailScheduler(): void {
  console.log("==========================================");
  console.log("📧 SMARTWISH EMAIL SCHEDULER");
  console.log("==========================================");
  console.log("Scheduler started successfully");
  console.log("Checking for scheduled wishes every minute");
  console.log("==========================================");

  // Run once immediately
  processScheduledWishes();

  // Then run every minute
  cron.schedule("* * * * *", async () => {
    await processScheduledWishes();
  });
}

async function processScheduledWishes(): Promise<void> {
  try {
    /*
      Let MySQL determine the current date and time.

      This avoids JavaScript/Windows timezone
      differences.
    */

    const [rows]: any = await db.execute(
      `
      SELECT
        id,
        person_name,
        email,
        occasion,
        event_date,
        event_time,
        message,
        repeat_yearly
      FROM events
      WHERE
        status = 'scheduled'
        AND
        event_date <= CURDATE()
        AND
        event_time <= CURTIME()
      ORDER BY event_date ASC, event_time ASC
      `
    );

    /*
      Show current MySQL time in terminal
    */

    const [timeRows]: any = await db.execute(
      `
      SELECT
        CURDATE() AS currentDate,
        CURTIME() AS currentTime
      `
    );

    console.log(
      `⏰ Checking wishes: ${timeRows[0].currentDate} ${timeRows[0].currentTime}`
    );

    /*
      No wishes
    */

    if (rows.length === 0) {
      return;
    }

    console.log(
      `📨 Found ${rows.length} wish(es) ready to send`
    );

    /*
      Process every wish
    */

    for (const wish of rows) {
      try {
        console.log("------------------------------------------");
        console.log(`📧 Sending wish ID: ${wish.id}`);
        console.log(`👤 Recipient: ${wish.person_name}`);
        console.log(`📩 Email: ${wish.email}`);
        console.log(`🎉 Occasion: ${wish.occasion}`);

        await sendWishEmail({
          senderName: "SmartWish",
          senderEmail: process.env.EMAIL_USER || "",
          personName: wish.person_name,
          recipientEmail: wish.email,
          occasion: wish.occasion,
          message: wish.message,
        });

        /*
          NORMAL WISH
        */

        if (!Boolean(wish.repeat_yearly)) {
          await db.execute(
            `
            UPDATE events
            SET status = 'sent'
            WHERE id = ?
            `,
            [wish.id]
          );

          console.log(
            `✅ Wish ${wish.id} marked as sent`
          );
        }

        /*
          YEARLY WISH
        */

        else {
          await db.execute(
            `
            UPDATE events
            SET event_date =
              DATE_ADD(event_date, INTERVAL 1 YEAR)
            WHERE id = ?
            `,
            [wish.id]
          );

          console.log(
            `🔁 Wish ${wish.id} scheduled for next year`
          );
        }

        console.log("------------------------------------------");

      } catch (error) {
        console.error(
          `❌ Failed to send wish ${wish.id}:`,
          error
        );
      }
    }

  } catch (error) {
    console.error(
      "❌ Scheduler database error:",
      error
    );
  }
}