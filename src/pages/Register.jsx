import { useState } from "react";
import "../css/Register.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Register() {

    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {

        e.preventDefault();

        if (
            !name ||
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            setError("Please fill all fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        username,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();
          
            console.log(data);

              if (response.ok) {

                alert("Registration Successful");

                navigate("/login");

            }


        } catch (error) {

            console.log(error);

        }

    };


    return (

        <>

            <Navbar />

            <div className="register-page">

                <div className="blur blur1"></div>
                <div className="blur blur2"></div>

                <div className="register-content">

                    <h1>Create Account</h1>

                    <p>
                        Join ChatVerse and start chatting instantly
                    </p>

                    {
                        error && (
                            <p className="error-msg">
                                {error}
                            </p>
                        )
                    }


                    <form


                        className="register-form"
                        onSubmit={handleRegister}
                    >

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                        />

                        <button type="submit">
                            Create Account
                        </button>

                    </form>

                </div>

            </div>
        </>
    );
}

export default Register;