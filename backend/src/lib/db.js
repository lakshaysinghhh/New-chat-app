import mongoose, { connect } from 'mongoose'

export const connectDB=async()=>{
    try{
const conn=await mongoose.connect(process.env.MONGODB_URI)
console.log(`mongodb connected,${conn.connection.host}`);

    }
    catch(error){
        console.log("mongodb connection error",error);
        

    }

}

// 👉 connectDB = app ko database se connect karne wala function