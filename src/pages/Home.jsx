import Navbar from "../components/Navbar";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";


function Home() {
    const navigate = useNavigate();
    return (
        <div className="home">

             <Navbar />

            <section className="hero">

                <div className="hero-content">

                    <h1>
                        Connect.
                        <br />
                        Chat.
                        <br />
                        Anywhere.
                    </h1>

                    <p>
                        Real-time messaging platform for connecting
                        with friends, teams and communities.
                    </p>

                    <button className="start-chat-btn" onClick={() => navigate("/register")}>
                        Start Chat
                    </button>

                </div>

            </section>

            {/* Animated circles */}

            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>

        </div>
    );
}

export default Home;