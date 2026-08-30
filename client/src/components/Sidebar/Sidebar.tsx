import {
  MdDashboard,
  MdAddCircle,
  MdCalendarMonth,
  MdEmail,
  MdPerson,
  MdAccountCircle,
  MdLogout,
} from "react-icons/md";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  /* =========================================
     ACTIVE ROUTE
  ========================================= */

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem("smartwish_token");
    localStorage.removeItem("smartwish_user");

    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* =======================================
          NAVIGATION
      ======================================= */}

      <nav className="sidebar-navigation">

        <p className="sidebar-section-title">
        </p>


        {/* =====================================
            DASHBOARD
        ===================================== */}

        <Link
          to="/dashboard"
          className={
            isActive("/dashboard")
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <MdDashboard />

          <span>
            Dashboard
          </span>
        </Link>


        {/* =====================================
            ADD WISH
        ===================================== */}

        <Link
          to="/add-wish"
          className={
            isActive("/add-wish")
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <MdAddCircle />

          <span>
            Add Wish
          </span>
        </Link>


        {/* =====================================
            UPCOMING EVENTS
        ===================================== */}

        <Link
          to="/upcoming-events"
          className={
            isActive("/upcoming-events")
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <MdCalendarMonth />

          <span>
            Upcoming Events
          </span>
        </Link>


        {/* =====================================
            EMAIL HISTORY
        ===================================== */}

        <Link
          to="/email-history"
          className={
            isActive("/email-history")
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <MdEmail />

          <span>
            Email History
          </span>
        </Link>


        {/* =====================================
            PROFILE
        ===================================== */}

        <Link
          to="/profile"
          className={
            isActive("/profile")
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <MdPerson />

          <span>
            Profile
          </span>
        </Link>


        {/* =====================================
            ACCOUNT
        ===================================== */}

        <Link
          to="/account"
          className={
            isActive("/account")
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <MdAccountCircle />

          <span>
            Account
          </span>
        </Link>

      </nav>


      {/* =======================================
          LOGOUT
      ======================================= */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <MdLogout />

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;