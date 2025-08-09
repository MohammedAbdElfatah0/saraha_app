import mongoose from "mongoose";
export function connectDB() {
    mongoose.connect("mongodb://localhost:27017/saraha_app",)
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.error("MongoDB connection error:", err));
}