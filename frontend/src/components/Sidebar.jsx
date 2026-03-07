import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Trash2 } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users = [],
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    deleteChat,
    isDeletingChat,
  } = useChatStore();
  const { onlineUsers = [] } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full md:w-72 border-r border-base-300 flex flex-col transition-all duration-200">

      {/* Header */}
      <div className="border-b border-base-300 w-full p-4 space-y-3">

        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-semibold text-lg">Contacts</span>
        </div>

        {/* Search / Start new chat */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users to start chat"
            className="input input-sm input-bordered w-full"
          />
          <button
            type="button"
            className="btn btn-sm"
            onClick={async () => {
              if (!searchTerm.trim()) {
                setSearchResults([]);
                return;
              }
              const results = await useChatStore.getState().searchUsers(searchTerm.trim());
              setSearchResults(results);
            }}
          >
            Search
          </button>
        </div>

        {/* Filter (desktop only) */}
        <div className="mt-3 hidden md:flex items-center gap-2">

          <label className="cursor-pointer flex items-center gap-2">

            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />

            <span className="text-sm">Show online only</span>

          </label>

          <span className="text-xs text-zinc-500">
            ({Math.max(onlineUsers.length - 1, 0)} online)
          </span>

        </div>

      </div>

      {/* Users List */}
      <div className="overflow-y-auto w-full py-2 space-y-1">
        {/* Search results (start new chat) */}
        {searchResults.length > 0 && (
          <div className="px-3 pb-2">
            <div className="text-xs text-zinc-500 mb-1">Search results</div>
            {searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setSearchResults([]);
                  setSearchTerm("");
                }}
                className="w-full p-2 flex items-center gap-3 cursor-pointer hover:bg-base-300 rounded-md transition-colors"
              >
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-8 object-cover rounded-full"
                />
                <div className="flex flex-col text-left min-w-0">
                  <div className="font-medium truncate text-sm">
                    {user.fullName}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">
                    {user.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Existing chats */}
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center justify-between gap-3 cursor-pointer
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />

                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                )}
              </div>

              {/* User Info */}
              <div className="flex flex-col text-left min-w-0">
                <div className="font-medium truncate">
                  {user.fullName}
                </div>

                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>

            {/* Delete chat button */}
            <button
              type="button"
              className="btn btn-ghost btn-xs text-error"
              disabled={isDeletingChat}
              onClick={(e) => {
                e.stopPropagation();
                const confirmDelete = window.confirm(
                  `Delete this chat from your side with ${user.fullName}?`
                );
                if (!confirmDelete) return;
                deleteChat(user._id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No online users
          </div>
        )}

      </div>

    </aside>
  );
};

export default Sidebar;