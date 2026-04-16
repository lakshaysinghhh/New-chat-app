import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // Cloudinary URL
      default: "",
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // createdAt & updatedAt auto add karega
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;


// 👉 Ye model chat messages ka complete structure define karta hai (text + image + sender/receiver + delete logic)