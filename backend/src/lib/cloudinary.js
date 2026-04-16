import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'
config()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default cloudinary

// “I used Cloudinary in my backend to handle media uploads. 
// I configured it using environment variables for security and used its uploader
//  API to store images and get a hosted URL, which I then saved in the database.”
