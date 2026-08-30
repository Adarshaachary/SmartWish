import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">

      <div className="home-card">

        <h1 className="logo">
          ✨ SmartWish
        </h1>

        <h2>
          Make Every Moment Special 💌
        </h2>

        <p className="subtitle">
          Schedule personalized wishes for birthdays,
          anniversaries and special occasions.
        </p>

        <div className="button-group">

          <Link to="/login">
            <button className="home-btn">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="home-btn">
              Register
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Home;