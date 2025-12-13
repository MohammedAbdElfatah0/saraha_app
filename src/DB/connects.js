import mongoose from "mongoose";
export function connectDB() {
    mongoose.connect(process.env.DB_URL,)
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.error("MongoDB connection error:", err));
}