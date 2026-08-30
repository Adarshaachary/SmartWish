import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  MdCake,
  MdFavorite,
  MdCelebration,
  MdMail,
  MdCalendarMonth,
  MdAccessTime,
  MdRepeat,
  MdPerson,
  MdEmail,
  MdSend,
  MdArrowBack,
  MdCheckCircle,
  MdWarning,
  MdSchedule,
  MdChevronLeft,
  MdChevronRight,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";

import "./AddWish.css";

function AddWish() {
  const navigate = useNavigate();

  /* =========================================
     FORM STATES
  ========================================= */

  const [personName, setPersonName] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("09:00");
  const [message, setMessage] = useState("");
  const [repeatYearly, setRepeatYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* =========================================
     DATE PICKER
  ========================================= */

  const [calendarOpen, setCalendarOpen] = useState(false);

  const today = new Date();

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
  );

  const calendarRef =
    useRef<HTMLDivElement>(null);

  /* =========================================
     TIME PICKER
  ========================================= */

  const [timePickerOpen, setTimePickerOpen] =
    useState(false);

  const [selectedHour, setSelectedHour] =
    useState(9);

  const [selectedMinute, setSelectedMinute] =
    useState(0);

  const [selectedPeriod, setSelectedPeriod] =
    useState<"AM" | "PM">("AM");

  const timePickerRef =
    useRef<HTMLDivElement>(null);

  /* =========================================
     CLOSE PICKERS OUTSIDE CLICK
  ========================================= */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      const target =
        event.target as Node;

      if (
        calendarRef.current &&
        !calendarRef.current.contains(target)
      ) {
        setCalendarOpen(false);
      }

      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(target)
      ) {
        setTimePickerOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================
     ESCAPE KEY
  ========================================= */

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setCalendarOpen(false);
        setTimePickerOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* =========================================
     AUTH TOKEN
  ========================================= */

  const getAuthToken = () => {
    /*
     * Support both the current SmartWish
     * keys and the older login keys.
     */

    return (
      localStorage.getItem("smartwish_token") ||
      sessionStorage.getItem("smartwish_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  /* =========================================
     GET USER NAME
     Used internally for backend compatibility.
     No sender name is shown in the frontend.
  ========================================= */

  const getLoggedInUserName = () => {
    const storedUser =
      localStorage.getItem("smartwish_user") ||
      sessionStorage.getItem("smartwish_user") ||
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!storedUser) {
      return "";
    }

    try {
      const user = JSON.parse(storedUser);

      return (
        user?.name ||
        user?.fullName ||
        user?.username ||
        user?.userName ||
        user?.firstName ||
        ""
      ).toString().trim();
    } catch {
      return "";
    }
  };

  /* =========================================
     CLEAR AUTH
  ========================================= */

  const clearAuth = () => {
    localStorage.removeItem(
      "smartwish_token"
    );

    localStorage.removeItem(
      "smartwish_user"
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem(
      "smartwish_token"
    );

    sessionStorage.removeItem(
      "smartwish_user"
    );

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    /* =====================================
       FRONTEND VALIDATION
    ===================================== */

    if (!personName.trim()) {
      setError(
        "Please enter the person's name."
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "Please enter the email address."
      );
      return;
    }

    if (!eventDate) {
      setError(
        "Please select an event date."
      );
      return;
    }

    if (!eventTime) {
      setError(
        "Please select a send time."
      );
      return;
    }

    if (!message.trim()) {
      setError(
        "Please write a message."
      );
      return;
    }

    /* =====================================
       EMAIL VALIDATION
    ===================================== */

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    try {
      setLoading(true);

      const token = getAuthToken();

      if (!token) {
        setError(
          "Your session has expired. Please login again."
        );

        setTimeout(() => {
          navigate("/login");
        }, 800);

        return;
      }

      /*
       * Sender name is no longer entered by the user.
       * It is obtained internally from the logged-in
       * user so the existing backend functionality
       * continues to work.
       */

      const senderName =
        getLoggedInUserName();

      /* =====================================
         SEND EVENT TO BACKEND
      ===================================== */

      const response = await axios.post(
        "http://localhost:5000/api/events",
        {
          senderName:
            senderName,

          personName:
            personName.trim(),

          email:
            email.trim().toLowerCase(),

          occasion,

          eventDate,

          eventTime,

          message:
            message.trim(),

          repeatYearly:
            Boolean(repeatYearly),
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

      console.log(
        "Wish created:",
        response.data
      );

      /* =====================================
         SUCCESS
      ===================================== */

      setSuccess(
        repeatYearly
          ? "Your yearly wish has been scheduled successfully."
          : "Your wish has been scheduled successfully."
      );

      /* =====================================
         RESET FORM
      ===================================== */

      setPersonName("");
      setEmail("");
      setOccasion("Birthday");
      setEventDate("");
      setEventTime("09:00");
      setMessage("");
      setRepeatYearly(false);

      /* =====================================
         RESET TIME PICKER
      ===================================== */

      setSelectedHour(9);
      setSelectedMinute(0);
      setSelectedPeriod("AM");

      /* =====================================
         CLOSE PICKERS
      ===================================== */

      setCalendarOpen(false);
      setTimePickerOpen(false);

    } catch (err: any) {
      console.error(
        "Create wish error:",
        err
      );

      /* =====================================
         AUTH ERROR
      ===================================== */

      if (
        err?.response?.status === 401
      ) {
        clearAuth();

        setError(
          "Your session has expired. Please login again."
        );

        setTimeout(() => {
          navigate("/login");
        }, 800);

        return;
      }

      /* =====================================
         BACKEND ERROR
      ===================================== */

      const serverMessage =
        err?.response?.data?.message;

      setError(
        serverMessage ||
          "Unable to schedule the wish. Please check your server."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     DATE HELPERS
  ========================================= */

  const getDateString = (
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

  const formatDateForDisplay = (
    dateString: string
  ) => {
    if (!dateString) {
      return "Select a date";
    }

    return new Date(
      `${dateString}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formattedDate =
    formatDateForDisplay(
      eventDate
    );

  /* =========================================
     TIME HELPERS
  ========================================= */

  const formatTimeForDisplay = (
    hour: number,
    minute: number,
    period: "AM" | "PM"
  ) => {
    return `${String(hour).padStart(
      2,
      "0"
    )}:${String(minute).padStart(
      2,
      "0"
    )} ${period}`;
  };

  const formattedTime =
    formatTimeForDisplay(
      selectedHour,
      selectedMinute,
      selectedPeriod
    );

  /* =========================================
     CONVERT 12 HOUR TO 24 HOUR
  ========================================= */

  const convertTo24Hour = (
    hour: number,
    minute: number,
    period: "AM" | "PM"
  ) => {
    let hour24 = hour;

    if (period === "AM") {
      if (hour === 12) {
        hour24 = 0;
      }
    } else {
      if (hour !== 12) {
        hour24 = hour + 12;
      }
    }

    return `${String(hour24).padStart(
      2,
      "0"
    )}:${String(minute).padStart(
      2,
      "0"
    )}`;
  };

  /* =========================================
     UPDATE TIME
  ========================================= */

  const updateTime = (
    hour: number,
    minute: number,
    period: "AM" | "PM"
  ) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedPeriod(period);

    const backendTime =
      convertTo24Hour(
        hour,
        minute,
        period
      );

    setEventTime(backendTime);
  };

  /* =========================================
     TIME CONTROLS
  ========================================= */

  const increaseHour = () => {
    const newHour =
      selectedHour === 12
        ? 1
        : selectedHour + 1;

    updateTime(
      newHour,
      selectedMinute,
      selectedPeriod
    );
  };

  const decreaseHour = () => {
    const newHour =
      selectedHour === 1
        ? 12
        : selectedHour - 1;

    updateTime(
      newHour,
      selectedMinute,
      selectedPeriod
    );
  };

  const increaseMinute = () => {
    const newMinute =
      selectedMinute >= 59
        ? 0
        : selectedMinute + 1;

    updateTime(
      selectedHour,
      newMinute,
      selectedPeriod
    );
  };

  const decreaseMinute = () => {
    const newMinute =
      selectedMinute <= 0
        ? 59
        : selectedMinute - 1;

    updateTime(
      selectedHour,
      newMinute,
      selectedPeriod
    );
  };

  const selectPeriod = (
    period: "AM" | "PM"
  ) => {
    updateTime(
      selectedHour,
      selectedMinute,
      period
    );
  };

  /* =========================================
     CALENDAR
  ========================================= */

  const getCalendarDays = () => {
    const year =
      calendarMonth.getFullYear();

    const month =
      calendarMonth.getMonth();

    const firstDay =
      new Date(
        year,
        month,
        1
      );

    const lastDay =
      new Date(
        year,
        month + 1,
        0
      );

    const daysInMonth =
      lastDay.getDate();

    const firstDayPosition =
      firstDay.getDay() === 0
        ? 6
        : firstDay.getDay() - 1;

    const days: (
      Date | null
    )[] = [];

    for (
      let i = 0;
      i < firstDayPosition;
      i++
    ) {
      days.push(null);
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push(
        new Date(
          year,
          month,
          day
        )
      );
    }

    while (
      days.length < 42
    ) {
      days.push(null);
    }

    return days;
  };

  const calendarDays =
    getCalendarDays();

  const monthYearText =
    calendarMonth.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    );

  const handleDateSelect = (
    date: Date
  ) => {
    setEventDate(
      getDateString(date)
    );

    setCalendarMonth(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      )
    );

    setCalendarOpen(false);
  };

  const goToPreviousMonth = () => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1
      )
    );
  };

  const goToNextMonth = () => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1
      )
    );
  };

  const isToday = (
    date: Date
  ) => {
    return (
      getDateString(date) ===
      getDateString(today)
    );
  };

  const isSelectedDate = (
    date: Date
  ) => {
    return (
      getDateString(date) ===
      eventDate
    );
  };

  /* =========================================
     YEARLY DATE
  ========================================= */

  const yearlyDate = eventDate
    ? new Date(
        `${eventDate}T00:00:00`
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
        }
      )
    : "the selected date";

  /* =========================================
     OCCASION ICON
  ========================================= */

  const getOccasionIcon = () => {
    if (
      occasion === "Birthday"
    ) {
      return <MdCake />;
    }

    if (
      occasion === "Anniversary"
    ) {
      return <MdFavorite />;
    }

    return <MdCelebration />;
  };

  return (
    <div className="addwish-layout">

      {/* BACKGROUND */}

      <div className="addwish-orb addwish-orb-one"></div>

      <div className="addwish-orb addwish-orb-two"></div>

      {/* MAIN */}

      <main className="addwish-container">

        {/* TOP BAR */}

        <div className="addwish-topbar">

          <button
            className="back-button"
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <MdArrowBack />

            <span>
              Dashboard
            </span>
          </button>

          <div className="topbar-brand">
            <span>
              SMARTWISH
            </span>
          </div>

        </div>

        {/* HEADER */}

        <div className="addwish-header">

          <div className="page-icon">
            <MdCelebration />
          </div>

          <p className="page-eyebrow">
            CREATE SOMETHING SPECIAL
          </p>

          <h1>
            Create a New Wish
          </h1>

          <p className="page-description">
            Schedule a beautiful message for someone special.
          </p>

        </div>

        {/* SUCCESS */}

        {success && (
          <div className="form-alert success-alert">

            <MdCheckCircle />

            <span>
              {success}
            </span>

          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="form-alert error-alert">

            <MdWarning />

            <span>
              {error}
            </span>

          </div>
        )}

        {/* FORM */}

        <form
          className="addwish-grid"
          onSubmit={handleSubmit}
        >

          {/* RECIPIENT DETAILS */}

          <section className="wish-card">

            <div className="card-title-row">

              <div className="card-title-icon purple-bg">
                <MdPerson />
              </div>

              <div>

                <h2>
                  Recipient Details
                </h2>

                <p>
                  Who should receive this wish?
                </p>

              </div>

            </div>

            {/* RECIPIENT */}

            <div className="input-group">

              <label>
                Person's Name
              </label>

              <div className="input-wrapper">

                <MdPerson />

                <input
                  type="text"
                  placeholder="e.g. Rahul"
                  value={personName}
                  onChange={(e) =>
                    setPersonName(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="input-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <MdEmail />

                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  autoComplete="email"
                />

              </div>

            </div>

            {/* OCCASION */}

            <div className="input-group">

              <label>
                Occasion
              </label>

              <div className="occasion-grid">

                <button
                  type="button"
                  className={
                    occasion === "Birthday"
                      ? "occasion-option active"
                      : "occasion-option"
                  }
                  onClick={() =>
                    setOccasion(
                      "Birthday"
                    )
                  }
                >

                  <span className="occasion-icon">
                    <MdCake />
                  </span>

                  <span>
                    Birthday
                  </span>

                </button>

                <button
                  type="button"
                  className={
                    occasion ===
                    "Anniversary"
                      ? "occasion-option active"
                      : "occasion-option"
                  }
                  onClick={() =>
                    setOccasion(
                      "Anniversary"
                    )
                  }
                >

                  <span className="occasion-icon">
                    <MdFavorite />
                  </span>

                  <span>
                    Anniversary
                  </span>

                </button>

                <button
                  type="button"
                  className={
                    occasion === "Other"
                      ? "occasion-option active"
                      : "occasion-option"
                  }
                  onClick={() =>
                    setOccasion("Other")
                  }
                >

                  <span className="occasion-icon">
                    <MdCelebration />
                  </span>

                  <span>
                    Other
                  </span>

                </button>

              </div>

            </div>

          </section>

          {/* SCHEDULE */}

          <section className="wish-card">

            <div className="card-title-row">

              <div className="card-title-icon blue-bg">
                <MdCalendarMonth />
              </div>

              <div>

                <h2>
                  Schedule
                </h2>

                <p>
                  Choose when your wish should be sent.
                </p>

              </div>

            </div>

            {/* DATE + TIME */}

            <div className="schedule-grid">

              {/* DATE */}

              <div className="input-group">

                <label>
                  Event Date
                </label>

                <div
                  className="smart-date-picker"
                  ref={calendarRef}
                >

                  <button
                    type="button"
                    className={
                      calendarOpen
                        ? "date-field active"
                        : "date-field"
                    }
                    onClick={() => {
                      setCalendarOpen(
                        !calendarOpen
                      );

                      setTimePickerOpen(
                        false
                      );
                    }}
                  >

                    <MdCalendarMonth />

                    <span
                      className={
                        eventDate
                          ? "date-value"
                          : "date-placeholder"
                      }
                    >
                      {formattedDate}
                    </span>

                  </button>

                  {calendarOpen && (
                    <div className="custom-calendar">

                      <div className="calendar-header">

                        <div>

                          <span className="calendar-month">
                            {monthYearText}
                          </span>

                          <span className="calendar-subtitle">
                            Select your special day
                          </span>

                        </div>

                        <div className="calendar-navigation">

                          <button
                            type="button"
                            onClick={
                              goToPreviousMonth
                            }
                          >
                            <MdChevronLeft />
                          </button>

                          <button
                            type="button"
                            onClick={
                              goToNextMonth
                            }
                          >
                            <MdChevronRight />
                          </button>

                        </div>

                      </div>

                      <div className="calendar-weekdays">

                        {[
                          "Mo",
                          "Tu",
                          "We",
                          "Th",
                          "Fr",
                          "Sa",
                          "Su",
                        ].map(
                          (day) => (
                            <span
                              key={day}
                            >
                              {day}
                            </span>
                          )
                        )}

                      </div>

                      <div className="calendar-grid">

                        {calendarDays.map(
                          (
                            date,
                            index
                          ) => {

                            if (!date) {
                              return (
                                <span
                                  key={
                                    `empty-${index}`
                                  }
                                  className="calendar-empty"
                                />
                              );
                            }

                            return (
                              <button
                                key={getDateString(
                                  date
                                )}
                                type="button"
                                className={[
                                  "calendar-day",

                                  isSelectedDate(
                                    date
                                  )
                                    ? "selected"
                                    : "",

                                  isToday(date)
                                    ? "today"
                                    : "",
                                ]
                                  .filter(
                                    Boolean
                                  )
                                  .join(" ")}

                                onClick={() =>
                                  handleDateSelect(
                                    date
                                  )
                                }
                              >
                                {date.getDate()}
                              </button>
                            );
                          }
                        )}

                      </div>

                      <div className="calendar-footer">

                        <button
                          type="button"
                          onClick={() =>
                            handleDateSelect(
                              today
                            )
                          }
                        >
                          Today
                        </button>

                      </div>

                    </div>
                  )}

                </div>

              </div>

              {/* TIME */}

              <div className="input-group">

                <label>
                  Send Time
                </label>

                <div
                  className="smart-time-picker"
                  ref={timePickerRef}
                >

                  <button
                    type="button"
                    className={
                      timePickerOpen
                        ? "time-field active"
                        : "time-field"
                    }
                    onClick={() => {
                      setTimePickerOpen(
                        !timePickerOpen
                      );

                      setCalendarOpen(
                        false
                      );
                    }}
                  >

                    <MdAccessTime />

                    <span>
                      {formattedTime}
                    </span>

                    <MdKeyboardArrowDown
                      className={
                        timePickerOpen
                          ? "time-arrow rotated"
                          : "time-arrow"
                      }
                    />

                  </button>

                  {timePickerOpen && (

                    <div className="custom-time-picker">

                      <div className="time-picker-header">

                        <div>

                          <span className="time-picker-title">
                            Choose a time
                          </span>

                          <span className="time-picker-subtitle">
                            When should your wish be sent?
                          </span>

                        </div>

                        <div className="time-preview">
                          {formattedTime}
                        </div>

                      </div>

                      <div className="time-selector">

                        {/* HOUR */}

                        <div className="time-column">

                          <button
                            type="button"
                            className="time-arrow-button"
                            onClick={
                              increaseHour
                            }
                          >
                            <MdKeyboardArrowUp />
                          </button>

                          <div className="time-value">
                            {String(
                              selectedHour
                            ).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <button
                            type="button"
                            className="time-arrow-button"
                            onClick={
                              decreaseHour
                            }
                          >
                            <MdKeyboardArrowDown />
                          </button>

                          <span className="time-label">
                            HOUR
                          </span>

                        </div>

                        <div className="time-colon">
                          :
                        </div>

                        {/* MINUTE */}

                        <div className="time-column">

                          <button
                            type="button"
                            className="time-arrow-button"
                            onClick={
                              increaseMinute
                            }
                          >
                            <MdKeyboardArrowUp />
                          </button>

                          <div className="time-value">
                            {String(
                              selectedMinute
                            ).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <button
                            type="button"
                            className="time-arrow-button"
                            onClick={
                              decreaseMinute
                            }
                          >
                            <MdKeyboardArrowDown />
                          </button>

                          <span className="time-label">
                            MIN
                          </span>

                        </div>

                        {/* AM PM */}

                        <div className="period-selector">

                          <button
                            type="button"
                            className={
                              selectedPeriod ===
                              "AM"
                                ? "period-button active"
                                : "period-button"
                            }
                            onClick={() =>
                              selectPeriod(
                                "AM"
                              )
                            }
                          >
                            AM
                          </button>

                          <button
                            type="button"
                            className={
                              selectedPeriod ===
                              "PM"
                                ? "period-button active"
                                : "period-button"
                            }
                            onClick={() =>
                              selectPeriod(
                                "PM"
                              )
                            }
                          >
                            PM
                          </button>

                        </div>

                      </div>

                      {/* QUICK TIME */}

                      <div className="quick-time-section">

                        <span>
                          QUICK SELECT
                        </span>

                        <div className="quick-time-options">

                          {[
                            {
                              hour: 9,
                              minute: 0,
                              period:
                                "AM" as const,
                            },
                            {
                              hour: 12,
                              minute: 0,
                              period:
                                "PM" as const,
                            },
                            {
                              hour: 3,
                              minute: 0,
                              period:
                                "PM" as const,
                            },
                            {
                              hour: 6,
                              minute: 0,
                              period:
                                "PM" as const,
                            },
                          ].map(
                            (time) => {

                              const isActive =
                                selectedHour ===
                                  time.hour &&
                                selectedMinute ===
                                  time.minute &&
                                selectedPeriod ===
                                  time.period;

                              return (
                                <button
                                  key={`${time.hour}-${time.minute}-${time.period}`}
                                  type="button"
                                  className={
                                    isActive
                                      ? "quick-time active"
                                      : "quick-time"
                                  }
                                  onClick={() =>
                                    updateTime(
                                      time.hour,
                                      time.minute,
                                      time.period
                                    )
                                  }
                                >

                                  {String(
                                    time.hour
                                  ).padStart(
                                    2,
                                    "0"
                                  )}

                                  :

                                  {String(
                                    time.minute
                                  ).padStart(
                                    2,
                                    "0"
                                  )}{" "}

                                  {time.period}

                                </button>
                              );
                            }
                          )}

                        </div>

                      </div>

                      <button
                        type="button"
                        className="time-done-button"
                        onClick={() =>
                          setTimePickerOpen(
                            false
                          )
                        }
                      >
                        Done
                      </button>

                    </div>

                  )}

                </div>

              </div>

            </div>

            {/* SCHEDULE PREVIEW */}

            <div className="schedule-preview">

              <div className="preview-icon">
                <MdSchedule />
              </div>

              <div>

                <span>
                  SCHEDULED FOR
                </span>

                <strong>
                  {formattedDate}
                </strong>

                <small>
                  at {formattedTime}
                </small>

              </div>

            </div>

            {/* REPEAT */}

            <div
              className={
                repeatYearly
                  ? "repeat-box active"
                  : "repeat-box"
              }
            >

              <div className="repeat-left">

                <div className="repeat-icon">
                  <MdRepeat />
                </div>

                <div>

                  <h3>
                    Repeat every year
                  </h3>

                  <p>
                    {repeatYearly
                      ? "This wish will repeat annually."
                      : "Automatically send this wish every year."
                    }
                  </p>

                </div>

              </div>

              <button
                type="button"
                className={
                  repeatYearly
                    ? "toggle active"
                    : "toggle"
                }
                onClick={() =>
                  setRepeatYearly(
                    !repeatYearly
                  )
                }
                aria-label="Repeat every year"
                aria-pressed={
                  repeatYearly
                }
              >
                <span></span>
              </button>

            </div>

            {/* YEARLY INFO */}

            {repeatYearly && (

              <div className="repeat-info">

                <MdRepeat />

                <span>

                  This wish will repeat every year on{" "}

                  <strong>
                    {yearlyDate}
                  </strong>.

                </span>

              </div>

            )}

          </section>

          {/* MESSAGE */}

          <section className="wish-card message-card">

            <div className="card-title-row">

              <div className="card-title-icon pink-bg">
                <MdMail />
              </div>

              <div>

                <h2>
                  Your Message
                </h2>

                <p>
                  Write something from the heart.
                </p>

              </div>

            </div>

            <div className="input-group">

              <label>
                Wish Message
              </label>

              <textarea
                placeholder="Write a beautiful birthday wish..."
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                rows={7}
                maxLength={1000}
              />

              <div className="character-count">
                {message.length} characters
              </div>

            </div>

          </section>

          {/* LIVE PREVIEW */}

          <section className="wish-card preview-card">

            <div className="preview-heading">

              <div>

                <p>
                  LIVE PREVIEW
                </p>

                <h2>
                  Your Wish
                </h2>

              </div>

              <div className="preview-status">

                <MdCheckCircle />

                <span>
                  Ready
                </span>

              </div>

            </div>

            <div className="wish-preview">

              <div className="preview-occasion-icon">
                {getOccasionIcon()}
              </div>

              <p className="preview-to">

                To{" "}

                <strong>
                  {personName ||
                    "Someone Special"}
                </strong>

              </p>

              <p className="preview-message">

                {message ||
                  "Your beautiful message will appear here..."
                }

              </p>

              <div className="preview-line"></div>

              <div className="preview-schedule">

                <span>

                  <MdCalendarMonth />

                  {formattedDate}

                </span>

                <span>

                  <MdAccessTime />

                  {formattedTime}

                </span>

                {repeatYearly && (

                  <span>

                    <MdRepeat />

                    Every year

                  </span>

                )}

              </div>

            </div>

          </section>

          {/* SUBMIT */}

          <div className="submit-section">

            <button
              type="submit"
              className="schedule-button"
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="spinner"></span>
                  Scheduling...
                </>

              ) : (

                <>
                  <MdSend />
                  Schedule Wish
                </>

              )}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default AddWish;