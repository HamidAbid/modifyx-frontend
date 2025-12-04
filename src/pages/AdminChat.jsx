import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { motion } from "framer-motion";

const socket = io(`/api/`);

const AdminChat = ({ darkMode }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchUsers();

    socket.on("receive_message", (msg) => {
      if (
        selectedUser &&
        ((msg.senderId === selectedUser._id && msg.receiverId === "admin") ||
          (msg.senderId === "admin" && msg.receiverId === selectedUser._id))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receive_message");
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/chat/admin/chat/users");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users");
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await axios.get(
        `/api/chat/admin/chat/messages/${userId}`
      );
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages");
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (!newMsg.trim() || !selectedUser) return;

    const msgData = {
      senderId: "admin",
      receiverId: selectedUser._id,
      message: newMsg,
      timestamp: new Date(),
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setNewMsg("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } p-6 rounded-lg shadow-md w-7xl mx-auto flex flex-col h-[80vh] max-w-[100%]`}
    >
      <h2 className="text-2xl font-bold mb-6">Chat Support</h2>

      <div className="flex flex-grow overflow-hidden rounded-lg border">
        {/* Left - Users List */}
        <div
          className={`w-1/3 border-r overflow-y-auto ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-red-50"
          }`}
        >
          <h3 className="text-lg font-semibold p-4 border-b">Users</h3>
          {users.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No users found.</p>
          ) : (
            <ul>
              {users.map((user) => (
                <li
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`cursor-pointer px-4 py-3 border-b last:border-b-0 hover:bg-red-600 hover:text-white transition-colors ${
                    selectedUser?._id === user._id
                      ? "bg-red-700 text-white"
                      : darkMode
                      ? "text-gray-300"
                      : "text-gray-900"
                  }`}
                >
                  {user.name || user.email}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right - Chat Window */}
        <div
          className={`w-2/3 flex flex-col ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          {selectedUser ? (
            <>
              {/* Chat header */}
              <div
                className={`border-b p-4 flex items-center justify-between ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <h3 className="font-semibold text-lg">
                  Chat with {selectedUser.name || selectedUser.email}
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className={`text-sm ${
                    darkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-black"
                  } transition-colors`}
                >
                  Close
                </button>
              </div>

              {/* Messages */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 mt-10">
                    No messages till now.
                  </p>
                ) : (
                  messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className={`flex flex-col space-y-1 ${
                        msg.senderId === "admin" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg shadow ${
                          msg.senderId === "admin"
                            ? darkMode
                              ? "bg-gray-600 text-white"
                              : "bg-red-200 text-black"
                            : darkMode
                            ? "bg-red-400 text-white"
                            : "bg-green-100 text-black"
                        }`}
                      >
                        <p>{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div
                className={`p-4 border-t flex space-x-2 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className={`flex-grow rounded px-3 py-2 border focus:outline-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-black placeholder-gray-600"
                  }`}
                />
                <button
                  onClick={sendMessage}
                  className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-500">Select a user to view the chat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
