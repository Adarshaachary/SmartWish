import db from "../config/db";

interface EventData {
  personName: string;
  email: string;
  occasion: string;
  eventDate: string;
  message: string;
  repeatYearly: boolean;
}

export async function createEvent(event: EventData) {
  const sql = `
    INSERT INTO events
    (person_name, email, occasion, event_date, message, repeat_yearly)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    event.personName,
    event.email,
    event.occasion,
    event.eventDate,
    event.message,
    event.repeatYearly,
  ]);

  return result;
}