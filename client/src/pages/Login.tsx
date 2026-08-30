import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdAutoAwesome,
  MdMail,
  MdLock,
  MdLogin,
  MdCheckCircle,
  MdArrowForward,
  MdSecurity,
} from "react-icons/md";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "error" | "success" | ""
  >("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    setMessageType("");

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      setMessageType("error");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      // ==================================================
      // LOGIN REQUEST
      // ==================================================

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      // ==================================================
      // READ RESPONSE
      // ==================================================

      const data = await response.json();

      console.log("================================");
      console.log("LOGIN RESPONSE");
      console.log(data);
      console.log("================================");

      // ==================================================
      // BACKEND ERROR
      // ==================================================

      if (!response.ok) {
        setMessage(
          data?.message || "Invalid email or password."
        );

        setMessageType("error");
        return;
      }

      // ==================================================
      // GET JWT TOKEN
      // ==================================================

      const token =
        data?.token ||
        data?.accessToken ||
        data?.jwt ||
        data?.data?.token;

      console.log(
        "JWT received:",
        Boolean(token)
      );

      if (!token) {
        console.error(
          "Login successful but no JWT was returned:",
          data
        );

        setMessage(
          "Login successful, but authentication token was not received."
        );

        setMessageType("error");
        return;
      }

      // ==================================================
      // GET USER
      // ==================================================

      const user =
        data?.user ||
        data?.data?.user ||
        null;

      // ==================================================
      // CLEAR OLD AUTH DATA
      // ==================================================

      localStorage.removeItem("smartwish_token");
      localStorage.removeItem("smartwish_user");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("smartwish_token");
      sessionStorage.removeItem("smartwish_user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // ==================================================
      // SAVE JWT
      // ==================================================

      localStorage.setItem(
        "smartwish_token",
        token
      );

      // Compatibility with existing SmartWish code
      localStorage.setItem(
        "token",
        token
      );

      // ==================================================
      // SAVE USER
      // ==================================================

      if (user) {
        localStorage.setItem(
          "smartwish_user",
          JSON.stringify(user)
        );

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      // ==================================================
      // VERIFY AUTH DATA
      // ==================================================

      console.log(
        "================================"
      );
      console.log("SMARTWISH AUTH STORAGE");
      console.log(
        "smartwish_token:",
        Boolean(
          localStorage.getItem(
            "smartwish_token"
          )
        )
      );
      console.log(
        "token:",
        Boolean(
          localStorage.getItem("token")
        )
      );
      console.log(
        "smartwish_user:",
        localStorage.getItem(
          "smartwish_user"
        )
      );
      console.log(
        "================================"
      );

      // ==================================================
      // SUCCESS
      // ==================================================

      setMessage(
        data?.message || "Login successful."
      );

      setMessageType("success");

      // ==================================================
      // GO TO DASHBOARD
      // ==================================================

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 500);
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setMessage(
        "Unable to connect to the server. Please make sure the SmartWish backend is running."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // ENTER KEY
  // ==================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Enter" &&
      !loading
    ) {
      handleLogin();
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="login-page">

      {/* ==================================================
          LEFT BRAND SECTION
      ================================================== */}

      <section className="login-brand-section">

        {/* BACKGROUND */}

        <div className="login-brand-background">
          <div className="login-orb login-orb-one"></div>
          <div className="login-orb login-orb-two"></div>
          <div className="login-orb login-orb-three"></div>
        </div>

        {/* BRAND CONTENT */}

        <div className="login-brand-content">

          {/* LOGO */}

          <div className="login-logo">
            <div className="login-logo-icon">
              <MdAutoAwesome />
            </div>

            <span>SmartWish</span>
          </div>

          {/* BRAND COPY */}

          <div className="login-brand-copy">

            <div className="login-small-badge">
              <MdAutoAwesome />
              <span>Make every moment special</span>
            </div>

            <h1>
              Never miss a
              <span>special moment.</span>
            </h1>

            <p>
              SmartWish helps you schedule beautiful
              messages for birthdays, anniversaries,
              and every occasion that matters.
            </p>

            {/* FEATURES */}

            <div className="login-features">

              <div className="login-feature">
                <div className="login-feature-icon">
                  <MdScheduleIcon />
                </div>

                <div>
                  <strong>Schedule ahead</strong>
                  <span>
                    Set the perfect date and time.
                  </span>
                </div>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  <MdAutoAwesome />
                </div>

                <div>
                  <strong>Beautiful wishes</strong>
                  <span>
                    Send meaningful messages automatically.
                  </span>
                </div>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  <MdCheckCircle />
                </div>

                <div>
                  <strong>Never forget</strong>
                  <span>
                    SmartWish remembers for you.
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* FOOTER */}

          <div className="login-brand-footer">
            © 2026 SmartWish. Make every wish count.
          </div>

        </div>
      </section>

      {/* ==================================================
          RIGHT FORM SECTION
      ================================================== */}

      <section className="login-form-section">

        <div className="login-form-wrapper">

          {/* MOBILE LOGO */}

          <div className="login-mobile-logo">

            <div className="login-logo-icon">
              <MdAutoAwesome />
            </div>

            <span>SmartWish</span>

          </div>

          {/* HEADER */}

          <div className="login-header">

            <div className="login-header-icon">
              <MdLogin />
            </div>

            <p className="login-eyebrow">
              WELCOME BACK
            </p>

            <h2>
              Login to{" "}
              <span>SmartWish</span>
            </h2>

            <p className="login-description">
              Login to continue scheduling beautiful
              wishes for the people who matter.
            </p>

          </div>

          {/* FORM */}

          <div className="login-form">

            {/* EMAIL */}

            <div className="login-field">

              <label htmlFor="login-email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <MdMail className="login-input-icon" />

                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoComplete="email"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="login-field">

              <div className="login-label-row">
                <label htmlFor="login-password">
                  Password
                </label>
              </div>

              <div className="login-input-wrapper">

                <MdLock className="login-input-icon" />

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "◉" : "○"}
                </button>

              </div>

            </div>

            {/* MESSAGE */}

            {message && (
              <div
                className={`login-message ${
                  messageType === "success"
                    ? "login-success"
                    : "login-error"
                }`}
              >

                <span className="login-message-icon">
                  {messageType === "success"
                    ? "✓"
                    : "!"}
                </span>

                <span>{message}</span>

              </div>
            )}

            {/* SUBMIT */}

            <button
              type="button"
              className="login-submit-button"
              onClick={handleLogin}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <MdLogin />
                  Login
                </>
              )}

            </button>

          </div>

          {/* REGISTER */}

          <p className="login-register">
            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
              <MdArrowForward />
            </Link>
          </p>

          {/* SECURITY */}

          <div className="login-security">
            <MdSecurity />
            <span>
              Your account is securely protected.
            </span>
          </div>

        </div>

      </section>

    </div>
  );
}

// Small helper icon so the existing CSS/layout remains unchanged.
function MdScheduleIcon() {
  return (
    <span
      style={{
        fontSize: "19px",
        lineHeight: 1,
      }}
    >
      ◷
    </span>
  );
}

export default Login;