import { useEffect, useState } from "react";
import {
  MdPerson,
  MdEmail,
  MdEdit,
  MdCheckCircle,
  MdLogout,
  MdArrowBack,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

import "./Profile.css";

interface User {
  id?: number;
  userId?: number;
  name?: string;
  email?: string;
}

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    name: "",
    email: "",
  });

  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  /* =========================================================
     GET SAVED USER
  ========================================================= */

  useEffect(() => {
    const localUser = localStorage.getItem("smartwish_user");
    const sessionUser = sessionStorage.getItem("smartwish_user");

    const storedUser = localUser || sessionUser;

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUser);

      setUser(parsedUser);
      setName(parsedUser.name || "");
    } catch (error) {
      console.error("Unable to read saved user:", error);

      localStorage.removeItem("smartwish_user");
      sessionStorage.removeItem("smartwish_user");

      navigate("/login");
    }
  }, [navigate]);

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const handleSaveProfile = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const updatedUser: User = {
      ...user,
      name: trimmedName,
    };

    setUser(updatedUser);

    /*
     * Update whichever storage currently contains
     * the logged-in user.
     */

    if (localStorage.getItem("smartwish_user")) {
      localStorage.setItem(
        "smartwish_user",
        JSON.stringify(updatedUser)
      );
    }

    if (sessionStorage.getItem("smartwish_user")) {
      sessionStorage.setItem(
        "smartwish_user",
        JSON.stringify(updatedUser)
      );
    }

    setIsEditing(false);
  };

  /* =========================================================
     CANCEL EDIT
  ========================================================= */

  const handleCancelEdit = () => {
    setName(user.name || "");
    setIsEditing(false);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("smartwish_token");
    localStorage.removeItem("smartwish_user");

    sessionStorage.removeItem("smartwish_token");
    sessionStorage.removeItem("smartwish_user");

    navigate("/login", { replace: true });
  };

  /* =========================================================
     INITIALS
  ========================================================= */

  const getInitials = () => {
    const currentName = user.name?.trim() || "User";

    const words = currentName
      .split(/\s+/)
      .filter(Boolean);

    if (words.length >= 2) {
      return (
        words[0].charAt(0) +
        words[1].charAt(0)
      ).toUpperCase();
    }

    return currentName.charAt(0).toUpperCase();
  };

  return (
    <main className="profile-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="profile-header">

        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <MdArrowBack />

          <span>
            Back to Dashboard
          </span>
        </button>

        <div className="profile-heading">

          <div>

            <p className="profile-eyebrow">
              SMARTWISH
            </p>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your SmartWish account information.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="profile-content">

        {/* ===================================================
            PROFILE CARD
        =================================================== */}

        <section className="profile-card">

          <div className="profile-card-top">

            <div className="profile-avatar">
              {getInitials()}
            </div>

            <div className="profile-user-heading">

              <h2>
                {user.name || "SmartWish User"}
              </h2>

              <p>
                {user.email || "No email available"}
              </p>

              <div className="profile-status">

                <MdCheckCircle />

                <span>
                  Active Account
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div className="profile-information">

            <div className="profile-section-heading">

              <div>

                <h3>
                  Personal Information
                </h3>

                <p>
                  Your basic account details
                </p>

              </div>

              {!isEditing && (
                <button
                  type="button"
                  className="profile-edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  <MdEdit />

                  <span>
                    Edit Profile
                  </span>
                </button>
              )}

            </div>


            {/* =================================================
                NAME
            ================================================= */}

            <div className="profile-field">

              <label>
                <MdPerson />

                <span>
                  Full Name
                </span>
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  autoComplete="name"
                />
              ) : (
                <div className="profile-value">
                  {user.name || "Not provided"}
                </div>
              )}

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="profile-field">

              <label>
                <MdEmail />

                <span>
                  Email Address
                </span>
              </label>

              <div className="profile-value">
                {user.email || "Not provided"}
              </div>

              <p className="profile-field-note">
                Your email address is used for
                SmartWish account communication.
              </p>

            </div>


            {/* =================================================
                EDIT ACTIONS
            ================================================= */}

            {isEditing && (
              <div className="profile-edit-actions">

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="profile-save-button"
                  onClick={handleSaveProfile}
                  disabled={!name.trim()}
                >
                  <MdCheckCircle />

                  <span>
                    Save Changes
                  </span>

                </button>

              </div>
            )}

          </div>

        </section>


        {/* ===================================================
            ACCOUNT STATUS
        =================================================== */}

        <section className="profile-account-card">

          <div className="profile-account-icon">
            <MdCheckCircle />
          </div>

          <div className="profile-account-text">

            <h3>
              SmartWish Account
            </h3>

            <p>
              Your account is ready to schedule
              and manage wishes.
            </p>

          </div>

          <div className="profile-account-status">
            Active
          </div>

        </section>


        {/* ===================================================
            LOGOUT
        =================================================== */}

        <section className="profile-logout-card">

          <div>

            <h3>
              Sign out of SmartWish
            </h3>

            <p>
              You will need to log in again to
              access your account.
            </p>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="profile-logout-button"
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

export default Profile;