import {
  MdArrowBack,
  MdArrowForward,
  MdAdd,
  MdCalendarMonth,
  MdAccessTime,
  MdEmail,
  MdDeleteOutline,
  MdCelebration,
  MdRepeat,
  MdClose,
  MdCheckCircle,
  MdEvent,
} from "react-icons/md";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import "./UpcomingEvents.css";

/* =========================================================
   EVENT TYPE
========================================================= */

interface EventItem {
  id: number;

  personName: string;

  email: string;

  occasion: string;

  eventDate: string;

  eventTime?: string;

  message?: string;

  repeatYearly?: boolean;

  status?: string;

  createdAt?: string;
}

/* =========================================================
   UPCOMING EVENT TYPE
========================================================= */

interface UpcomingEvent {
  event: EventItem;

  occurrence: Date;
}

/* =========================================================
   DATE KEY
========================================================= */

const formatDateKey = (
  date: Date
) => {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* =========================================================
   NORMALIZE DATE
========================================================= */

const normalizeDate = (
  value?: string
) => {
  if (!value) {
    return "";
  }

  const text =
    String(value).trim();

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      text
    )
  ) {
    return text;
  }

  const parsed =
    new Date(text);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return text.slice(0, 10);
  }

  return formatDateKey(
    parsed
  );
};

/* =========================================================
   LOCAL DATE
========================================================= */

const getLocalDate = (
  value?: string
) => {
  const normalized =
    normalizeDate(value);

  if (!normalized) {
    return null;
  }

  const parts =
    normalized.split("-");

  if (
    parts.length !== 3
  ) {
    return null;
  }

  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const day =
    Number(parts[2]);

  if (
    !year ||
    !month ||
    !day
  ) {
    return null;
  }

  const result =
    new Date(
      year,
      month - 1,
      day
    );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
};

/* =========================================================
   EVENT DATETIME
========================================================= */

const createEventDateTime = (
  event: EventItem,
  year: number
) => {
  const originalDate =
    getLocalDate(
      event.eventDate
    );

  if (!originalDate) {
    return null;
  }

  const result =
    new Date(
      year,
      originalDate.getMonth(),
      originalDate.getDate()
    );

  result.setHours(
    0,
    0,
    0,
    0
  );

  const time =
    String(
      event.eventTime ?? ""
    )
      .trim()
      .toUpperCase();

  if (!time) {
    return result;
  }

  /* =======================================================
     12-HOUR TIME

     Example:

     4:30 PM
     4:30:00 PM
  ======================================================= */

  const amPmMatch =
    time.match(
      /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/
    );

  if (amPmMatch) {
    let hour =
      Number(
        amPmMatch[1]
      );

    const minute =
      Number(
        amPmMatch[2]
      );

    const period =
      amPmMatch[3];

    if (
      period === "PM" &&
      hour < 12
    ) {
      hour += 12;
    }

    if (
      period === "AM" &&
      hour === 12
    ) {
      hour = 0;
    }

    result.setHours(
      hour,
      minute,
      0,
      0
    );

    return result;
  }

  /* =======================================================
     MYSQL TIME

     Example:

     16:30
     16:30:00
  ======================================================= */

  const parts =
    time.split(":");

  const hour =
    Number(parts[0]);

  const minute =
    Number(
      parts[1] ?? 0
    );

  if (
    !Number.isNaN(hour) &&
    !Number.isNaN(minute)
  ) {
    result.setHours(
      hour,
      minute,
      0,
      0
    );
  }

  return result;
};

/* =========================================================
   GET NEXT OCCURRENCE
========================================================= */

