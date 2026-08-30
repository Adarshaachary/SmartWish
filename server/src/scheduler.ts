import db from "./config/db";
import { sendWishEmail } from "./services/emailService";


/* ================================= */
/* Process Scheduled Wishes */
/* ================================= */

async function processScheduledWishes() {

  try {

    const [rows]: any = await db.execute(`

      SELECT *

      FROM wishes

      WHERE status = 'scheduled'

      AND scheduled_at <= NOW()

      ORDER BY scheduled_at ASC

    `);


    if (rows.length === 0) {

      return;

    }


    console.log(
      `📋 Found ${rows.length} scheduled wish(es)`
    );


    for (const wish of rows) {

      try {

        console.log(
          `📨 Sending wish #${wish.id} to ${wish.recipient_email}`
        );


        /* ============================= */
        /* Send Email */
        /* ============================= */

        await sendWishEmail({

          senderName:
            wish.sender_name,

          senderEmail:
            wish.sender_email,

          personName:
            wish.person_name,

          recipientEmail:
            wish.recipient_email,

          occasion:
            wish.occasion,

          message:
            wish.message,

        });


        /* ============================= */
        /* Mark as Sent */
        /* ============================= */

        await db.execute(

          `

          UPDATE wishes

          SET
            status = 'sent',
            sent_at = NOW(),
            error_message = NULL

          WHERE id = ?

          `,

          [wish.id]

        );


        console.log(
          `✅ Wish #${wish.id} sent successfully`
        );


      } catch (error: any) {

        console.error(
          `❌ Failed to send wish #${wish.id}:`,
          error
        );


        /* ============================= */
        /* Mark as Failed */
        /* ============================= */

        await db.execute(

          `

          UPDATE wishes

          SET
            status = 'failed',
            error_message = ?

          WHERE id = ?

          `,

          [
            error?.message ||
              "Unknown email error",

            wish.id,

          ]

        );

      }

    }


  } catch (error) {

    console.error(
      "❌ Scheduler error:",
      error
    );

  }

}


/* ================================= */
/* Start Scheduler */
/* ================================= */

export function startWishScheduler() {

  console.log(
    "⏰ SmartWish scheduler started"
  );


  /* Check immediately */

  processScheduledWishes();


  /* Check every 30 seconds */

  setInterval(() => {

    processScheduledWishes();

  }, 30 * 1000);

}