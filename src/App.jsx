import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Smile,
  ChevronLeft,
  ChevronDown,
  Ellipsis,
  Moon,
  PanelBottomClose,
  MessageSquareText,
  Zap,
  BookmarkPlus,
} from "lucide-react";
import { demoChats } from "./components/demoData";
import {
  formatMessageText,
  Avatar,
  MessageStatus,
} from "./components/functions";
import AiChatPanel from "./components/aiChatPanel";
import { GoogleGenAI } from "@google/genai";
import ChatList from "./components/chatList";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
export async function callGeminiAPI(prompt, history = []) {
  // 1) build the full contents array
  let contents = [
    ...history,
    {
      role: "user",
      parts: [
        {
          text: `${prompt} this is the given prompt and give me only the answer not anything else`,
        },
      ],
    },
  ];
  if (!history) {
    contents = [...history, { role: "user", parts: [{ text: prompt }] }];
  }
  // 2) send it
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents,
  });

  // 3) append the model's reply to your history
  const reply = { role: "model", parts: [{ text: response.text }] };
  history.push({ role: "user", parts: [{ text: prompt }] });
  history.push(reply);

  return { text: response.text, history };
}

// Chat message component
const Message = ({ message, avatar, index }) => {
  const isFromMe = message.sender === "me";
  const messageRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`relative flex items-end ${
        isFromMe ? "justify-end" : "justify-start"
      } mb-4`}
      ref={messageRef}
    >
      {!isFromMe && <Avatar name={avatar?.name} size="lg" className="mr-2" />}

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`relative max-w-[calc(100%-(--spacing(20)))] rounded-lg px-4 py-2 ${
          isFromMe
            ? "bg-[#d4dbf4] text-gray-800 "
            : "bg-[#ededed] text-gray-800"
        }`}
        style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
      >
        {formatMessageText(message.text)}
        <div
          className={`text-xs mt-1 flex justify-end items-center text-gray-500`}
        >
          {message.time}
          {isFromMe && (
            <span className="ml-1">
              <MessageStatus status={message.status} />
            </span>
          )}
        </div>
      </motion.div>
      {isFromMe && <Avatar name={"Neev"} size="lg" className="ml-2" />}
    </motion.div>
  );
};

