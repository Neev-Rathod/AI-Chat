// Chat list component
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, SidebarIcon, AlignJustify } from "lucide-react";
import { Avatar } from "./functions";

const ChatList = ({ chats, activeChat, setActiveChat, setMobileView }) => {
  return (
    <div className="h-full flex flex-col relative z-20 bg-white">
      {/* Header */}
      <div className="p-3 flex justify-between items-center shadow-xs">
        <h1 className="text-xl font-semibold">Your inbox</h1>
      </div>

      <div className="flex w-full justify-between text-md text-gray-800 p-2 px-4 cursor-pointer font-semibold">
        <p className="flex items-center">
          4 Open <ChevronDown></ChevronDown>
        </p>
        <p className="flex items-center">
          Waiting Longest <ChevronDown></ChevronDown>
        </p>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto p-2 relative">
        <AnimatePresence>
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: chat.id * 0.1 }}
              className={`flex rounded-xl p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${
                activeChat === chat.id ? "bg-[#e7ecf8]" : ""
              }`}
              onClick={() => {
                setActiveChat(chat.id);
                setMobileView("chat");
              }}
            >
              <Avatar name={chat.name} src={chat.avatar} size="lg" />
              <div className="ml-2" style={{ width: "calc(100% - 48px)" }}>
                <div className="flex justify-between">
                  <p className={`${chat.unread > 0 ? "font-semibold" : ""}`}>
                    {chat.name}
                  </p>
                  {chat.unread > 0 && (
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      {chat.unread}
                    </motion.p>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p
                    className={`text-sm text-gray-600 truncate max-w-[12rem] ${
                      chat.unread > 0 ? "font-medium" : ""
                    }`}
                  >
                    {chat.lastMessage}
                  </p>
                  <p className="text-xs text-gray-500">{chat.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="absolute bottom-2 left-4 p-1 flex shadow-[0px_5px_15px_0px_#cccccc] rounded">
          <div className="bg-gray-200 rounded p-1 px-2">
            <SidebarIcon
              size={16}
              className="stroke-white fill-black "
            ></SidebarIcon>
          </div>
          <div className="p-1 px-2">
            <AlignJustify size={16} className=""></AlignJustify>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatList;
