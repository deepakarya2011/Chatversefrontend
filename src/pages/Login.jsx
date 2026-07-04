import "../css/Login.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();
   const handleLogin = async (e) => {

    e.preventDefault();

    try {

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        console.log(data);

        if (response.ok) {

            console.log("Login Success");

            localStorage.setItem(
                "token",
                data.token
            );

            alert("Login Successful");

            navigate("/chat");

        }

    } catch (error) {

        console.log(error);

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

                    <button type="submit">
                        Login
                    </button>

                </form>

                <div className="bottom-text">

                    Don't have an account?

                    <span>
                        Register
                    </span>

                </div>

            </div>

        </div>
        </>
    );
}

export default Login;