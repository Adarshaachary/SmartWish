import {
  useState,
} from "react";

import type { FormEvent } from "react";

import axios from "axios";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiSend,
  FiShield,
  FiStar,
} from "react-icons/fi";

import "./Login.css";


/* =========================================================
   API
========================================================= */

const API_URL =
  "http://192.168.1.5:5000/api";


/* =========================================================
   LOGIN RESPONSE
========================================================= */

interface LoginResponse {
  success: boolean;
  message: string;

  token?: string;

  user?: {
    id: number;
    name: string;
    email: string;
  };
}


/* =========================================================
   LOGIN
========================================================= */

function Login() {

  const navigate =
    useNavigate();


  /* =======================================================
     STATE
  ======================================================= */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =======================================================
     LOGIN SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (
      !email.trim() ||
      !password.trim()
    ) {

      setError(
        "Please enter your email and password."
      );

      return;
    }


    try {

      setLoading(true);


      /* ===================================================
         API REQUEST
      =================================================== */

      const response =
        await axios.post<LoginResponse>(
          `${API_URL}/auth/login`,
          {
            email:
              email.trim(),

            password,
          }
        );


      console.log(
        "Login response:",
        response.data
      );


      /* ===================================================
         SUCCESS
      =================================================== */

      if (
        response.data.success &&
        response.data.token
      ) {


        /* ================================================
           TOKEN
        ================================================ */

        localStorage.setItem(
          "smartwish_token",
          response.data.token
        );


        /* ================================================
           USER
        ================================================ */

        if (
          response.data.user
        ) {

          localStorage.setItem(
            "smartwish_user",
            JSON.stringify(
              response.data.user
            )
          );

        }


        /* ================================================
           ALSO KEEP OLD KEYS
        ================================================ */

        localStorage.setItem(
          "token",
          response.data.token
        );


        if (
          response.data.user
        ) {

          localStorage.setItem(
            "user",
            JSON.stringify(
              response.data.user
            )
          );

        }


        /* ================================================
           SUCCESS MESSAGE
        ================================================ */

        setSuccess(
          "Login successful! Redirecting..."
        );


        /* ================================================
           DASHBOARD
        ================================================ */

        setTimeout(() => {

          navigate(
            "/dashboard",
            {
              replace: true,
            }
          );

        }, 600);

      } else {

        setError(
          response.data.message ||
          "Invalid email or password."
        );

      }

    } catch (
      error: any
    ) {

      console.error(
        "Login error:",
        error
      );


      /* ================================================
         SERVER RESPONSE ERROR
      ================================================ */

      if (
        error?.response?.data?.message
      ) {

        setError(
          error.response.data.message
        );

      }


      /* ================================================
         SERVER NOT AVAILABLE
      ================================================ */

      else if (
        error?.request
      ) {

        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );

      }


      /* ================================================
         OTHER ERROR
      ================================================ */

      else {

        setError(
          "Something went wrong. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     UI
  ======================================================= */

  return (

    <div className="login-page">


      {/* ==================================================
          LEFT BRAND SECTION
      ================================================== */}

      <section className="login-brand-section">

        {/* BACKGROUND */}

        <div className="login-brand-background">

          <div className="login-orb login-orb-one" />

          <div className="login-orb login-orb-two" />

          <div className="login-orb login-orb-three" />

        </div>


        {/* BRAND CONTENT */}

        <div className="login-brand-content">


          {/* =================================================
              LOGO
          ================================================= */}

          <div className="login-logo">

            <div className="login-logo-icon">

              <FiSend />

            </div>

            <span>
              SmartWish
            </span>

          </div>


          {/* =================================================
              BRAND COPY
          ================================================= */}

          <div className="login-brand-copy">


            <div className="login-small-badge">

              <FiStar />

              <span>
                Smart wishes. Perfect timing.
              </span>

            </div>


            <h1>

              Never miss a

              <span>
                {" "}special moment.
              </span>

            </h1>


            <p>

              Schedule beautiful wishes for
              birthdays, anniversaries and
              every occasion that matters to you.

            </p>

          </div>


          {/* =================================================
              FEATURES
          ================================================= */}

          <div className="login-features">


            {/* FEATURE 1 */}

            <div className="login-feature">

              <div className="login-feature-icon">

                <FiSend />

              </div>


              <div>

                <strong>
                  Automatic Wishes
                </strong>

                <span>
                  Your wishes are sent at the
                  perfect time.
                </span>

              </div>

            </div>


            {/* FEATURE 2 */}

            <div className="login-feature">

              <div className="login-feature-icon">

                <FiShield />

              </div>


              <div>

                <strong>
                  Secure & Private
                </strong>

                <span>
                  Your personal information
                  stays protected.
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="login-brand-footer">

            Make every moment memorable.

          </div>

        </div>

      </section>


      {/* ==================================================
          RIGHT LOGIN SECTION
      ================================================== */}

      <section className="login-form-section">


        <div className="login-form-wrapper">


          {/* =================================================
              MOBILE LOGO
          ================================================= */}

          <div className="login-mobile-logo">

            <div className="login-logo-icon">

              <FiSend />

            </div>

            <span>
              SmartWish
            </span>

          </div>


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="login-header">


            <div className="login-header-icon">

              <FiMail />

            </div>


            <p className="login-eyebrow">

              Welcome back

            </p>


            <h2>

              Sign in to

              <span>
                {" "}SmartWish
              </span>

            </h2>


            <p className="login-description">

              Continue managing your scheduled
              wishes and special moments.

            </p>

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >


            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="login-field">

              <label htmlFor="email">

                Email Address

              </label>


              <div className="login-input-wrapper">

                <FiMail
                  className="login-input-icon"
                />


                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="login-field">


              <div className="login-label-row">

                <label htmlFor="password">

                  Password

                </label>

              </div>


              <div className="login-input-wrapper">

                <FiLock
                  className="login-input-icon"
                />


                <input
                  id="password"
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
                  autoComplete="current-password"
                  disabled={loading}
                />


                {/* SHOW / HIDE */}

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={loading}
                >

                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}

                </button>

              </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="login-message login-error">

                <span className="login-message-icon">
                  !
                </span>

                <span>
                  {error}
                </span>

              </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

              <div className="login-message login-success">

                <span className="login-message-icon">
                  ✓
                </span>

                <span>
                  {success}
                </span>

              </div>

            )}


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >

              {loading ? (

                <>

                  <span className="login-spinner" />

                  <span>
                    Signing in...
                  </span>

                </>

              ) : (

                <>

                  <span>
                    Sign In
                  </span>

                  <FiArrowRight />

                </>

              )}

            </button>

          </form>


          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>


            <Link to="/register">

              <span>
                Create Account
              </span>

              <FiArrowRight />

            </Link>

          </div>


          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="login-security">

            <FiShield />

            <span>
              Your connection is secure
            </span>

          </div>

        </div>

      </section>

    </div>

  );

}


export default Login;