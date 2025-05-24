import React from "react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Details from "./details";
import { formatAiText } from "./functions";
import {
  Sidebar,
  ArrowUp,
  Loader2,
  SquarePen,
  ChevronLeft,
  ChevronDown,
  Bot,
} from "lucide-react";
import { Avatar } from "./functions";
import { callGeminiAPI } from "../App";
const AiMessage = ({
  message,
  index,
  isLoading = false,
  isFromUser = false,
  setMessageText = () => {}, // 👈 New prop
}) => {
  const messageRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`relative flex  ${
        isFromUser ? "justify-end" : "justify-start"
      } mb-4`}
      ref={messageRef}
    >
      {!isFromUser && (
        <div className="mr-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
        </div>
      )}

      <motion.div
        transition={{ type: "spring", stiffness: 300 }}
        className={`relative max-w-[calc(100%-80px)] rounded-lg px-4 py-2 ${
          isFromUser
            ? "bg-[#d4dbf4] text-gray-800"
            : "bg-gradient-to-br from-[#c6cbf3] to-[#eed2d7] border border-purple-100 text-gray-800"
        }`}
        style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        ) : isFromUser ? (
          <div className="text-sm text-wrap break-words">{message.text}</div>
        ) : (
          formatAiText(message.text)
        )}
        {!isLoading && !isFromUser && (
          <div
            className="text-xs mt-1 flex justify-center items-center gap-2 bg-white py-1.5 rounded cursor-pointer px-2 hover:scale-[1.02] transition-all"
            onClick={() => {}}
          >
            <div
              className="flex items-center w-5/6 gap-2 justify-center  "
              onClick={() => setMessageText(message.text)}
            >
              <SquarePen size={16}></SquarePen>
              <p className="font-semibold text-[15px]">Add to composer</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-[1px] h-6 bg-gray-400"></div>
              <ChevronDown></ChevronDown>
            </div>
            {/* {message.time} */}
          </div>
        )}
      </motion.div>

      {isFromUser === 1 && (
        <div className="ml-2 flex-shrink-0">
          <Avatar name={"You"} size="lg" />
        </div>
      )}
    </motion.div>
  );
};
const AiWelcomeMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center mb-4"
      style={{
        height: "calc(100dvh - 260px)",
      }}
    >
      <div className="mr-2 flex-shrink-0">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      </div>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative max-w-[calc(100%-60px)] rounded-lg px-4 py-3 text-gray-800 text-center"
      >
        <div className="text-sm">
          <p className="font-medium text-xl">Hi!, I'm your AI Copilot</p>
          <p className="text-gray-700">
            Ask me anything about this conversation.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
