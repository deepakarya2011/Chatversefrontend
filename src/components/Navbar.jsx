import "../css/Home.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

<Link to="/" className="logo">
   ChatVerse
</Link>

      <div className="nav-links">
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/register" className="register-btn">Register</Link>
      </div>

    </nav>
  );
}

export default Navbar;