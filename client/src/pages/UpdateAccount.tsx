import { useEffect, useState } from "react";
import {
  MdPerson,
  MdEmail,
  MdVerified,
  MdArrowBack,
  MdLogout,
  MdRefresh,
  MdSecurity,
  MdCalendarMonth,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

import "./UpdateAccount.css";

interface User {
  id?: number;
  name?: string;
  email?: string;
}

function UpdateAccount() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    id: undefined,
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  /* =========================================
     LOAD USER
  ========================================= */

  const loadUser = () => {
    setLoading(true);

    try {
      /*
       * Check localStorage first.
       * If Remember Me was not selected,
       * check sessionStorage.
       */

      const storedUser =
        localStorage.getItem("smartwish_user") ||
        sessionStorage.getItem("smartwish_user");

      if (storedUser) {
        const parsedUser: User =
          JSON.parse(storedUser);

        setUser({
          id: parsedUser.id,
          name: parsedUser.name || "",
          email: parsedUser.email || "",
        });
      } else {
        /*
         * No user information found.
         */
        setUser({
          id: undefined,
          name: "",
          email: "",
        });
      }
    } catch (error) {
      console.error(
        "Unable to load account information:",
        error
      );

      setUser({
        id: undefined,
        name: "",
        email: "",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    loadUser();
  }, []);

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem("smartwish_token");
    localStorage.removeItem("smartwish_user");

    sessionStorage.removeItem("smartwish_token");
    sessionStorage.removeItem("smartwish_user");

    navigate("/login");
  };

  /* =========================================
     INITIALS
  ========================================= */

  const getInitials = () => {
    const currentName =
      user.name?.trim() || "User";

    const words = currentName
      .split(/\s+/)
      .filter(Boolean);

    if (words.length >= 2) {
      return (
        words[0].charAt(0) +
        words[1].charAt(0)
      ).toUpperCase();
    }

    return currentName
      .charAt(0)
      .toUpperCase();
  };

  /* =========================================
     ACCOUNT STATUS
  ========================================= */

  const isLoggedIn =
    Boolean(
      localStorage.getItem("smartwish_token") ||
      sessionStorage.getItem("smartwish_token")
    );

  /* =========================================
     RENDER
  ========================================= */

  return (
    <main className="account-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="account-header">

        <button
          type="button"
          className="account-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <MdArrowBack />

          <span>
            Back to Dashboard
          </span>
        </button>


        <div className="account-heading">

          <p className="account-eyebrow">
            SMARTWISH
          </p>

          <h1>
            Account
          </h1>

          <p>
            View and manage your SmartWish
            account information.
          </p>

        </div>

      </div>


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="account-content">

        {/* ===================================
            ACCOUNT OVERVIEW
        =================================== */}

        <section className="account-card">

          <div className="account-card-header">

            <div>

              <p className="account-card-eyebrow">
                ACCOUNT OVERVIEW
              </p>

              <h2>
                Your SmartWish Account
              </h2>

              <p>
                Your account information currently
                stored by SmartWish.
              </p>

            </div>


            <button
              type="button"
              className="account-refresh-button"
              onClick={loadUser}
              disabled={loading}
              title="Refresh account information"
            >
              <MdRefresh
                className={
                  loading
                    ? "account-refresh spinning"
                    : "account-refresh"
                }
              />

              <span>
                Refresh
              </span>
            </button>

          </div>


          {/* =================================
              USER PROFILE
          ================================= */}

          <div className="account-profile">

            <div className="account-avatar">
              {getInitials()}
            </div>


            <div className="account-profile-info">

              <h3>
                {loading
                  ? "Loading..."
                  : user.name || "SmartWish User"}
              </h3>

              <p>
                {loading
                  ? "Please wait..."
                  : user.email ||
                    "No email available"}
              </p>


              <div className="account-active-status">

                <MdVerified />

                <span>
                  {isLoggedIn
                    ? "Active Account"
                    : "Not signed in"}
                </span>

              </div>

            </div>

          </div>


          {/* =================================
              INFORMATION
          ================================= */}

          <div className="account-information">

            {/* NAME */}

            <div className="account-information-item">

              <div className="account-information-icon">
                <MdPerson />
              </div>

              <div className="account-information-text">

                <span>
                  Full Name
                </span>

                <strong>
                  {loading
                    ? "Loading..."
                    : user.name ||
                      "Not provided"}
                </strong>

              </div>

            </div>


            {/* EMAIL */}

            <div className="account-information-item">

              <div className="account-information-icon">
                <MdEmail />
              </div>

              <div className="account-information-text">

                <span>
                  Email Address
                </span>

                <strong>
                  {loading
                    ? "Loading..."
                    : user.email ||
                      "Not provided"}
                </strong>

              </div>

            </div>


            {/* ACCOUNT ID */}

            <div className="account-information-item">

              <div className="account-information-icon">
                <MdSecurity />
              </div>

              <div className="account-information-text">

                <span>
                  Account ID
                </span>

                <strong>
                  {loading
                    ? "Loading..."
                    : user.id
                    ? `#${user.id}`
                    : "Not available"}
                </strong>

              </div>

            </div>


            {/* ACCOUNT STATUS */}

            <div className="account-information-item">

              <div className="account-information-icon">
                <MdVerified />
              </div>

              <div className="account-information-text">

                <span>
                  Account Status
                </span>

                <strong className="account-status-text">
                  {isLoggedIn
                    ? "Active"
                    : "Not signed in"}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================
            ACCOUNT FEATURES
        ===================================== */}

        <section className="account-features-card">

          <div className="account-features-heading">

            <div className="account-feature-main-icon">
              <MdCalendarMonth />
            </div>

            <div>

              <h2>
                SmartWish Features
              </h2>

              <p>
                Your account gives you access to
                SmartWish scheduling features.
              </p>

            </div>

          </div>


          <div className="account-features-grid">

            <div className="account-feature">

              <div className="account-feature-icon">
                <MdCalendarMonth />
              </div>

              <div>

                <h3>
                  Schedule Wishes
                </h3>

                <p>
                  Create and schedule wishes for
                  important occasions.
                </p>

              </div>

            </div>


            <div className="account-feature">

              <div className="account-feature-icon">
                <MdEmail />
              </div>

              <div>

                <h3>
                  Email History
                </h3>

                <p>
                  Keep track of wishes that have
                  been sent.
                </p>

              </div>

            </div>


            <div className="account-feature">

              <div className="account-feature-icon">
                <MdVerified />
              </div>

              <div>

                <h3>
                  Account Access
                </h3>

                <p>
                  Your SmartWish account is ready
                  to manage your events.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================
            LOGOUT
        ===================================== */}

        <section className="account-logout-card">

          <div className="account-logout-info">

            <div className="account-logout-icon">
              <MdLogout />
            </div>

            <div>

              <h2>
                Sign out of SmartWish
              </h2>

              <p>
                You will need to sign in again to
                access your SmartWish account.
              </p>

            </div>

          </div>


          <button
            type="button"
            className="account-logout-button"
            onClick={handleLogout}
          >
            <MdLogout />

            <span>
              Logout
            </span>

          </button>

        </section>

      </div>

    </main>
  );
}

export default UpdateAccount;