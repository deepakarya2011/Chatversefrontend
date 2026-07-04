import "../css/Home.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

<Link to="/" className="logo">
   ChatVerse
</Link>

      <div className="nav-links">

        <Link to="/login">
          <button className="login-btn">
            Login
          </button>
        </Link>
        

        <Link to="/register">
          <button className="register-btn">
            Register
          </button>
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;