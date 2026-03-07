import User from "../models/user.model.js";

export const searchUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const search = (req.query.search || "").trim();

    if (!search) {
      return res.status(200).json([]);
    }

    const regex = new RegExp(search, "i");

    const users = await User.find({
      _id: { $ne: loggedInUserId },
      $or: [{ fullName: regex }, { email: regex }],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in searchUsers:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

