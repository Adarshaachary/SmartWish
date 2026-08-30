import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiMail,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiArrowLeft,
  FiRefreshCw,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import "./EmailHistory.css";

/* =========================================
   TYPES
========================================= */

interface EventData {
  id?: number;

  userId?: number;

  senderName?: string;
  personName?: string;

  recipient?: string;
  email?: string;

  occasion?: string;
  title?: string;

  message?: string;

  status?: string;

  eventDate?: string;
  eventTime?: string;

  scheduled_at?: string;
  scheduledAt?: string;

  created_at?: string;
  createdAt?: string;

  sent_at?: string;
  sentAt?: string;
}

interface EmailItem {
  id: number;
  recipient: string;
  occasion: string;
  message: string;
  status: "Sent" | "Pending" | "Failed";
  time: string;
  date: string;
}

/* =========================================
   COMPONENT
========================================= */

function EmailHistory() {
  const navigate = useNavigate();

  const [emails, setEmails] =
    useState<EmailItem[]>([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  /* =========================================
     FETCH EMAIL HISTORY
  ========================================= */

  const fetchEmailHistory = async (
    showRefreshAnimation = false
  ) => {
    try {
      if (showRefreshAnimation) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /* =====================================
         GET LOGIN TOKEN
      ===================================== */

      const token =
        localStorage.getItem("token");

      console.log(
        "Email History Token:",
        token
          ? "TOKEN FOUND"
          : "NO TOKEN FOUND"
      );

      /* =====================================
         TOKEN CHECK
      ===================================== */

      if (!token) {
        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      /* =====================================
         API REQUEST
      ===================================== */

      const response = await fetch(
        "http://localhost:5000/api/events",
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

      /* =====================================
         AUTH ERROR
      ===================================== */

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      /* =====================================
         OTHER ERROR
      ===================================== */

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        "Email History API Response:",
        data
      );

      /* =====================================
         EXTRACT EVENTS
      ===================================== */

      const events: EventData[] =
        Array.isArray(data)
          ? data
          : Array.isArray(data.events)
          ? data.events
          : Array.isArray(data.data)
          ? data.data
          : [];

      /* =====================================
         FORMAT EMAIL HISTORY
      ===================================== */

      const formattedEmails: EmailItem[] =
        events.map(
          (
            event,
            index
          ) => {
            /* =============================
               DATE
            ============================= */

            let dateValue =
              event.sent_at ||
              event.sentAt ||
              event.scheduled_at ||
              event.scheduledAt ||
              event.created_at ||
              event.createdAt;

            /*
              If database has separate
              eventDate + eventTime,
              use them.
            */

            if (
              !dateValue &&
              event.eventDate
            ) {
              dateValue =
                event.eventTime
                  ? `${event.eventDate}T${event.eventTime}`
                  : event.eventDate;
            }

            const date =
              dateValue
                ? new Date(dateValue)
                : new Date();

            /* =============================
               STATUS
            ============================= */

            const originalStatus =
              String(
                event.status || ""
              ).toLowerCase();

            let status:
              | "Sent"
              | "Pending"
              | "Failed";

            if (
              originalStatus === "sent" ||
              originalStatus === "success" ||
              originalStatus === "completed"
            ) {
              status = "Sent";
            } else if (
              originalStatus === "failed" ||
              originalStatus === "error"
            ) {
              status = "Failed";
            } else {
              status = "Pending";
            }

            /* =============================
               RETURN ITEM
            ============================= */

            return {
              id:
                event.id ||
                index + 1,

              recipient:
                event.personName ||
                event.recipient ||
                event.email ||
                "Unknown recipient",

              occasion:
                event.occasion ||
                event.title ||
                "Custom Occasion",

              message:
                event.message ||
                "No message available",

              status,

              time:
                date.toLocaleTimeString(
                  [],
                  {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }
                ),

              date:
                date.toLocaleDateString(
                  [],
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                ),
            };
          }
        );

      setEmails(formattedEmails);
    } catch (err) {
      console.error(
        "Email history error:",
        err
      );

      setError(
        "Unable to load email history."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================
     INITIAL FETCH
  ========================================= */

  useEffect(() => {
    fetchEmailHistory();
  }, []);

  /* =========================================
     REFRESH
  ========================================= */

  const handleRefresh = () => {
    if (!refreshing) {
      fetchEmailHistory(true);
    }
  };

  /* =========================================
     SEARCH + FILTER
  ========================================= */

  const filteredEmails =
    useMemo(() => {
      return emails.filter(
        (email) => {
          const searchText =
            search
              .toLowerCase()
              .trim();

          const matchesSearch =
            email.recipient
              .toLowerCase()
              .includes(searchText) ||
            email.occasion
              .toLowerCase()
              .includes(searchText) ||
            email.message
              .toLowerCase()
              .includes(searchText);

          const matchesStatus =
            statusFilter === "All" ||
            email.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      emails,
      search,
      statusFilter,
    ]);

  /* =========================================
     COUNTS
  ========================================= */

  const sentCount =
    emails.filter(
      (email) =>
        email.status === "Sent"
    ).length;

  const pendingCount =
    emails.filter(
      (email) =>
        email.status === "Pending"
    ).length;

  const failedCount =
    emails.filter(
      (email) =>
        email.status === "Failed"
    ).length;

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="email-history-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="email-history-header">

        <div className="email-history-header-left">

          <button
            type="button"
            className="email-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <FiArrowLeft />

            <span>
              Back to Dashboard
            </span>
          </button>

          <div className="email-history-title-row">

            <div className="email-history-title-icon">
              <FiMail />
            </div>

            <div>
              <h1>
                Email History
              </h1>

              <p>
                View and track all your
                scheduled and sent wishes.
              </p>
            </div>

          </div>

        </div>

        <div className="email-history-header-icon">
          <FiMail />
        </div>

      </div>


      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="email-stats">

        {/* SENT */}

        <div className="email-stat-card">

          <div className="email-stat-icon sent">
            <FiCheckCircle />
          </div>

          <div className="email-stat-content">

            <span>
              Sent
            </span>

            <strong className="email-stat-number">
              {sentCount}
            </strong>

          </div>

        </div>


        {/* PENDING */}

        <div className="email-stat-card">

          <div className="email-stat-icon pending">
            <FiClock />
          </div>

          <div className="email-stat-content">

            <span>
              Pending
            </span>

            <strong className="email-stat-number">
              {pendingCount}
            </strong>

          </div>

        </div>


        {/* FAILED */}

        <div className="email-stat-card">

          <div className="email-stat-icon failed">
            <FiXCircle />
          </div>

          <div className="email-stat-content">

            <span>
              Failed
            </span>

            <strong className="email-stat-number">
              {failedCount}
            </strong>

          </div>

        </div>


        {/* TOTAL */}

        <div className="email-stat-card">

          <div className="email-stat-icon total">
            <FiMail />
          </div>

          <div className="email-stat-content">

            <span>
              Total
            </span>

            <strong className="email-stat-number">
              {emails.length}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          MAIN CARD
      ===================================== */}

      <div className="email-history-card">

        <div className="email-history-card-header">

          <div>
            <h2>
              Email History
            </h2>

            <p>
              Track your scheduled and sent
              wish notifications.
            </p>
          </div>

          {/* REFRESH BUTTON */}

          <button
            type="button"
            className={
              `email-refresh-button ${
                refreshing
                  ? "refreshing"
                  : ""
              }`
            }
            onClick={handleRefresh}
            disabled={
              refreshing ||
              loading
            }
          >
            <FiRefreshCw />

            <span>
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </span>
          </button>

        </div>


        {/* ===================================
            CONTROLS
        =================================== */}

        <div className="email-history-controls">

          <div className="email-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search recipient, occasion or message..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="email-status-filter"
          >

            <option value="All">
              All Status
            </option>

            <option value="Sent">
              Sent
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Failed">
              Failed
            </option>

          </select>

        </div>


        {/* ===================================
            LOADING
        =================================== */}

        {loading && (

          <div className="email-history-message">

            <div className="email-loader" />

            <p>
              Loading email history...
            </p>

          </div>

        )}


        {/* ===================================
            ERROR
        =================================== */}

        {!loading &&
          error && (

            <div className="email-history-message error-message">

              <FiAlertCircle />

              <p>
                {error}
              </p>

            </div>

          )}


        {/* ===================================
            EMPTY
        =================================== */}

        {!loading &&
          !error &&
          filteredEmails.length === 0 && (

            <div className="email-history-message">

              <FiMail />

              <p>
                No email history found.
              </p>

            </div>

          )}


        {/* ===================================
            EMAIL LIST
        =================================== */}

        {!loading &&
          !error &&
          filteredEmails.length > 0 && (

            <div className="email-history-list">

              {filteredEmails.map(
                (email) => (

                  <div
                    className="email-history-item"
                    key={email.id}
                  >

                    <div className="email-item-icon">
                      <FiMail />
                    </div>

                    <div className="email-item-main">

                      <div className="email-item-top">

                        <h3>
                          {email.occasion}
                        </h3>

                        <span
                          className={
                            `email-status ${
                              email.status.toLowerCase()
                            }`
                          }
                        >

                          {email.status ===
                            "Sent" && (
                              <FiCheckCircle />
                            )}

                          {email.status ===
                            "Pending" && (
                              <FiClock />
                            )}

                          {email.status ===
                            "Failed" && (
                              <FiXCircle />
                            )}

                          {email.status}

                        </span>

                      </div>

                      <p className="email-recipient">
                        To:{" "}
                        <strong>
                          {email.recipient}
                        </strong>
                      </p>

                      <p className="email-message">
                        {email.message}
                      </p>

                      <div className="email-item-time">

                        <FiClock />

                        <span>
                          {email.time}
                          {" • "}
                          {email.date}
                        </span>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </div>

    </div>
  );
}

export default EmailHistory;