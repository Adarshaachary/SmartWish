import {
  MdAddCircle,
  MdCalendarMonth,
  MdCelebration,
  MdEmail,
  MdEvent,
  MdAccessTime,
  MdArrowForward,
} from "react-icons/md";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar/Sidebar";

import "./Dashboard.css";

interface EventItem {
  id: number;
  userId?: number;

  personName: string;
  email: string;
  occasion: string;

  eventDate: string;
  eventTime?: string;

  message?: string;

  repeatYearly?: boolean;

  status?: string;
  sent?: boolean;
  emailSent?: boolean;
  sentAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

interface ChartPoint {
  day: string;
  date: string;
  count: number;
  isToday: boolean;
}

/* =========================================================
   AUTH HELPERS
========================================================= */

const getAuthToken = () => {
  return (
    localStorage.getItem("smartwish_token") ||
    sessionStorage.getItem("smartwish_token")
  );
};

const getAuthUser = () => {
  return (
    localStorage.getItem("smartwish_user") ||
    sessionStorage.getItem("smartwish_user")
  );
};

const clearAuth = () => {
  localStorage.removeItem("smartwish_token");
  localStorage.removeItem("smartwish_user");

  sessionStorage.removeItem("smartwish_token");
  sessionStorage.removeItem("smartwish_user");
};

/* =========================================================
   DATE HELPERS
========================================================= */

const getStartOfWeek = (date: Date) => {
  const result = new Date(date);

  const day = result.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() + difference
  );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
};

const formatDateKey = (date: Date) => {
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

const normalizeDate = (
  dateString?: string
) => {
  if (!dateString) {
    return "";
  }

  const value =
    String(dateString).trim();

  if (!value) {
    return "";
  }

  const dateOnlyMatch =
    value.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (dateOnlyMatch) {
    return value;
  }

  const parsed =
    new Date(value);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return value.slice(0, 10);
  }

  return formatDateKey(parsed);
};

