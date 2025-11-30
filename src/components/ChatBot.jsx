import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import UserChat from "./UserChat";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";

const ChatBot = () => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [val, setVal] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Welcome to Car ModifyX! 🚗✨ Ready to upgrade your ride? Ask me about body kits, wraps, rims, exhaust, ECU Tune & more.",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const messageCountRef = useRef(1);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    let storedSessionId = localStorage.getItem("chatSessionId");
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem("chatSessionId", storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // ⏳ Fetch chat history
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const fetchPreviousMessages = async () => {
      try {
        const res = await axios.get(`/api/chat/messages/${sessionId}`);
        const paired = res.data;

        const splitMessages = paired.flatMap((msg) => [
          { sender: "user", text: msg.userText },
          { sender: "bot", text: msg.botText },
        ]);

        setMessages(splitMessages);
        messageCountRef.current = splitMessages.length;
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchPreviousMessages();
  }, [isOpen, sessionId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleToggleChat = () => {
    setIsOpen((prev) => !prev);
    setVal("");
  };

  // 🎯 Car ModifyX Bot Logic
  const generateBotResponse = useCallback((userText) => {
    const text = userText.toLowerCase();

    if (text.includes("body kit") || text.includes("kit")) {
      return "We provide custom body kits including wide-body, lip kits, diffusers, and more. Compatible with most vehicles.";
    } else if (text.includes("wrap") || text.includes("wrapping") || text.includes("color change")) {
      return "We offer premium car wraps: Gloss, Matte, Satin, Chrome & Carbon Fiber. Full wrap pricing starts from PKR 65,000.";
    } else if (text.includes("rims") || text.includes("alloy") || text.includes("wheels")) {
      return "We have alloy rims from 15” to 20” including concave, forged, deep-dish and racing wheels.";
    } else if (text.includes("exhaust") || text.includes("sound") || text.includes("pops")) {
      return "We install performance exhaust systems, including catback, straight pipe & custom pops & bangs tuning.";
    } else if (
      text.includes("ecu") ||
      text.includes("tune") ||
      text.includes("hp") ||
      text.includes("remap") ||
      text.includes("performance")
    ) {
      return "ECU tuning can increase horsepower, torque and throttle response. Recommended for well maintained engines.";
    } else if (text.includes("turbo") || text.includes("supercharger")) {
      return "We support full turbo & supercharger upgrade projects. Pricing depends on engine & fabrication needs.";
    } else if (text.includes("spoiler") || text.includes("wing")) {
      return "We offer OEM style spoilers, ducktail, GT wings & custom carbon fiber designs.";
    } else if (text.includes("delivery") || text.includes("shipping")) {
      return "We deliver parts all across Pakistan. Installation workshops available in Lahore, Karachi & Islamabad.";
    } else if (text.includes("location") || text.includes("workshop")) {
      return "Our main modification workshop is located in Lahore.";
    } else if (
      text.includes("ai") ||
      text.includes("render") ||
      text.includes("preview") ||
      text.includes("before and after")
    ) {
      return "Our AI Car Visualizer allows you to preview modifications before ordering!";
    } else if (text.includes("cancel") || text.includes("change order")) {
      return "To cancel or modify an order, please contact us within 1 hour of placement.";
    } else if (text.includes("price") || text.includes("cost")) {
      return "Modification prices vary by vehicle & customization. Send your car model + what you want to modify for an estimate.";
    } else if (
      text.includes("help") ||
      text.includes("support") ||
      text.includes("contact")
    ) {
      return "Our support team is available 24/7. You can chat here or reach us on WhatsApp.";
    } else {
      return (
        <div className="space-y-2">
          <p>Thanks! For this query please talk with our modification expert 🔧</p>
          <button
            onClick={() => handleClick("admin")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Talk with Expert
          </button>
        </div>
      );
    }
  }, []);

  const saveConversationToBackend = async (userText, botText) => {
    try {
      await axios.post("/api/chatbot/messages", {
        sessionId,
        userText,
        botText,
      });
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || messageCountRef.current >= 20) return;

    const userText = inputValue.trim();
    setInputValue("");

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    messageCountRef.current++;

    const botText = generateBotResponse(userText);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    messageCountRef.current++;

    await saveConversationToBackend(userText, botText);
  };

  const handleQuickReply = useCallback(
    async (text) => {
      if (messageCountRef.current >= 20) return;

      setMessages((prev) => [...prev, { sender: "user", text }]);
      messageCountRef.current++;

      const botText = generateBotResponse(text);

      setTimeout(async () => {
        setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
        messageCountRef.current++;
        await saveConversationToBackend(text, botText);
      }, 1000);
    },
    [generateBotResponse, sessionId]
  );

  function handleClick(e) {
    if (e === "bot") setVal("bot");
    if (e === "admin") {
      if (token) {
        setVal("admin");
        return;
      }
      toast.error("Login First, To chat with Expert");
    }
  }

  return (
    <div className="fixed bottom-20 right-10 z-50">
      {/* Toggle Button */}
      <button
        onClick={handleToggleChat}
        className="bg-slate-900 rounded-full p-3 text-white shadow-lg hover:bg-opacity-80 transition-colors"
        aria-label="Chat with us"
      >
        {isOpen ? "✖" : "💬"}
      </button>

      {/* Chat selector */}
      {isOpen && (
        <div className="flex flex-col gap-2 absolute w-32 text-sm bottom-20 right-0">
          <button
            onClick={() => handleClick("bot")}
            className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-md"
          >
            Chat Bot
          </button>
          <button
            onClick={() => handleClick("admin")}
            className="bg-slate-900 text-white py-2 rounded-full shadow-md"
          >
            Talk with Expert
          </button>
        </div>
      )}

      {/* ChatBot Window */}
      {isOpen && val === "bot" && (
        <div className="absolute bottom-16 right-0 h-96 w-80 md:w-96 bg-slate-900 rounded-lg border border-red-600 shadow-xl overflow-hidden flex flex-col">
          <div className="bg-slate-800 p-4 text-white border-b border-red-600">
            <h3 className="font-medium text-red-500">Chat with Car ModifyX Bot</h3>
            <p className="text-xs opacity-75">Modification assistance within minutes</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-3/4 rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-red-600 text-white rounded-tr-none"
                      : "bg-slate-800 text-white rounded-tl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="p-2 overflow-x-auto border-t border-red-600">
            <div className="flex space-x-2 text-xs">
              {[
                "Do you provide body kits?",
                "Do you offer car wrapping?",
                "Do you have forged rims?",
                "What exhaust upgrades are available?",
                "Do you offer ECU remapping?",
                "Can I upgrade to turbo?",
                "Do you have GT wings or spoilers?",
                "How much will modification cost?",
                "Do you deliver across Pakistan?",
                "Where is your workshop located?",
                "Can I preview using AI?",
                "How can I cancel an order?",
              ].map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1 bg-slate-700 text-white rounded-full whitespace-nowrap"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-red-600 flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about modifications..."
              className="flex-1 border border-white border-opacity-30 rounded-l-md px-3 py-2"
            />
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-r-md">
              ➤
            </button>
          </form>
        </div>
      )}

      {isOpen && val === "admin" && <UserChat />}
    </div>
  );
};

export default ChatBot;
