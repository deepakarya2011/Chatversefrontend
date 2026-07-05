import "../css/Login.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Login({ setToken }) {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            let response;
            for (let i = 0; i < 3; i++) {
                try {
                    response = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/auth/login`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, password })
                        }
                    );
                    break;
                } catch {
                    if (i === 2) throw new Error("Server not responding");
                    await new Promise(r => setTimeout(r, 3000));
                }
            }
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                navigate("/chat");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Server is starting up, please try again in 30 seconds.");
        } finally {
            setLoading(false);
        }
    };

    return (

        <>
        <Navbar/>
        <div className="login-page">

            <div className="blur blur1"></div>
            <div className="blur blur2"></div>

            <div className="login-content">

                <h1>Welcome Back 👋</h1>

                <p>
                    Sign in to continue chatting with your friends
                </p>

                <form className="login-form" onSubmit={handleLogin}>

                    {error && <p className="error-msg">{error}</p>}

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="password-field">

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <span
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >

                            {
                                showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                            }

                        </span>

                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Connecting... please wait" : "Login"}
                    </button>

                </form>

                <div className="bottom-text">
                    Don't have an account?
                    <span onClick={() => navigate("/register")}>Register</span>
                </div>

            </div>

        </div>
        </>
    );
}

export default Login;