import mongoose from "mongoose";
export function connectDB() {
<<<<<<< HEAD
    mongoose.connect("mongodb://localhost:27017/saraha_app",)
=======
    mongoose.connect("mongodb://127.0.0.1:27017/saraha_app",)
>>>>>>> master
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.error("MongoDB connection error:", err));
}