const getNextOccurrence = (
  event: EventItem,
  now: Date
) => {
  const originalDate =
    getLocalDate(
      event.eventDate
    );

  if (!originalDate) {
    return null;
  }

  /* =======================================================
     YEARLY EVENT
  ======================================================= */

  if (
    event.repeatYearly
  ) {
    let occurrence =
      createEventDateTime(
        event,
        now.getFullYear()
      );

    if (!occurrence) {
      return null;
    }

    /*
      If this year's occurrence
      has already passed, show
      next year's occurrence.
    */

    if (
      occurrence < now
    ) {
      occurrence =
        createEventDateTime(
          event,
          now.getFullYear() + 1
        );
    }

    return occurrence;
  }

  /* =======================================================
     NORMAL EVENT
  ======================================================= */

  return createEventDateTime(
    event,
    originalDate.getFullYear()
  );
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (
  date: Date
) => {
  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

/* =========================================================
   FORMAT TIME
========================================================= */

const formatTime = (
  date: Date
) => {
  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );
};

/* =========================================================
   UPCOMING EVENTS PAGE
========================================================= */

function UpcomingEvents() {
  const navigate =
    useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [events, setEvents] =
    useState<EventItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [deleteTarget, setDeleteTarget] =
    useState<EventItem | null>(
      null
    );

  const [deleting, setDeleting] =
    useState(false);

  const [toast, setToast] =
    useState("");

  /* =======================================================
     FETCH EVENTS
  ======================================================= */

  const fetchEvents =
    useCallback(async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "smartwish_token"
          );

        const user =
          localStorage.getItem(
            "smartwish_user"
          );

        if (!token || !user) {
          navigate("/login");
          return;
        }

        let parsedUser: any;

        try {
          parsedUser =
            JSON.parse(user);
        } catch {
          navigate("/login");
          return;
        }

        const userId =
          parsedUser?.id ??
          parsedUser?.userId ??
          parsedUser?.user?.id;

        const response =
          await axios.get(
            "http://localhost:5000/api/events",
            {
              params: userId
                ? { userId }
                : undefined,

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const receivedEvents =
          response.data?.events ??
          response.data?.data ??
          response.data ??
          [];

        if (
          Array.isArray(
            receivedEvents
          )
        ) {
          setEvents(
            receivedEvents
          );
        } else {
          setEvents([]);
        }
      } catch (error: any) {
        console.error(
          "Failed to load upcoming events:",
          error
        );

        if (
          error?.response?.status ===
            401 ||
          error?.response?.status ===
            403
        ) {
          localStorage.removeItem(
            "smartwish_token"
          );

          localStorage.removeItem(
            "smartwish_user"
          );

          navigate("/login");
        } else {
          setEvents([]);
        }
      } finally {
        setLoading(false);
      }
    }, [navigate]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /* =======================================================
     UPDATE CURRENT TIME
  ======================================================= */

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setCurrentDate(
          new Date()
        );
      }, 30000);

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, []);

  /* =======================================================
     REFRESH WHEN PAGE GETS FOCUS
  ======================================================= */

  useEffect(() => {
    const refresh =
      () => {
        fetchEvents();
      };

    window.addEventListener(
      "focus",
      refresh
    );

    return () => {
      window.removeEventListener(
        "focus",
        refresh
      );
    };
  }, [fetchEvents]);

  /* =======================================================
     AUTO REFRESH
  ======================================================= */

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        fetchEvents();
      }, 15000);

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [fetchEvents]);

  /* =======================================================
     TOAST AUTO HIDE
  ======================================================= */

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setToast("");
      }, 3500);

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [toast]);

  /* =======================================================
     REAL UPCOMING EVENTS
  ======================================================= */

  const upcomingEvents =
    useMemo<UpcomingEvent[]>(() => {
      const now =
        new Date(
          currentDate
        );

      return events
        .map(
          (event) => ({
            event,

            occurrence:
              getNextOccurrence(
                event,
                now
              ),
          })
        )
        .filter(
          (
            item
          ): item is UpcomingEvent => {
            if (
              !item.occurrence
            ) {
              return false;
            }

            /*
              One-time events that have
              already been sent/completed
              should not appear again.
            */

            if (
              !item.event
                .repeatYearly
            ) {
              const status =
                item.event.status
                  ?.toLowerCase();

              if (
                status === "sent" ||
                status ===
                  "completed" ||
                status ===
                  "failed"
              ) {
                return false;
              }
            }

            return (
              item.occurrence >=
              now
            );
          }
        )
        .sort(
          (
            a,
            b
          ) =>
            a.occurrence.getTime() -
            b.occurrence.getTime()
        );
    }, [
      events,
      currentDate,
    ]);

  /* =======================================================
     TODAY'S EVENTS
  ======================================================= */

  const todayEvents =
    useMemo(() => {
      const today =
        formatDateKey(
          currentDate
        );

      return upcomingEvents.filter(
        (item) =>
          formatDateKey(
            item.occurrence
          ) === today
      );
    }, [
      upcomingEvents,
      currentDate,
    ]);

  /* =======================================================
     FUTURE EVENTS
  ======================================================= */

  const futureEvents =
    useMemo(() => {
      const today =
        formatDateKey(
          currentDate
        );

      return upcomingEvents.filter(
        (item) =>
          formatDateKey(
            item.occurrence
          ) !== today
      );
    }, [
      upcomingEvents,
      currentDate,
    ]);

  /* =======================================================
     DELETE EVENT
  ======================================================= */

  const deleteEvent =
    async () => {
      if (!deleteTarget) {
        return;
      }

      try {
        setDeleting(true);

        const token =
          localStorage.getItem(
            "smartwish_token"
          );

        await axios.delete(
          `http://localhost:5000/api/events/${deleteTarget.id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        /*
          Remove immediately from UI.

          This makes the page feel
          instant instead of waiting
          for another GET request.
        */

        setEvents(
          (previous) =>
            previous.filter(
              (event) =>
                event.id !==
                deleteTarget.id
            )
        );

        const deletedName =
          deleteTarget.personName;

        setDeleteTarget(null);

        setToast(
          `Wish for ${deletedName} deleted successfully`
        );

        /*
          Refresh backend data after deletion.
        */

        await fetchEvents();
      } catch (error: any) {
        console.error(
          "Delete event error:",
          error
        );

        setToast(
          "Unable to delete this wish. Please try again."
        );
      } finally {
        setDeleting(false);
      }
    };

  /* =======================================================
     EVENT CARD
  ======================================================= */

  const renderEventCard =
    (
      item: UpcomingEvent
    ) => {
      const event =
        item.event;

      const occurrence =
        item.occurrence;

      return (
        <article
          className="upcoming-event-card"
          key={
            `${event.id}-${occurrence.getFullYear()}`
          }
        >

          {/* ===============================================
              TOP
          =============================================== */}

          <div className="event-card-top">

            <div className="event-card-person">

              <div className="person-avatar">

                {event.personName
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "?"}

              </div>

              <div>

                <h3>
                  {
                    event.personName
                  }
                </h3>

                <span>
                  {
                    event.occasion
                  }
                </span>

              </div>

            </div>

            {/* STATUS */}

            <div
              className={
                event.repeatYearly
                  ? "event-status yearly"
                  : "event-status scheduled"
              }
            >

              {event.repeatYearly ? (
                <>
                  <MdRepeat />
                  Every Year
                </>
              ) : (
                <>
                  <MdCheckCircle />
                  Scheduled
                </>
              )}

            </div>

          </div>

          {/* ===============================================
              DETAILS
          =============================================== */}

          <div className="event-card-details">

            <div className="event-detail">

              <div className="event-detail-icon">
                <MdCalendarMonth />
              </div>

              <div>

                <small>
                  Date
                </small>

                <strong>
                  {
                    formatDate(
                      occurrence
                    )
                  }
                </strong>

              </div>

            </div>

            <div className="event-detail">

              <div className="event-detail-icon">
                <MdAccessTime />
              </div>

              <div>

                <small>
                  Time
                </small>

                <strong>
                  {
                    formatTime(
                      occurrence
                    )
                  }
                </strong>

              </div>

            </div>

            <div className="event-detail">

              <div className="event-detail-icon">
                <MdEmail />
              </div>

              <div>

                <small>
                  Recipient
                </small>

                <strong className="email-text">
                  {
                    event.email
                  }
                </strong>

              </div>

            </div>

          </div>

          {/* ===============================================
              MESSAGE
          =============================================== */}

          {event.message && (

            <div className="event-message">

              <span>
                Message
              </span>

              <p>
                {event.message}
              </p>

            </div>

          )}

          {/* ===============================================
              ACTIONS
          =============================================== */}

          <div className="event-card-actions">

            <button
              className="delete-event-button"
              onClick={() =>
                setDeleteTarget(
                  event
                )
              }
            >

              <MdDeleteOutline />

              Delete Wish

            </button>

          </div>

        </article>
      );
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="upcoming-page">

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <header className="upcoming-header">

        <div className="upcoming-header-inner">

          {/* BACK BUTTON */}

          <button
            className="back-dashboard-button"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >

            <MdArrowBack />

            <span>
              Back to Dashboard
            </span>

          </button>

          <div className="header-content">

            <div>

              <div className="page-eyebrow">
                SMARTWISH
              </div>

              <h1>
                Upcoming Events
              </h1>

              <p>
                Keep track of your scheduled
                wishes and upcoming special
                occasions.
              </p>

            </div>

            <button
              className="add-event-button"
              onClick={() =>
                navigate(
                  "/add-wish"
                )
              }
            >

              <MdAdd />

              Add New Wish

            </button>

          </div>

        </div>

      </header>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="upcoming-main">

        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="upcoming-summary">

          <div className="summary-card">

            <div className="summary-icon purple">
              <MdEvent />
            </div>

            <div>

              <span>
                Upcoming
              </span>

              <strong>
                {
                  upcomingEvents.length
                }
              </strong>

              <small>
                Future wishes
              </small>

            </div>

          </div>

          <div className="summary-card">

            <div className="summary-icon blue">
              <MdCalendarMonth />
            </div>

            <div>

              <span>
                Today
              </span>

              <strong>
                {
                  todayEvents.length
                }
              </strong>

              <small>
                Scheduled today
              </small>

            </div>

          </div>

          <div className="summary-card">

            <div className="summary-icon pink">
              <MdRepeat />
            </div>

            <div>

              <span>
                Every Year
              </span>

              <strong>
                {
                  upcomingEvents.filter(
                    (item) =>
                      item.event
                        .repeatYearly
                  ).length
                }
              </strong>

              <small>
                Repeating wishes
              </small>

            </div>

          </div>

        </section>

        {/* =================================================
            TODAY
        ================================================= */}

        {!loading &&
          todayEvents.length >
            0 && (

            <section className="event-section">

              <div className="section-heading">

                <div>

                  <span>
                    TODAY
                  </span>

                  <h2>
                    Today's wishes
                  </h2>

                </div>

                <p>
                  Wishes scheduled for today
                </p>

              </div>

              <div className="event-list">

                {todayEvents.map(
                  renderEventCard
                )}

              </div>

            </section>

          )}

        {/* =================================================
            FUTURE
        ================================================= */}

        {!loading &&
          futureEvents.length >
            0 && (

            <section className="event-section">

              <div className="section-heading">

                <div>

                  <span>
                    FUTURE
                  </span>

                  <h2>
                    Future occasions
                  </h2>

                </div>

                <p>
                  Your upcoming scheduled wishes
                </p>

              </div>

              <div className="event-list">

                {futureEvents.map(
                  renderEventCard
                )}

              </div>

            </section>

          )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="upcoming-empty">

            <div className="empty-icon loading-icon">
              <MdEvent />
            </div>

            <h2>
              Loading your events...
            </h2>

            <p>
              Please wait while we load your
              scheduled wishes.
            </p>

          </div>

        )}

        {/* =================================================
            NO EVENTS
        ================================================= */}

        {!loading &&
          upcomingEvents.length ===
            0 && (

            <div className="upcoming-empty">

              <div className="empty-icon">
                <MdCelebration />
              </div>

              <h2>
                No upcoming events
              </h2>

              <p>
                You don't have any wishes
                scheduled for today or the
                future.
              </p>

              <button
                className="empty-add-button"
                onClick={() =>
                  navigate(
                    "/add-wish"
                  )
                }
              >

                <MdAdd />

                Schedule a Wish

                <MdArrowForward />

              </button>

            </div>

          )}

      </main>

      {/* ===================================================
          DELETE CONFIRMATION MODAL
      =================================================== */}

      {deleteTarget && (

        <div
          className="modal-overlay"
          onClick={() =>
            !deleting &&
            setDeleteTarget(
              null
            )
          }
        >

          <div
            className="delete-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                !deleting &&
                setDeleteTarget(
                  null
                )
              }
            >
              <MdClose />
            </button>

            <div className="delete-modal-icon">
              <MdDeleteOutline />
            </div>

            <h2>
              Delete this wish?
            </h2>

            <p>
              Are you sure you want to delete
              the wish scheduled for{" "}
              <strong>
                {
                  deleteTarget.personName
                }
              </strong>
              ?
            </p>

            <div className="delete-modal-actions">

              <button
                className="cancel-delete-button"
                disabled={
                  deleting
                }
                onClick={() =>
                  setDeleteTarget(
                    null
                  )
                }
              >
                Cancel
              </button>

              <button
                className="confirm-delete-button"
                disabled={
                  deleting
                }
                onClick={
                  deleteEvent
                }
              >

                {deleting
                  ? "Deleting..."
                  : "Yes, Delete"}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================
          SUCCESS / ERROR TOAST
      =================================================== */}

      {toast && (

        <div className="success-toast">

          <div className="toast-icon">
            <MdCheckCircle />
          </div>

          <div>

            <strong>
              {toast.includes(
                "successfully"
              )
                ? "Wish deleted"
                : "Something went wrong"}
            </strong>

            <span>
              {toast}
            </span>

          </div>

          <button
            onClick={() =>
              setToast("")
            }
          >
            <MdClose />
          </button>

        </div>

      )}

    </div>
  );
}

export default UpcomingEvents;