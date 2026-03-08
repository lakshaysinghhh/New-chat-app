import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="chat-input-wrapper p-2 sm:p-3 w-full bg-base-100 border-t border-base-300 flex-shrink-0 md:static fixed bottom-0 left-0 right-0 z-20 md:z-auto">
      {imagePreview && (
        <div className="mb-2 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-base-300"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center hover:bg-base-200"
              type="button"
              aria-label="Remove image"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 sm:gap-2">
        <div className="flex-1 flex gap-1.5 sm:gap-2 min-w-0">
          <input
            type="text"
            className="flex-1 min-w-0 input input-bordered rounded-lg input-sm sm:input-md py-2"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className="btn btn-sm btn-circle flex-shrink-0 text-base-content/60 hover:text-base-content"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle flex-shrink-0"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} className="sm:w-[22px] sm:h-[22px]" />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;