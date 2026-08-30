import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =========================================
   PAGES
========================================= */

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddWish from "./pages/AddWish";
import UpdateAccount from "./pages/UpdateAccount";
import UpcomingEvents from "./pages/UpcomingEvents";

/* =========================================
   COMPONENTS
========================================= */

import Profile from "./components/Profile";

/* =========================================
   EMAIL HISTORY
========================================= */

import EmailHistory from "./EmailHistory/EmailHistory";

/* =========================================
   APP
========================================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================
            DEFAULT ROUTE
        ===================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* =====================================
            AUTHENTICATION
        ===================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =====================================
            HOME
        ===================================== */}

        <Route
          path="/home"
          element={<Home />}
        />


        {/* =====================================
            DASHBOARD
        ===================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* =====================================
            ADD WISH
        ===================================== */}

        <Route
          path="/add-wish"
          element={<AddWish />}
        />


        {/* =====================================
            UPCOMING EVENTS
        ===================================== */}

        <Route
          path="/upcoming-events"
          element={<UpcomingEvents />}
        />


        {/* =====================================
            EMAIL HISTORY
        ===================================== */}

        <Route
          path="/email-history"
          element={<EmailHistory />}
        />


        {/* =====================================
            PROFILE
        ===================================== */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* =====================================
            ACCOUNT
        ===================================== */}

        <Route
          path="/account"
          element={<UpdateAccount />}
        />


        {/* =====================================
            UNKNOWN ROUTES
        ===================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;