const AiChatPanel = ({
  mobileView,
  setMobileView,
  activeChatData,
  setMessageText,
}) => {
  const [aiHeight, setAiHeight] = useState();
  const [activeTab, setActiveTab] = useState("copilot");
  const aiMessageEndRef = useRef(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiMessageText, setAiMessageText] = useState("");
  const [aiHistory, setAiHistory] = useState([]);

  const aiInputRef = useRef(null);
  const handleSendAiMessage = async () => {
    if (aiMessageText.trim() === "" || isAiLoading) return;

    const userMessage = {
      id: aiMessages.length + 1,
      text: aiMessageText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isFromUser: true,
    };

    setAiMessages((prev) => [...prev, userMessage]);
    const currentPrompt = aiMessageText;
    setAiMessageText("");
    setIsAiLoading(true);

    try {
      const chatContext = activeChatData?.chatHistory || [];
      const contextPrompt = `Based on this conversation context: ${JSON.stringify(
        chatContext
      )}, please answer: ${currentPrompt}`;

      const result = await callGeminiAPI(contextPrompt, [...aiHistory]);

      const aiResponse = {
        id: aiMessages.length + 2,
        text: result.text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isFromUser: false,
      };

      setAiMessages((prev) => [...prev, aiResponse]);
      setAiHistory(result.history);
    } catch (error) {
      console.error("Error calling AI:", error);
      const errorMessage = {
        id: aiMessages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isFromUser: false,
      };
      setAiMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendAiMessage();
    }
  };
  useEffect(() => {
    aiMessageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, isAiLoading]);

  // Auto-resize text input as content grows
  useEffect(() => {
    if (aiInputRef.current) {
      aiInputRef.current.style.height = "auto";
      const newHeight = Math.min(aiInputRef.current.scrollHeight, 100);
      setAiHeight(`${newHeight}`);
      aiInputRef.current.style.height = `${newHeight}px`;
    }
  }, [aiMessageText]);
  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`${
        mobileView === "ai" ? "block" : "hidden"
      } lg:block lg:w-[400px] w-full flex border-l border-[#f1f1f1] flex-col bg-gray-50`}
    >
      {/* AI chat header */}
      <div className="p-2 px-4 h-13 border-b border-[#f1f1f1] bg-white z-0 flex items-center justify-between">
        <div className="flex items-center">
          {/* Back button on mobile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mr-2 p-1 hover:bg-gray-200 rounded-full lg:hidden"
            onClick={() => setMobileView("chat")}
          >
            <ChevronLeft size={24} />
          </motion.button>
          <div className="flex px-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab("copilot")}
              className={`relative py-2 px-1 font-medium text-sm focus:outline-none flex items-center`}
            >
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-purple-700 mr-1 flex items-center justify-center text-white">
                  <Bot size={12} />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Copilot
                </span>
              </div>
              {activeTab === "copilot" && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute bottom-[-8px] left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab("details")}
              className={`relative py-2 px-4 font-medium text-sm focus:outline-none`}
            >
              Details
              {activeTab === "details" && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute bottom-[-8px] left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <Sidebar size={20} className="" />
          </motion.button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === "copilot" ? (
            <motion.div
              key="copilot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* AI chat messages */}
              <div
                className="overflow-y-auto p-4"
                style={{
                  height: `calc(100dvh - 108px - ${aiHeight}px)`,
                }}
              >
                <div className="space-y-1">
                  {/* Show welcome message if no AI messages */}
                  {aiMessages.length === 0 && !isAiLoading && (
                    <AiWelcomeMessage />
                  )}

                  <AnimatePresence>
                    {aiMessages.map((message, index) => (
                      <AiMessage
                        key={message.id}
                        message={message}
                        index={index}
                        isFromUser={message.id % 2}
                        setMessageText={setMessageText} // Pass setter function
                      />
                    ))}
                    {isAiLoading && (
                      <AiMessage
                        key="loading"
                        message={{ text: "", time: "" }}
                        index={aiMessages.length}
                        isLoading={true}
                      />
                    )}
                  </AnimatePresence>
                  <div ref={aiMessageEndRef} />
                </div>
              </div>

              {/* AI input area */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-3 relative bg-gray-50"
              >
                <div className="absolute inset-0 z-[5] bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-md opacity-[0.1]"></div>
                <div className="flex items-end z-10 rounded-xl relative bg-white py-2">
                  <div className="flex-1 bg-white rounded-lg px-3">
                    <textarea
                      ref={aiInputRef}
                      value={aiMessageText}
                      onChange={(e) => setAiMessageText(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e)}
                      placeholder="Ask the AI about your conversation..."
                      className="w-full bg-transparent border-none focus:outline-none resize-none max-h-32 overflow-y-auto"
                      rows={1}
                      disabled={isAiLoading}
                    />
                  </div>
                  <div className="ml-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-1 rounded-full hover:bg-gray-50 mr-2 transition-colors ${
                        isAiLoading
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={handleSendAiMessage}
                      disabled={isAiLoading}
                    >
                      {isAiLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <div
                          className={`p-1 rounded-lg ${
                            aiMessageText ? "bg-black text-white" : ""
                          }`}
                        >
                          <ArrowUp size={20} />
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <Details activeChatData={activeChatData}></Details>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AiChatPanel;