const getLocalDate = (
  dateString?: string
) => {
  if (!dateString) {
    return null;
  }

  const normalized =
    normalizeDate(dateString);

  if (!normalized) {
    return null;
  }

  const parts =
    normalized.split("-");

  if (parts.length !== 3) {
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

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
};

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const navigate =
    useNavigate();

  const [events, setEvents] =
    useState<EventItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [currentDate, setCurrentDate] =
    useState(new Date());

  /* =======================================================
     LIVE DATE
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
     FETCH EVENTS
  ======================================================= */

  const fetchEvents =
    useCallback(async () => {
      try {
        setLoading(true);

        /*
         * IMPORTANT:
         * Check localStorage first,
         * then sessionStorage.
         */
        const token =
          getAuthToken();

        const user =
          getAuthUser();

        if (!token || !user) {
          navigate("/login");
          return;
        }

        let parsedUser: any;

        try {
          parsedUser =
            JSON.parse(user);
        } catch (error) {
          console.error(
            "Invalid saved user:",
            error
          );

          clearAuth();

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
          const validEvents =
            receivedEvents.filter(
              (event: EventItem) =>
                event &&
                event.id !== undefined &&
                event.eventDate
            );

          setEvents(
            validEvents
          );
        } else {
          setEvents([]);
        }

      } catch (error: any) {
        console.error(
          "Failed to fetch dashboard events:",
          error
        );

        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          clearAuth();

          navigate("/login");

          return;
        }

        setEvents([]);

      } finally {
        setLoading(false);
      }
    }, [navigate]);

  /* =======================================================
     INITIAL FETCH
  ======================================================= */

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /* =======================================================
     REFRESH
  ======================================================= */

  useEffect(() => {
    const handleFocus = () => {
      fetchEvents();
    };

    const handleVisibility =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          fetchEvents();
        }
      };

    window.addEventListener(
      "focus",
      handleFocus
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [fetchEvents]);

  /* =======================================================
     PERIODIC REFRESH
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
     TODAY
  ======================================================= */

  const todayKey =
    useMemo(() => {
      return formatDateKey(
        currentDate
      );
    }, [currentDate]);

  /* =======================================================
     EVENT DATE + TIME
  ======================================================= */

  const getEventDateTime = (
    event: EventItem,
    year?: number
  ) => {
    const originalDate =
      getLocalDate(
        event.eventDate
      );

    if (!originalDate) {
      return null;
    }

    const targetYear =
      year ??
      originalDate.getFullYear();

    const result =
      new Date(
        targetYear,
        originalDate.getMonth(),
        originalDate.getDate()
      );

    result.setHours(
      0,
      0,
      0,
      0
    );

    const timeValue =
      String(
        event.eventTime ?? ""
      )
        .trim()
        .toUpperCase();

    if (!timeValue) {
      return result;
    }

    const amPmMatch =
      timeValue.match(
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

    const timeParts =
      timeValue.split(":");

    const hour =
      Number(
        timeParts[0]
      );

    const minute =
      Number(
        timeParts[1] ?? 0
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

  /* =======================================================
     COMPLETED CHECK
  ======================================================= */

  const isCompletedEvent =
    (event: EventItem) => {
      return (
        event.sent === true ||
        event.emailSent === true ||
        event.status
          ?.toLowerCase() ===
          "sent" ||
        event.status
          ?.toLowerCase() ===
          "completed"
      );
    };

  /* =======================================================
     NEXT OCCURRENCE
  ======================================================= */

  const getNextEventOccurrence =
    (
      event: EventItem
    ) => {
      const now =
        new Date(
          currentDate
        );

      const originalDate =
        getLocalDate(
          event.eventDate
        );

      if (!originalDate) {
        return null;
      }

      if (
        event.repeatYearly
      ) {
        let occurrence =
          getEventDateTime(
            event,
            now.getFullYear()
          );

        if (!occurrence) {
          return null;
        }

        if (
          occurrence < now
        ) {
          occurrence =
            getEventDateTime(
              event,
              now.getFullYear() + 1
            );
        }

        return occurrence;
      }

      return getEventDateTime(
        event
      );
    };

  /* =======================================================
     UPCOMING
  ======================================================= */

  const upcomingEventItems =
    useMemo(() => {
      return events
        .map((event) => ({
          event,
          occurrence:
            getNextEventOccurrence(
              event
            ),
        }))
        .filter(
          (
            item
          ): item is {
            event: EventItem;
            occurrence: Date;
          } =>
            item.occurrence !== null
        )
        .filter(
          (item) =>
            item.occurrence >=
              currentDate &&
            !isCompletedEvent(
              item.event
            )
        )
        .sort(
          (a, b) =>
            a.occurrence.getTime() -
            b.occurrence.getTime()
        );
    }, [
      events,
      currentDate,
    ]);

  const nextEventItem =
    upcomingEventItems[0] ??
    null;

  const nextEvent =
    nextEventItem?.event ??
    null;

  const nextEventOccurrence =
    nextEventItem?.occurrence ??
    null;

  /* =======================================================
     WEEKLY CHART
  ======================================================= */

  const weeklyChart =
    useMemo<ChartPoint[]>(() => {
      const today =
        new Date(
          currentDate
        );

      today.setHours(
        0,
        0,
        0,
        0
      );

      const monday =
        getStartOfWeek(
          today
        );

      const dayNames = [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN",
      ];

      return dayNames.map(
        (
          day,
          index
        ) => {
          const currentDay =
            new Date(
              monday
            );

          currentDay.setDate(
            monday.getDate() +
              index
          );

          currentDay.setHours(
            0,
            0,
            0,
            0
          );

          const dateKey =
            formatDateKey(
              currentDay
            );

          const count =
            events.reduce(
              (
                total,
                event
              ) => {
                const originalDate =
                  getLocalDate(
                    event.eventDate
                  );

                if (!originalDate) {
                  return total;
                }

                if (
                  event.repeatYearly
                ) {
                  const occurrence =
                    getEventDateTime(
                      event,
                      currentDay.getFullYear()
                    );

                  if (!occurrence) {
                    return total;
                  }

                  const sameMonth =
                    occurrence.getMonth() ===
                    currentDay.getMonth();

                  const sameDate =
                    occurrence.getDate() ===
                    currentDay.getDate();

                  if (
                    sameMonth &&
                    sameDate
                  ) {
                    return total + 1;
                  }

                  return total;
                }

                const eventDateKey =
                  normalizeDate(
                    event.eventDate
                  );

                if (
                  eventDateKey ===
                  dateKey
                ) {
                  return total + 1;
                }

                return total;
              },
              0
            );

          return {
            day,
            date: dateKey,
            count,
            isToday:
              dateKey ===
              todayKey,
          };
        }
      );
    }, [
      events,
      currentDate,
      todayKey,
    ]);

  /* =======================================================
     GRAPH
  ======================================================= */

  const maxCount =
    Math.max(
      ...weeklyChart.map(
        (item) =>
          item.count
      ),
      1
    );

  const chartWidth = 1000;
  const chartHeight = 380;

  const paddingLeft = 62;
  const paddingRight = 30;
  const paddingTop = 45;
  const paddingBottom = 72;

  const graphWidth =
    chartWidth -
    paddingLeft -
    paddingRight;

  const graphHeight =
    chartHeight -
    paddingTop -
    paddingBottom;

  const points =
    weeklyChart.map(
      (
        item,
        index
      ) => {
        const x =
          paddingLeft +
          (graphWidth / 6) *
            index;

        const normalized =
          item.count /
          maxCount;

        const visualValue =
          item.count === 0
            ? 0
            : Math.max(
                normalized,
                0.035
              );

        const y =
          paddingTop +
          graphHeight -
          visualValue *
            graphHeight;

        return {
          ...item,
          x,
          y,
        };
      }
    );

  const createSmoothPath =
    () => {
      if (
        points.length === 0
      ) {
        return "";
      }

      if (
        points.length === 1
      ) {
        return `M ${points[0].x} ${points[0].y}`;
      }

      let path =
        `M ${points[0].x} ${points[0].y}`;

      for (
        let i = 0;
        i <
        points.length - 1;
        i++
      ) {
        const current =
          points[i];

        const next =
          points[i + 1];

        const distance =
          (next.x -
            current.x) /
          2;

        path += `
          C
          ${current.x + distance}
          ${current.y},
          ${next.x - distance}
          ${next.y},
          ${next.x}
          ${next.y}
        `;
      }

      return path;
    };

  const linePath =
    createSmoothPath();

  const baseline =
    chartHeight -
    paddingBottom;

  const areaPath =
    points.length > 0
      ? `
        ${linePath}
        L ${points[points.length - 1].x} ${baseline}
        L ${points[0].x} ${baseline}
        Z
      `
      : "";

  /* =======================================================
     STATISTICS
  ======================================================= */

  const totalWishes =
    events.length;

  const upcomingEvents =
    upcomingEventItems.map(
      (item) =>
        item.event
    );

  const birthdays =
    events.filter(
      (event) =>
        event.occasion
          ?.toLowerCase()
          .includes("birthday")
    );

  const sentMessages =
    events.filter(
      (event) =>
        isCompletedEvent(
          event
        )
    ).length;

  const thisWeekTotal =
    weeklyChart.reduce(
      (
        sum,
        item
      ) =>
        sum + item.count,
      0
    );

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="dashboard-page">

      <Sidebar />

      <main className="dashboard-main">

        <div className="dashboard-content">

          <section className="dashboard-header">

            <div className="dashboard-header-copy">

              <p className="dashboard-eyebrow">
                SMARTWISH DASHBOARD
              </p>

              <h1>
                Make every moment{" "}
                <span>
                  memorable
                </span>
              </h1>

              <p className="dashboard-subtitle">
                Keep track of your upcoming
                wishes, birthdays and special
                occasions.
              </p>

            </div>

            <button
              type="button"
              className="add-wish-button"
              onClick={() =>
                navigate("/add-wish")
              }
            >
              <MdAddCircle />

              <span>
                Add New Wish
              </span>

              <MdArrowForward />
            </button>

          </section>

          <section className="dashboard-stats">

            <div className="stat-card">

              <div className="stat-icon purple">
                <MdEvent />
              </div>

              <div>
                <span>
                  Total Wishes
                </span>

                <strong>
                  {loading
                    ? "..."
                    : totalWishes}
                </strong>

                <small>
                  All scheduled wishes
                </small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon blue">
                <MdCalendarMonth />
              </div>

              <div>
                <span>
                  Upcoming
                </span>

                <strong>
                  {loading
                    ? "..."
                    : upcomingEvents.length}
                </strong>

                <small>
                  Future occasions
                </small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon pink">
                <MdCelebration />
              </div>

              <div>
                <span>
                  Birthdays
                </span>

                <strong>
                  {loading
                    ? "..."
                    : birthdays.length}
                </strong>

                <small>
                  Birthday wishes
                </small>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon green">
                <MdEmail />
              </div>

              <div>
                <span>
                  Messages
                </span>

                <strong>
                  {loading
                    ? "..."
                    : sentMessages}
                </strong>

                <small>
                  Messages sent
                </small>
              </div>

            </div>

          </section>

          <section className="dashboard-grid">

            <div className="weekly-card">

              <div className="card-heading">

                <div className="card-heading-copy">

                  <p>
                    WEEKLY ACTIVITY
                  </p>

                  <h2>
                    Your wishes this week
                  </h2>

                  <span className="card-heading-note">
                    A simple view of your scheduled moments
                  </span>

                </div>

                <div className="week-badge">

                  <MdCalendarMonth />

                  <span>
                    Monday – Sunday
                  </span>

                </div>

              </div>

              <div className="chart-wrapper">

                {loading ? (
                  <div className="chart-loading">

                    <div className="loading-circle" />

                    <span>
                      Loading your wishes...
                    </span>

                  </div>
                ) : (
                  <svg
                    className="weekly-chart"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Weekly wishes activity"
                  >

                    <defs>

                      <linearGradient
                        id="wishLineGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >

                        <stop
                          offset="0%"
                          stopColor="#7c3aed"
                        />

                        <stop
                          offset="48%"
                          stopColor="#c026d3"
                        />

                        <stop
                          offset="72%"
                          stopColor="#ec4899"
                        />

                        <stop
                          offset="100%"
                          stopColor="#06b6d4"
                        />

                      </linearGradient>

                      <linearGradient
                        id="wishAreaGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >

                        <stop
                          offset="0%"
                          stopColor="#8b5cf6"
                          stopOpacity="0.20"
                        />

                        <stop
                          offset="48%"
                          stopColor="#d946ef"
                          stopOpacity="0.08"
                        />

                        <stop
                          offset="100%"
                          stopColor="#06b6d4"
                          stopOpacity="0"
                        />

                      </linearGradient>

                      <filter
                        id="wishGlow"
                        x="-40%"
                        y="-100%"
                        width="180%"
                        height="300%"
                      >

                        <feGaussianBlur
                          stdDeviation="5"
                          result="blur"
                        />

                        <feMerge>

                          <feMergeNode
                            in="blur"
                          />

                          <feMergeNode
                            in="SourceGraphic"
                          />

                        </feMerge>

                      </filter>

                      <filter
                        id="wishAreaGlow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="150%"
                      >

                        <feGaussianBlur
                          stdDeviation="10"
                        />

                      </filter>

                    </defs>

                    {[0, 1, 2, 3, 4].map(
                      (line) => {

                        const y =
                          paddingTop +
                          (graphHeight / 4) *
                            line;

                        return (
                          <line
                            key={line}
                            x1={
                              paddingLeft
                            }
                            y1={y}
                            x2={
                              chartWidth -
                              paddingRight
                            }
                            y2={y}
                            className="chart-grid-line"
                          />
                        );
                      }
                    )}

                    <line
                      x1={
                        paddingLeft
                      }
                      y1={
                        baseline
                      }
                      x2={
                        chartWidth -
                        paddingRight
                      }
                      y2={
                        baseline
                      }
                      className="chart-baseline"
                    />

                    {areaPath && (
                      <path
                        d={areaPath}
                        className="chart-area-glow"
                        fill="url(#wishAreaGradient)"
                        filter="url(#wishAreaGlow)"
                      />
                    )}

                    {areaPath && (
                      <path
                        d={areaPath}
                        className="chart-area"
                        fill="url(#wishAreaGradient)"
                      />
                    )}

                    {linePath && (
                      <path
                        d={linePath}
                        pathLength={1}
                        className="chart-line-glow"
                        fill="none"
                        stroke="url(#wishLineGradient)"
                        filter="url(#wishGlow)"
                      />
                    )}

                    {linePath && (
                      <path
                        d={linePath}
                        pathLength={1}
                        className="chart-line"
                        fill="none"
                        stroke="url(#wishLineGradient)"
                      />
                    )}

                    {points.map(
                      (
                        point,
                        index
                      ) => (
                        <g
                          key={
                            point.date
                          }
                          className="chart-point-group"
                          style={{
                            animationDelay:
                              `${0.45 + index * 0.10}s`,
                          }}
                        >

                          {point.isToday && (
                            <circle
                              cx={
                                point.x
                              }
                              cy={
                                point.y
                              }
                              r="23"
                              className="today-halo"
                            />
                          )}

                          <circle
                            cx={
                              point.x
                            }
                            cy={
                              point.y
                            }
                            r="15"
                            className="point-pulse"
                          />

                          <circle
                            cx={
                              point.x
                            }
                            cy={
                              point.y
                            }
                            r="8"
                            className="point-ring"
                          />

                          <circle
                            cx={
                              point.x
                            }
                            cy={
                              point.y
                            }
                            r="5"
                            className="chart-point"
                          />

                          <g
                            className="wish-count-badge"
                            transform={`translate(${point.x}, ${
                              point.y - 48
                            })`}
                          >

                            <rect
                              x="-22"
                              y="-13"
                              width="44"
                              height="26"
                              rx="13"
                              className="wish-count-background"
                            />

                            <text
                              x="0"
                              y="5"
                              textAnchor="middle"
                              className="wish-count-text"
                            >
                              {
                                point.count
                              }
                            </text>

                          </g>

                          <text
                            x={
                              point.x
                            }
                            y={
                              chartHeight -
                              paddingBottom +
                              34
                            }
                            textAnchor="middle"
                            className={
                              point.isToday
                                ? "chart-day today-day"
                                : "chart-day"
                            }
                          >
                            {
                              point.day
                            }
                          </text>

                          {point.isToday && (
                            <text
                              x={
                                point.x
                              }
                              y={
                                chartHeight -
                                paddingBottom +
                                52
                              }
                              textAnchor="middle"
                              className="today-label"
                            >
                              TODAY
                            </text>
                          )}

                        </g>
                      )
                    )}

                  </svg>
                )}

              </div>

              <div className="chart-footer">

                <div className="chart-footer-item">

                  <span className="footer-dot" />

                  <span>
                    Wishes scheduled
                  </span>

                </div>

                <strong>
                  {thisWeekTotal}{" "}
                  {thisWeekTotal === 1
                    ? "wish"
                    : "wishes"}{" "}
                  this week
                </strong>

              </div>

            </div>

            <div className="next-event-card">

              <div className="next-event-header">

                <div>

                  <p>
                    NEXT OCCASION
                  </p>

                  <h2>
                    Coming up
                  </h2>

                </div>

                <div className="next-event-icon">
                  <MdCelebration />
                </div>

              </div>

              {nextEvent ? (

                <div className="next-event-body">

                  <div className="event-avatar">
                    {nextEvent
                      .personName
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "?"}
                  </div>

                  <h3>
                    {
                      nextEvent.personName
                    }
                  </h3>

                  <span className="occasion-label">
                    {
                      nextEvent.occasion
                    }
                  </span>

                  <div className="event-details">

                    <div>

                      <MdCalendarMonth />

                      <span>
                        {nextEventOccurrence
                          ? nextEventOccurrence.toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : ""}
                      </span>

                    </div>

                    {nextEventOccurrence && (
                      <div>

                        <MdAccessTime />

                        <span>
                          {nextEventOccurrence.toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </span>

                      </div>
                    )}

                    <div>

                      <MdEmail />

                      <span>
                        {
                          nextEvent.email
                        }
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="view-event-button"
                    onClick={() =>
                      navigate(
                        "/upcoming-events"
                      )
                    }
                  >

                    <span>
                      View event
                    </span>

                    <MdArrowForward />

                  </button>

                </div>

              ) : (

                <div className="no-event-state">

                  <div className="no-event-icon">
                    <MdCelebration />
                  </div>

                  <h3>
                    Nothing coming up
                  </h3>

                  <p>
                    You have no upcoming wishes
                    scheduled right now.
                  </p>

                  <button
                    type="button"
                    className="view-event-button"
                    onClick={() =>
                      navigate(
                        "/add-wish"
                      )
                    }
                  >

                    <span>
                      Add a wish
                    </span>

                    <MdArrowForward />

                  </button>

                </div>

              )}

            </div>

          </section>

          <section className="week-summary-card">

            <div className="week-summary-heading">

              <div>

                <p>
                  THIS WEEK
                </p>

                <h2>
                  Your weekly schedule
                </h2>

              </div>

              <span className="week-summary-description">
                {thisWeekTotal} scheduled{" "}
                {thisWeekTotal === 1
                  ? "wish"
                  : "wishes"}
              </span>

            </div>

            <div className="week-summary-list">

              {weeklyChart.map(
                (item) => (
                  <div
                    key={
                      item.date
                    }
                    className={
                      item.isToday
                        ? "week-summary-day active-day"
                        : "week-summary-day"
                    }
                  >

                    <span className="summary-day-name">
                      {
                        item.day
                      }
                    </span>

                    <div className="summary-bar">

                      <div
                        className="summary-bar-fill"
                        style={{
                          width:
                            item.count >
                            0
                              ? `${Math.max(
                                  (item.count /
                                    maxCount) *
                                    100,
                                  8
                                )}%`
                              : "0%",
                        }}
                      />

                    </div>

                    <strong>
                      {
                        item.count
                      }
                    </strong>

                  </div>
                )
              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;