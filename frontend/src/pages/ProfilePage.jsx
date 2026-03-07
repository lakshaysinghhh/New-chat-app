import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start pt-16 px-3 sm:px-6 lg:px-8">

      <div className="w-full max-w-2xl">

        <div className="bg-base-300 rounded-xl p-4 sm:p-6 lg:p-8 space-y-8 shadow-md">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-semibold">Profile</h1>
            <p className="mt-1 text-sm text-base-content/70">
              Your profile information
            </p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">

            <div className="relative">

              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-base-200"
              />

              <label
                htmlFor="avatar-upload"
                className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer
                transition
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-base-200" />

                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>

            </div>

            <p className="text-xs sm:text-sm text-zinc-400 text-center">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click camera icon to update photo"}
            </p>

          </div>

          {/* User Info */}
          <div className="space-y-5">

            <div>
              <div className="text-sm text-zinc-400 flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                Full Name
              </div>

              <div className="px-4 py-2 bg-base-200 rounded-lg border text-sm sm:text-base">
                {authUser?.fullName}
              </div>
            </div>

            <div>
              <div className="text-sm text-zinc-400 flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" />
                Email Address
              </div>

              <div className="px-4 py-2 bg-base-200 rounded-lg border text-sm sm:text-base">
                {authUser?.email}
              </div>
            </div>

          </div>

          {/* Account Info */}
          <div className="bg-base-200 rounded-xl p-4 sm:p-5">

            <h2 className="text-base sm:text-lg font-medium mb-4">
              Account Information
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between border-b border-base-300 pb-2">
                <span>Member Since</span>

                <span>
                  {authUser?.createdAt
                    ? new Date(authUser.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span>Account Status</span>
                <span className="text-green-500 font-medium">Active</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;