import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = ({ onOpenSidebar, onBack }) => {

  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  // 📌 get messages when user changes
  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);

    // socket realtime listener
    subscribeToMessages();

    return () => unsubscribeFromMessages();

  }, [selectedUser]);



  // 📌 auto scroll
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);


  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ChatHeader onOpenSidebar={onOpenSidebar} onBack={onBack} />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

      <ChatHeader onOpenSidebar={onOpenSidebar} onBack={onBack} />

      {/* Messages - scrollable, compact spacing; pb for fixed input on mobile */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 pb-24 sm:pb-3 space-y-1.5 sm:space-y-2 min-h-0 overscroll-contain">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat group ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-7 sm:size-8 rounded-full border flex-shrink-0">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header">
              <time className="text-[10px] sm:text-xs opacity-40 group-hover:opacity-70 transition-opacity ml-0.5">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[180px] rounded-md mb-1 max-w-[140px] sm:max-w-[180px]"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />

    </div>
  );
};

export default ChatContainer;