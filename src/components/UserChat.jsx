import React, { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/authContext";

const socket = io(`/api/`);

export default function UserChat() {
  const { user } = useAuth();
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `/api/chat/admin/chat/messages/${user._id}`
        );
        setChat(data);
      } catch (err) {
        console.error("Failed to fetch admin chat:", err);
      }
    };

    fetchMessages();

    socket.on("receive_message", (msg) => {
      const isRelevant =
        (msg.senderId === user._id && msg.receiverId === "admin") ||
        (msg.senderId === "admin" && msg.receiverId === user._id);

      if (isRelevant) {
        setChat((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = useCallback(() => {
    if (!message.trim()) return;

    const msgData = {
      senderId: user._id,
      receiverId: "admin",
      message,
      timestamp: new Date(),
    };

    socket.emit("send_message", msgData, (ack) => {
      if (ack?.error) {
        console.error("Message failed to send:", ack.error);
      }
    });

    setMessage("");
  }, [message, user._id]);

  return (
    <div className="absolute bottom-16 right-0 h-96 w-68 sm:w-80 md:w-96 bg-slate-900 rounded-lg shadow-xl overflow-hidden flex flex-col border border-slate-400 z-50">
      <div className="bg-slate-800  p-4 text-white">
        <h3 className="font-medium">Chat with Admin</h3>
        <p className="text-xs opacity-80">Our team is here to help you</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-slate-950 h-96">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded max-w-[75%] ${msg.senderId === user._id
                ? "bg-slate-800 text-white ml-auto"
                : "bg-slate-200 text-black mr-auto"
              }`}
          >
            {msg.message}
            <div className="text-[10px] text-right">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex p-2 border-t bg-slate-800">
        <input
          type="text"
          className="flex-1 px-2 py-1 border-none bg-slate-800 rounded-l-md focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-1 btn rounded-md hover:bg-white-dark"
        >
          Send
        </button>
      </div>
    </div>
  );
}
