import { useEffect, useRef, useState } from "react";
import "../css/Chat.css";
import { io } from "socket.io-client";

function Chat() {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [text, setText] = useState("");
    const socketRef = useRef(null);


    const fetchUsers = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/users?search=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            setUsers(data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchUsers();

    }, [search]);

    const getInitials = (name) => {

        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();

    };

    const fetchCurrentUser = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/me`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            setCurrentUser(data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        if (
            currentUser &&
            socketRef.current
        ) {

            socketRef.current.emit(
                "join",
                currentUser._id
            );

            console.log(
                "Joined Room:",
                currentUser._id
            );

        }

    }, [currentUser]);

    useEffect(() => {

        socketRef.current =
            io(import.meta.env.VITE_API_URL);

        socketRef.current.on(
            "receiveMessage",
            (message) => {

                setMessages(
                    (prev) => [
                        ...prev,
                        message
                    ]
                );

            }
        );

        return () => {

            socketRef.current.disconnect();

        };

    }, []);

    useEffect(() => {

        fetchCurrentUser();

    }, []);

    const openChat = async (user) => {

        setSelectedUser(user);

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${import.meta.env.VITE_API_URL}/api/conversations`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            receiverId:
                                user._id
                        })
                    }
                );

            const data =
                await response.json();

            setConversationId(
                data._id
            );

            fetchMessages(
                data._id
            );

        } catch (error) {

            console.log(error);

        }

    };

    const fetchMessages =
        async (id) => {

            try {

                const token =
                    localStorage.getItem("token");

                const response =
                    await fetch(
                        `${import.meta.env.VITE_API_URL}/api/messages/${id}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                const data =
                    await response.json();

                setMessages(data);

            } catch (error) {

                console.log(error);

            }

        };

    const sendMessage = async () => {

        if (!text.trim()) return;

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/messages`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        conversationId,

                        text

                    })
                }
            );

            const newMessage =
                await response.json();

            socketRef.current.emit(
                "sendMessage",
                {

                    ...newMessage,

                    receiverId:
                        selectedUser._id

                }
            );

            setMessages(
                (prev) => [
                    ...prev,
                    newMessage
                ]
            );

            setText("");

        } catch (error) {

            console.log(error);

        }

    };
    const messagesEndRef = useRef(null);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    return (

        <div className="chat-page">

            <div className="sidebar">

                <h2>Chats</h2>

                <input
                    type="text"
                    placeholder="Search user..."
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="user-list">

                    {
                        users
                            .filter(
                                user => user._id !== currentUser?._id
                            )
                            .map((user) => (

                                <div
                                    key={user._id}
                                    className="user-card"
                                    onClick={() => openChat(user)}
                                >

                                    <div className="avatar">

                                        {getInitials(user.name)}

                                    </div>

                                    <span>
                                        {user.name}
                                    </span>

                                </div>

                            ))
                    }

                </div>

            </div>

            <div className="chat-area">

                {
                    selectedUser ? (

                        <div className="chat-placeholder">

                            <div className="chat-header">

                                <div className="avatar">

                                    {getInitials(selectedUser.name)}

                                </div>

                                <h2>
                                    {selectedUser.name}
                                </h2>

                            </div>

                            <div className="messages">

                                {
                                    messages.map((msg) => (

                                        <div
                                            key={msg._id}
                                            className={
                                                msg.sender?._id === currentUser?._id
                                                    ? "message my-message"
                                                    : "message other-message"
                                            }
                                        >
                                            {msg.text}
                                        </div>

                                    ))
                                }
                                <div ref={messagesEndRef}></div>

                            </div>

                            <div className="message-input">

                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={text}
                                    onChange={(e) =>
                                        setText(e.target.value)
                                    }
                                    onKeyDown={(e) => {

                                        if (e.key === "Enter") {

                                            sendMessage();

                                        }

                                    }}
                                />

                                <button
                                    onClick={sendMessage}
                                >
                                    Send
                                </button>

                            </div>

                        </div>

                    ) : (

                        <h1>
                            Select a user to start chatting
                        </h1>

                    )
                }

            </div>

        </div>

    );

}

export default Chat;