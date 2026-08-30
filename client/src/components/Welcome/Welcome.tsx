import {
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { getUser } from "../../utils/auth";

import "./Welcome.css";


function Welcome() {


  const navigate = useNavigate();


  /* Get logged-in user */

  const user = getUser();


  /*
    Example:

    SmartWish User
    ↓
    SmartWish
  */

  const firstName =
    user?.name?.split(" ")[0] || "User";


  return (

    <section className="welcome-banner">


      {/* ========================= */}
      {/* Welcome Content */}
      {/* ========================= */}

      <div className="welcome-content">


        {/* Badge */}

        <div className="welcome-badge">

          <span>
            ✨
          </span>

          SmartWish

        </div>


        {/* Dynamic Name */}

        <h1>

          👋 Welcome Back, {firstName}!

        </h1>


        <p>

          Manage birthdays, anniversaries and
          special occasions from one beautiful dashboard.

        </p>


        {/* Buttons */}

        <div className="welcome-actions">


          {/* Add Wish */}

          <button
            className="welcome-add-btn"
            type="button"
            onClick={() =>
              navigate("/add-wish")
            }
          >

            <FiPlus />

            <span>
              Add Wish
            </span>

          </button>


          {/* View Events */}

          <button
            className="welcome-events-btn"
            type="button"
            onClick={() =>
              navigate("/upcoming-events")
            }
          >

            <span>
              View Events
            </span>

            <FiArrowRight />

          </button>


        </div>


      </div>


      {/* ========================= */}
      {/* Decorative Illustration */}
      {/* ========================= */}

      <div className="welcome-decoration">


        <div className="decoration-glow"></div>


        {/* Birthday */}

        <div className="decoration-circle circle-one">
          🎂
        </div>


        {/* Message */}

        <div className="decoration-circle circle-two">
          💌
        </div>


        {/* Celebration */}

        <div className="decoration-circle circle-three">
          🎉
        </div>


        {/* Main Gift */}

        <div className="main-gift">
          🎁
        </div>


        {/* Stars */}

        <div className="floating-star star-one">
          ✦
        </div>


        <div className="floating-star star-two">
          ✧
        </div>


        <div className="floating-star star-three">
          ✦
        </div>


      </div>


    </section>

  );
}


export default Welcome;