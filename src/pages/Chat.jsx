import { useEffect, useRef, useState, useCallback } from "react";
import "../css/Chat.css";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Chat({ setToken }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [text, setText] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [sending, setSending] = useState(false);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const debounceRef = useRef(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // Agar token nahi hai to home pe bhejo
    useEffect(() => {
        if (!token) navigate("/");
    }, [token]);

    const fetchCurrentUser = useCallback(async () => {
        try {
            const res = await fetch(`${API}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                localStorage.removeItem("token");
                navigate("/");
                return;
            }
            const data = await res.json();
            setCurrentUser(data);
        } catch (err) {
            console.log(err);
        }
    }, [token]);

    const fetchUsers = useCallback(async (q) => {
        try {
            const res = await fetch(`${API}/api/users?search=${q}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.log(err);
        }
    }, [token]);

    useEffect(() => {
        fetchCurrentUser();
        fetchUsers("");

        socketRef.current = io(API, { transports: ["websocket"] });

        socketRef.current.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => socketRef.current.disconnect();
    }, []);

    useEffect(() => {
        if (currentUser && socketRef.current) {
            socketRef.current.emit("join", currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchUsers(search), 400);
    }, [search]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const getInitials = (name) =>
        name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const openChat = async (user) => {
        setSelectedUser(user);
        setShowChat(true);
        setMessages([]);
        try {
            const res = await fetch(`${API}/api/conversations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ receiverId: user._id })
            });
            const data = await res.json();
            setConversationId(data._id);
            const msgRes = await fetch(`${API}/api/messages/${data._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const msgs = await msgRes.json();
            setMessages(msgs);
        } catch (err) {
            console.log(err);
        }
    };

    const sendMessage = async () => {
        if (!text.trim() || sending) return;
        setSending(true);
        const msgText = text;
        setText("");

        // Optimistic UI - turant dikhao
        const tempMsg = {
            _id: "temp_" + Date.now(),
            text: msgText,
            sender: { _id: currentUser._id },
            pending: true
        };
        setMessages((prev) => [...prev, tempMsg]);

        try {
            const res = await fetch(`${API}/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ conversationId, text: msgText })
            });
            const newMessage = await res.json();

            // temp message ko real se replace karo
            setMessages((prev) =>
                prev.map((m) => m._id === tempMsg._id ? newMessage : m)
            );

            socketRef.current.emit("sendMessage", {
                ...newMessage,
                receiverId: selectedUser._id
            });
        } catch (err) {
            // fail hone pe temp message remove karo
            setMessages((prev) => prev.filter((m) => m._id !== tempMsg._id));
            setText(msgText);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="chat-page">

            {/* SIDEBAR */}
            <div className={`sidebar ${showChat ? "hide-mobile" : ""}`}>
                <div className="sidebar-header">
                    <h2>💬 Chats</h2>
                    <button className="signout-btn" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="🔍 Search users..."
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="user-list">
                    {users
                        .filter((u) => u._id !== currentUser?._id)
                        .map((user) => (
                            <div
                                key={user._id}
                                className={`user-card ${selectedUser?._id === user._id ? "active" : ""}`}
                                onClick={() => openChat(user)}
                            >
                                <div className="avatar">
                                    {getInitials(user.name)}
                                </div>
                                <div className="user-info">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-username">@{user.username}</span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* CHAT AREA */}
            <div className={`chat-area ${showChat ? "show-mobile" : ""}`}>
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <button className="back-btn" onClick={() => setShowChat(false)}>
                                ←
                            </button>
                            <div className="avatar">{getInitials(selectedUser.name)}</div>
                            <div>
                                <h3>{selectedUser.name}</h3>
                                <span className="online-status">Online</span>
                            </div>
                        </div>

                        <div className="messages">
                            {messages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={
                                        msg.sender?._id === currentUser?._id
                                            ? `message my-message${msg.pending ? " pending" : ""}`
                                            : "message other-message"
                                    }
                                >
                                    <span>{msg.text}</span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="message-input">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button onClick={sendMessage} disabled={sending}>
                                ➤
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="empty-chat">
                        <div className="empty-chat-content">
                            <div className="empty-icon">💬</div>
                            <h3>Welcome to FlixerChat</h3>
                            <p>Select a user to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
