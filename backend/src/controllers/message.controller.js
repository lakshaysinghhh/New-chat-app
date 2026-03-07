import Message from '../models/message.model.js'
import User from '../models/user.model.js'
import cloudinary from '../lib/cloudinary.js'
import { io, getReceiverSocketId } from "../lib/socket.js";

// 1️⃣ Sidebar users based on existing, non-deleted chats
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all messages involving the current user that are NOT deleted for them
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId },
        { receiverId: loggedInUserId },
      ],
      deletedFor: { $ne: loggedInUserId },
    }).select("senderId receiverId");

    const userIdsSet = new Set();

    for (const msg of messages) {
      const isSender = msg.senderId.toString() === loggedInUserId.toString();
      const otherUserId = isSender ? msg.receiverId : msg.senderId;
      userIdsSet.add(otherUserId.toString());
    }

    if (userIdsSet.size === 0) {
      return res.status(200).json([]);
    }

    const users = await User.find({
      _id: { $in: Array.from(userIdsSet) },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

//  2️⃣ Get Messages Between Two Users
// ================================
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
      deletedFor: { $ne: myId },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// 3️⃣ Send Message
// ================================
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;

        const senderId = req.user._id;

        let imageUrl;

        // 📸 If image exists upload to Cloudinary
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        // socket.io -todo

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteChatForUser = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    await Message.updateMany(
      {
        $or: [
          {
            senderId: myId,
            receiverId: userToChatId,
          },
          {
            senderId: userToChatId,
            receiverId: myId,
          },
        ],
      },
      {
        $addToSet: { deletedFor: myId },
      }
    );

    res.status(200).json({ message: "Chat deleted for current user" });
  } catch (error) {
    console.log("Error in deleteChatForUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
