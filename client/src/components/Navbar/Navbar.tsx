import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

import smartwishTop from "../../assets/smartwish-top.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">

      {/* ========================================= */}
      {/* LOGO SECTION */}
      {/* ========================================= */}

      <div className="navbar-logo-section">

        {/* Image ABOVE the existing logo */}
        <img
          src={smartwishTop}
          alt="SmartWish"
          className="navbar-top-image"
        />

        {/* Existing logo */}
        <Link
          to="/dashboard"
          className="navbar-logo"
          onClick={closeMobileMenu}
        >
          <span className="navbar-logo-icon">🎁</span>

          <span className="navbar-logo-text">
            SmartWish
          </span>
        </Link>

      </div>

      {/* ========================================= */}
      {/* HAMBURGER */}
      {/* ========================================= */}

      <button
        className="navbar-mobile-button"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* ========================================= */}
      {/* NAVIGATION */}
      {/* ========================================= */}

      <div
        className={`navbar-links ${
          mobileOpen ? "navbar-links-open" : ""
        }`}
      >

        <Link
          to="/dashboard"
          className={`navbar-link ${
            isActive("/dashboard") ? "navbar-link-active" : ""
          }`}
          onClick={closeMobileMenu}
        >
          Dashboard
        </Link>

        <Link
          to="/calendar"
          className={`navbar-link ${
            isActive("/calendar") ? "navbar-link-active" : ""
          }`}
          onClick={closeMobileMenu}
        >
          Calendar
        </Link>

        <Link
          to="/add-wish"
          className={`navbar-link ${
            isActive("/add-wish") ? "navbar-link-active" : ""
          }`}
          onClick={closeMobileMenu}
        >
          Add Wish
        </Link>

        <button
          className="navbar-logout"
          onClick={() => {
            closeMobileMenu();
            handleLogout();
          }}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;