// Main chat component
export default function ChatApp() {
  const [activeChat, setActiveChat] = useState(1);
  const [chats, setChats] = useState(demoChats);
  const [messageText, setMessageText] = useState("");
  const messageEndRef = useRef(null);
  const [mobileView, setMobileView] = useState("list");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const aiActions = [
    "Rephrase",
    "Make more friendly",
    "Make more formal",
    "Fix grammar errors",
  ];
  // Get active chat data
  const activeChatData = chats.find((chat) => chat.id === activeChat);
  const messages = activeChatData?.messages || [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAiAction = async (action) => {
    if (!messageText.trim()) return;

    const prompt = `${messageText}\n\nChange the text to: ${action}`;
    setMessageText("AI is generating..."); // Set loading message

    try {
      const result = await callGeminiAPI(prompt, []); // Empty history
      setMessageText(result.text); // Replace with AI-generated text
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessageText("Sorry, there was an error processing your request.");
    }
  };
  // Handle sending a message
  const handleSendMessage = () => {
    if (messageText.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      sender: "me",
      text: messageText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    // Update the specific chat's messages
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: messageText,
              chatHistory: [
                ...chat.chatHistory,
                { role: "model", parts: [{ text: messageText }] },
              ],
            }
          : chat
      )
    );

    setMessageText("");
  };

  const handleKeyPress = (e, inputType) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputType === "chat") {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile view handling */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${
          mobileView === "list" ? "block" : "hidden"
        } lg:block lg:w-[350px] w-full h-full`}
      >
        <ChatList
          chats={chats}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          setMobileView={setMobileView}
        />
      </motion.div>

      {/* Current chat panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`${
          mobileView === "chat" ? "block" : "hidden"
        } lg:block lg:w-[calc(100vw-(--spacing(187.5)))] w-full flex flex-col bg-white shadow-lg `}
      >
        {/* Chat header */}
        <div className="p-2 h-13 shadow-[0px_-3px_10px_0_#cccccc] z-10 flex items-center justify-between">
          <div className="flex items-center">
            {/* Back button on mobile */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mr-2 p-1 hover:bg-gray-200 rounded-full lg:hidden"
              onClick={() => setMobileView("list")}
            >
              <ChevronLeft size={24} />
            </motion.button>

            <div className="ml-3">
              <h2 className="text-2xl font-bold truncate">
                {activeChatData?.name || "Chat"}
              </h2>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 px-2 hover:bg-gray-200 rounded-md bg-gray-200 lg:hidden"
              onClick={() => setMobileView("ai")}
            >
              <Bot size={20} className="text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 px-2 hover:bg-gray-200 rounded-md bg-gray-200"
            >
              <Ellipsis size={20} className="text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 px-2 hover:bg-gray-200 rounded-md bg-gray-200"
            >
              <Moon size={20} className="text-black fill-black" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1 px-3  flex items-center gap-1 rounded-md bg-black text-white"
            >
              <PanelBottomClose size={20} className="text-white" />
              <p>Close</p>
            </motion.button>
          </div>
        </div>

        {/* Chat messages */}
        <div
          className="flex-1 overflow-y-auto p-4"
          style={{
            height: "calc(100dvh - 250px)",
          }}
        >
          <div className="space-y-1">
            <AnimatePresence>
              {messages.map((message, index) => (
                <Message
                  key={message.id}
                  message={message}
                  avatar={activeChatData}
                  index={index}
                />
              ))}
            </AnimatePresence>
            <div ref={messageEndRef} />
          </div>
        </div>

        {/* Input area */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="m-3 shadow-[0_0_10px_0px_#e4e4e4] rounded-xl relative"
        >
          <div className="items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="p-2 mr-1 cursor-pointer rounded-full flex items-center gap-2 relative"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MessageSquareText size={20} />
              <p className="font-semibold">Chat</p>
              <ChevronDown size={20} />
              {/* Dropdown Menu */}
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute top-[-140px] left-0  bg-white  rounded-lg shadow-xl z-10 py-1 w-48"
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                >
                  {aiActions.map((action, idx) => (
                    <motion.div
                      key={idx}
                      className="px-4 py-1 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleAiAction(action)}
                    >
                      {action}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.button>

            <div className="flex-1 bg-white rounded-2xl px-3 py-2">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, "chat")}
                placeholder="Type a message"
                className="w-full bg-transparent border-none focus:outline-none resize-none max-h-32 overflow-y-auto"
                rows={3}
              />
            </div>

            <div className="ml-1 flex justify-between">
              <div className="flex">
                <motion.button whileHover={{ scale: 1.1 }} className="p-2">
                  <Zap size={20} className="fill-black" />
                </motion.button>
                <div className="w-[1px] h-5 relative top-2 bg-black"></div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 rounded-full"
                >
                  <BookmarkPlus
                    size={20}
                    className="fill-black stroke-1 stroke-white"
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 rounded-full ml-1"
                >
                  <Smile
                    size={20}
                    className="fill-black stroke-1.5 stroke-white"
                  />
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 flex rounded-xl mr-1  text-gray-700 ml-1 ${
                  messageText ? "bg-black text-white" : ""
                }`}
                onClick={handleSendMessage}
              >
                <p>Send</p>
                <div className="w-[1px] h-4 relative top-1 ml-2 mr-1 bg-gray-300"></div>
                <ChevronDown size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* AI chat panel */}
      <AiChatPanel
        mobileView={mobileView}
        setMobileView={setMobileView}
        activeChatData={activeChatData}
        setMessageText={setMessageText}
      ></AiChatPanel>
    </div>
  );
}
