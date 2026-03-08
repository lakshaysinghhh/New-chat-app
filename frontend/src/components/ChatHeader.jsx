import { X, Menu, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = ({ onOpenSidebar, onBack }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (onOpenSidebar) {
      onOpenSidebar();
    }
  };

  // page refresh pe selectedUser null ho sakta hai
  if (!selectedUser) return null;

  const isOnline = onlineUsers?.includes(selectedUser._id);

  return (
    <div className="p-2 sm:p-2.5 border-b border-base-300 flex-shrink-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Back button - mobile only; Hamburger - desktop only */}
          {(onBack || onOpenSidebar) && (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square flex-shrink-0 md:hidden"
                onClick={handleBack}
                aria-label="Go back to contacts"
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square flex-shrink-0 hidden md:flex"
                onClick={onOpenSidebar}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            </>
          )}
          {/* Avatar */}
          <div className="avatar flex-shrink-0">
            <div className="size-8 sm:size-9 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div className="min-w-0">
            <h3 className="font-medium truncate text-sm sm:text-base">{selectedUser.fullName}</h3>
            <p className="text-xs sm:text-sm text-base-content/70">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>

        </div>

        {/* Close button */}
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square flex-shrink-0"
          onClick={() => setSelectedUser(null)}
          aria-label="Close chat"
        >
          <X className="size-5" />
        </button>

      </div>
    </div>
  );
};

export default ChatHeader;