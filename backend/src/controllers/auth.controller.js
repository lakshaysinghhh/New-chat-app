import { generateToken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'
import Message from '../models/message.model.js'
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body
  try {
      // 1️⃣ Validate fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'password must be atleast 6 letters' })
    }

    const user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: 'email already exists' })
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })

    if (newUser) {
      // gen Jwt token here
      await newUser.save()
      generateToken(newUser._id, res)
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic
      })
    } else {
      res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    console.log('Signup error:', error.message)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const login = async (req, res) => {
const {email,password}=req.body

try {
  
  const user=await User.findOne({email});
  if(!user){
    return res.status(400).json({message:"Invalid credentials"})
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
   if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }


    // 4️⃣ Generate JWT token
    generateToken(user._id, res);

    // 5️⃣ Send response
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });


 
}

catch (error) {
  console.log("Login Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",})
}

}

export const logout = (req, res) => {
    try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Logout Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await Message.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    await User.findByIdAndDelete(userId);

    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log("Delete Account Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const updateProfile=async(req,res)=>{
  try {
     const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({
        message: "Profile picture is required",
      });
    }
 // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
 // Update user profilePic in DB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);


  } catch (error) {
     console.log("Update Profile Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const checkAuth=(req,res)=>{
   try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.log("Check Auth Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}



// “Controller handles incoming requests, interacts with models/database, and sends back the response.”

// 1️⃣ Signup Controller

// 👉 signup

// Kaam: user register karna

// Flow:
// Data le raha hai → fullName, email, password
// Validation:
// empty check
// password length check
// Check:
// user already exist hai ya nahi
// Password hash:
// bcrypt se password secure banaya
// New user create kiya
// DB me save kiya
// JWT token generate kiya (login jaisa session)
// Response bheja

// 👉 Important line:

// generateToken(newUser._id, res)

// = user ko login jaisa authenticated bana diya

// 2️⃣ Login Controller

// 👉 login

// Kaam: existing user ko login karna

// Flow:
// Email se user find kiya
// Password compare kiya (bcrypt.compare)
// Agar match:
// JWT token generate
// user data return

// 👉 Key concept:

// Password plain text me store nahi hota
// Compare hashing se hota hai
// 3️⃣ Logout Controller

// 👉 logout

// Kaam: user ko logout karna

// Logic:
// res.cookie("jwt", "", { maxAge: 0 })

// 👉 Matlab:

// cookie delete → user logout
// 4️⃣ Delete Account

// 👉 deleteAccount

// Kaam: user ka pura account delete karna

// Flow:
// userId liya (req.user)
// Us user ke saare messages delete
// User delete
// Cookie clear
// Response send

// 👉 🔥 Good practice: pehle related data delete kiya (messages)

// 5️⃣ Update Profile

// 👉 updateProfile

// Kaam: profile pic update karna

// Flow:
// Image li (profilePic)
// Cloudinary pe upload kiya
// URL mila (secure_url)
// DB me update kiya

// 👉 🔥 Important:

// cloudinary.uploader.upload(profilePic)
// 6️⃣ Check Auth

// 👉 checkAuth

// Kaam: check karna user logged in hai ya nahi

// Logic:
// Agar req.user hai → authenticated
// Response me user return
// 🧩 req.user kaha se aaya?

// 👉 Ye middleware se aata hai (JWT verify karke)

// Example:

// Route → Auth Middleware → Controller

// Middleware:

// token verify karta hai
// user DB se nikal ke req.user me daal deta hai