import mongoose from "mongoose";
export function connectDB() {
    mongoose.connect("mongodb://127.0.0.1:27017/saraha_app",)
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.error("MongoDB connection error:", err));
}