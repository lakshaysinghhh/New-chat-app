import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axiosInstance";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isDeletingChat: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages, users } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      const alreadyInSidebar = users.some((u) => u._id === selectedUser._id);
      set({
        messages: [...messages, res.data],
        users: alreadyInSidebar ? users : [...users, selectedUser],
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  searchUsers: async (query) => {
    try {
      const res = await axiosInstance.get("/users", {
        params: { search: query },
      });
      return res.data;
    } catch (error) {
      console.log("Error searching users:", error);
      toast.error(error.response?.data?.message || "Failed to search users");
      return [];
    }
  },

  deleteChat: async (userId) => {
    const { users, selectedUser } = get();
    set({ isDeletingChat: true });
    try {
      await axiosInstance.delete(`/messages/chat/${userId}`);

      const updatedUsers = users.filter((user) => user._id !== userId);
      const isCurrentChat = selectedUser?._id === userId;

      set({
        users: updatedUsers,
        messages: isCurrentChat ? [] : get().messages,
        selectedUser: isCurrentChat ? null : selectedUser,
      });

      toast.success("Chat deleted from your side");
    } catch (error) {
      console.log("Error deleting chat:", error);
      toast.error(error.response?.data?.message || "Failed to delete chat");
    } finally {
      set({ isDeletingChat: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));