
import nodemailer from "nodemailer";

/* =========================================
   GMAIL TRANSPORTER
========================================= */

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: true,
  },
});

/* =========================================
   VERIFY EMAIL SERVICE
========================================= */

export async function verifyEmailService(): Promise<void> {
  try {
    await transporter.verify();

    console.log("==========================================");
    console.log("✅ Gmail email service connected successfully");
    console.log("==========================================");
  } catch (error) {
    console.error("==========================================");
    console.error("❌ Gmail email service connection failed");
    console.error(error);
    console.error("==========================================");
  }
}

/* =========================================
   EMAIL DATA
========================================= */

interface WishEmailData {
  senderName: string;
  senderEmail: string;
  personName: string;
  recipientEmail: string;
  occasion: string;
  message: string;
}

/* =========================================
   ESCAPE HTML
   Protects user-entered text inside email HTML
========================================= */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================
   SEND WISH EMAIL
========================================= */

export async function sendWishEmail(
  data: WishEmailData
): Promise<{
  success: boolean;
  messageId?: string;
}> {
  try {
    const {
      senderName,
      senderEmail,
      personName,
      recipientEmail,
      occasion,
      message,
    } = data;

    /* =====================================
       CLEAN DATA
    ===================================== */

    const cleanSenderName =
      senderName?.trim() || "Someone";

    const cleanSenderEmail =
      senderEmail?.trim() || "";

    const cleanPersonName =
      personName?.trim() || "there";

    const cleanRecipientEmail =
      recipientEmail?.trim();

    const cleanMessage =
      message?.trim() || "";

    const cleanOccasion =
      occasion?.trim() || "Special";

    /* =====================================
       VALIDATION
    ===================================== */

    if (!cleanRecipientEmail) {
      throw new Error("Recipient email is required.");
    }

    if (!process.env.EMAIL_USER) {
      throw new Error("EMAIL_USER is not configured.");
    }

    if (!process.env.EMAIL_PASS) {
      throw new Error("EMAIL_PASS is not configured.");
    }

    /* =====================================
       OCCASION
    ===================================== */

    const normalizedOccasion =
      cleanOccasion.toLowerCase();

    let occasionTitle: string;
    let occasionMessage: string;

    if (normalizedOccasion === "birthday") {
      occasionTitle = "Birthday Wish";

      occasionMessage =
        `${cleanSenderName} has sent you a special birthday wish.`;
    } else if (
      normalizedOccasion === "anniversary"
    ) {
      occasionTitle = "Anniversary Wish";

      occasionMessage =
        `${cleanSenderName} has sent you a special anniversary wish.`;
    } else {
      occasionTitle = "Special Wish";

      occasionMessage =
        `${cleanSenderName} has sent you a special wish.`;
    }

    /* =====================================
       SAFE VALUES FOR HTML
    ===================================== */

    const htmlSenderName =
      escapeHtml(cleanSenderName);

    const htmlPersonName =
      escapeHtml(cleanPersonName);

    const htmlSenderEmail =
      escapeHtml(cleanSenderEmail);

    const htmlMessage =
      escapeHtml(cleanMessage)
        .replace(/\n/g, "<br />");

    const htmlOccasionTitle =
      escapeHtml(occasionTitle);

    const htmlOccasionMessage =
      escapeHtml(occasionMessage);

    /* =====================================
       SUBJECT
    ===================================== */

    const subject =
      `${occasionTitle} from ${cleanSenderName}`;

    /* =====================================
       PLAIN TEXT VERSION

       This is important because the email
       should have both text + HTML content.
    ===================================== */

    const text = `
Hello ${cleanPersonName},

${occasionMessage}

Message from ${cleanSenderName}:

${cleanMessage}

You can reply to this email to get back in touch with ${cleanSenderName}.

Sent using SmartWish.
`.trim();

    /* =====================================
       HTML EMAIL
    ===================================== */

    const html = `
<!DOCTYPE html>

<html>

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${htmlOccasionTitle}</title>

</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f5f3ff;
    font-family:Arial,Helvetica,sans-serif;
  "
>

  <div
    style="
      max-width:600px;
      margin:30px auto;
      background:#ffffff;
      border-radius:18px;
      overflow:hidden;
      border:1px solid #e8e4f5;
    "
  >

    <!-- HEADER -->

    <div
      style="
        padding:30px 28px;
        background:#7c3aed;
        color:#ffffff;
      "
    >

      <p
        style="
          margin:0 0 8px;
          font-size:13px;
          opacity:0.9;
        "
      >
        SmartWish
      </p>

      <h1
        style="
          margin:0;
          font-size:26px;
          font-weight:700;
        "
      >
        ${htmlOccasionTitle}
      </h1>

      <p
        style="
          margin:10px 0 0;
          font-size:15px;
          line-height:1.5;
          opacity:0.92;
        "
      >
        A personal message from
        <strong>${htmlSenderName}</strong>
      </p>

    </div>


    <!-- CONTENT -->

    <div
      style="
        padding:32px 28px;
      "
    >

      <p
        style="
          margin:0 0 18px;
          color:#333333;
          font-size:16px;
          line-height:1.6;
        "
      >
        Hello
        <strong>${htmlPersonName}</strong>,
      </p>


      <p
        style="
          margin:0 0 22px;
          color:#555555;
          font-size:16px;
          line-height:1.7;
        "
      >
        ${htmlOccasionMessage}
      </p>


      <!-- SENDER -->

      <div
        style="
          margin:22px 0;
          padding:18px 20px;
          background:#f7f5ff;
          border:1px solid #e8e1ff;
          border-radius:12px;
        "
      >

        <p
          style="
            margin:0 0 7px;
            color:#7c3aed;
            font-size:11px;
            font-weight:700;
            letter-spacing:1px;
          "
        >
          FROM
        </p>

        <p
          style="
            margin:0;
            color:#222222;
            font-size:20px;
            font-weight:700;
          "
        >
          ${htmlSenderName}
        </p>

        ${
          cleanSenderEmail
            ? `
        <p
          style="
            margin:6px 0 0;
            color:#777777;
            font-size:13px;
          "
        >
          ${htmlSenderEmail}
        </p>
        `
            : ""
        }

      </div>


      <!-- MESSAGE -->

      <div
        style="
          margin:22px 0;
          padding:20px;
          background:#faf9ff;
          border-left:4px solid #7c3aed;
          border-radius:10px;
        "
      >

        <p
          style="
            margin:0 0 10px;
            color:#7c3aed;
            font-size:12px;
            font-weight:700;
            letter-spacing:0.8px;
            text-transform:uppercase;
          "
        >
          ${htmlOccasionTitle}
        </p>

        <p
          style="
            margin:0;
            color:#333333;
            font-size:16px;
            line-height:1.8;
          "
        >
          ${htmlMessage}
        </p>

      </div>


      <p
        style="
          margin:24px 0 0;
          color:#777777;
          font-size:13px;
          line-height:1.6;
        "
      >
        You can reply to this email to get back in touch
        with
        <strong>${htmlSenderName}</strong>.
      </p>

    </div>


    <!-- FOOTER -->

    <div
      style="
        padding:18px 24px;
        text-align:center;
        background:#fafafa;
        border-top:1px solid #eeeeee;
      "
    >

      <p
        style="
          margin:0;
          color:#888888;
          font-size:12px;
        "
      >
        Sent using SmartWish
      </p>

    </div>

  </div>

</body>

</html>
`;

    /* =====================================
       SEND EMAIL
    ===================================== */

    const info = await transporter.sendMail({

      /*
       * IMPORTANT:
       *
       * Keep the actual authenticated Gmail
       * account as the email address.
       *
       * Only change the DISPLAY NAME.
       */

      from: `"${cleanSenderName}" <${process.env.EMAIL_USER}>`,

      to: cleanRecipientEmail,

      /*
       * When receiver clicks Reply,
       * the reply goes to the person who
       * created/sent the wish.
       */

      replyTo:
        cleanSenderEmail ||
        process.env.EMAIL_USER,

      subject,

      /*
       * Plain text version
       */

      text,

      /*
       * HTML version
       */

      html,
    });

    /* =====================================
       LOGGING
    ===================================== */

    console.log(
      "=========================================="
    );

    console.log(
      "📧 Wish email sent successfully"
    );

    console.log(
      "🆔 Message ID:",
      info.messageId
    );

    console.log(
      "👤 Sender Name:",
      cleanSenderName
    );

    console.log(
      "📨 Recipient:",
      cleanRecipientEmail
    );

    console.log(
      "=========================================="
    );

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {

    console.error(
      "=========================================="
    );

    console.error(
      "❌ Failed to send wish email"
    );

    console.error(error);

    console.error(
      "=========================================="
    );

    throw error;
  }
}
