import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const selectUserAndCloseSidebar = (user) => {
    useChatStore.getState().setSelectedUser(user);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-[100dvh] bg-base-200 pt-16">
      <div className="flex justify-center px-1 sm:px-4 h-[calc(100dvh-4rem)]">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-full overflow-hidden flex flex-col md:flex-row">

          {/* Sidebar: full width when no chat, slide-over overlay on mobile when in chat */}
          <div
            className={`
              flex-shrink-0
              ${selectedUser ? "hidden md:flex md:w-72" : "flex w-full md:w-72"}
              md:relative
              ${selectedUser && mobileSidebarOpen ? "flex fixed inset-0 z-40 md:flex md:static" : ""}
            `}
          >
            {/* Mobile backdrop when sidebar overlay is open */}
            {(mobileSidebarOpen && selectedUser) && (
              <div
                className="absolute inset-0 bg-black/40 md:hidden z-30"
                onClick={() => setMobileSidebarOpen(false)}
                aria-hidden="true"
              />
            )}
            <div
              className={`
                w-full md:w-72 h-full flex flex-col
                ${selectedUser && mobileSidebarOpen ? "absolute left-0 top-0 bottom-0 w-[min(85vw,320px)] z-40 shadow-xl animate-[slideIn_0.25s_ease-out] md:relative md:shadow-none md:animate-none" : ""}
              `}
            >
              <Sidebar
                onSelectUser={selectUserAndCloseSidebar}
                onCloseMobile={() => setMobileSidebarOpen(false)}
                isMobileOverlay={!!selectedUser}
              />
            </div>
          </div>

          {/* Chat area: full width on mobile when chat selected */}
          <div
            className={`flex-1 flex flex-col min-w-0 ${
              !selectedUser ? "hidden md:flex" : "flex"
            }`}
          >
            {!selectedUser ? (
              <NoChatSelected />
            ) : (
              <ChatContainer
                onOpenSidebar={() => setMobileSidebarOpen(true)}
                onBack={() => useChatStore.getState().setSelectedUser(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;