import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  // ==================================================
  // STATE
  // ==================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ==================================================
  // REGISTER USER
  // ==================================================

  const handleRegister = async () => {
    setMessage("");

    // ------------------------------------------
    // Validation
    // ------------------------------------------

    if (!name.trim() || !email.trim() || !password) {
      setMessage("Please fill all the fields.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // ------------------------------------------
      // SEND REQUEST TO RENDER BACKEND
      // ------------------------------------------

      const response = await fetch(
        "https://smartwish-6n3e.onrender.com/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      // ------------------------------------------
      // READ RESPONSE
      // ------------------------------------------

      const data = await response.json();

      console.log("Register response:", data);

      // ------------------------------------------
      // SHOW MESSAGE
      // ------------------------------------------

      setMessage(data.message || "Registration completed.");

      // ------------------------------------------
      // REGISTRATION SUCCESS
      // ------------------------------------------

      if (response.ok && data.success) {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="register-container">
      <div className="register-card">

        {/* LOGO */}

        <div className="logo">
          ✨ SmartWish
        </div>

        {/* TITLE */}

        <h1>Create Your Account</h1>

        <p className="subtitle">
          Never miss a special moment. Schedule heartfelt wishes for birthdays,
          anniversaries and celebrations.
        </p>

        {/* NAME */}

        <div className="input-box">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={loading}
          />
        </div>

        {/* EMAIL */}

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
          />
        </div>

        {/* PASSWORD */}

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
          />
        </div>

        {/* TERMS */}

        <div className="terms">
          <label>
            <input type="checkbox" />
            {" "}I agree to the Terms & Conditions
          </label>
        </div>

        {/* REGISTER BUTTON */}

        <button
          className="register-btn"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* MESSAGE */}

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        {/* LOGIN */}

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;