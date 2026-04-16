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

  const handleBackToSidebar = () => {
    useChatStore.getState().setSelectedUser(null);
    setMobileSidebarOpen(false);
  };

  // const handleBack = () => {
  //   setMobileSidebarOpen(true);
  // };

  return (
    <div className="min-h-[100dvh] bg-base-200 pt-16">
      <div className="flex justify-center px-1 sm:px-4 h-[calc(100dvh-4rem)]">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-full min-h-0 overflow-hidden flex flex-col md:flex-row relative">

          {/* Sidebar: full view when no chat; slides in on mobile when navigating back */}
          <div
            className={`
              flex-shrink-0 w-full md:w-72 h-full flex flex-col
              transition-transform duration-300 ease-out
              ${selectedUser ? "hidden md:flex" : "flex"}
              ${!selectedUser ? "animate-[slideIn_0.3s_ease-out]" : ""}
            `}
          >
            <Sidebar
              onSelectUser={selectUserAndCloseSidebar}
              isMobileOverlay={false}
            />
          </div>

          {/* Mobile sidebar overlay: slides in from left when back is pressed */}
          {selectedUser && (
            <div
              className="fixed inset-0 z-40 md:hidden"
              style={{ pointerEvents: mobileSidebarOpen ? "auto" : "none" }}
              aria-hidden={!mobileSidebarOpen}
            >
              <div
                className="absolute inset-0 top-16 bg-black/40 transition-opacity duration-300"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div
                className={`
                  absolute left-0 top-16 bottom-0 w-[min(85vw,320px)] max-w-[320px]
                  bg-base-100 border-r border-base-300 shadow-xl
                  flex flex-col
                  transform transition-transform duration-300 ease-out will-change-transform
                  ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
              >
                <Sidebar
                  onSelectUser={selectUserAndCloseSidebar}
                  onCloseMobile={() => setMobileSidebarOpen(false)}
                  onBackToSidebar={handleBackToSidebar}
                  isMobileOverlay={true}
                />
              </div>
            </div>
          )}

          {/* Chat area - min-h-0 critical for scroll to work in flex layout */}
          <div
            className={`flex-1 flex flex-col min-w-0 min-h-0 transition-opacity duration-200 ${
              !selectedUser ? "hidden md:flex" : "flex"
            }`}
          >
            {!selectedUser ? (
              <NoChatSelected />
            ) : (
              <ChatContainer
                onOpenSidebar={() => setMobileSidebarOpen(true)}
                onBack={handleBackToSidebar}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;