
import { model, Schema } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: function () {
            if (this.phoneNumber) {
                return false; 
            }
            return true; 
        },
        trim: true,
        lowercase: true,
      
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,

        required: function () {
            if (this.email) {
                return false; 
            }
            return true; 
        },
        // trim: true,
        // unique: true,
    },
    dob: {
        type: Date,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: Number,
    },
    otpExpiration: {
        type: Date,
    },
    failedAttempts: {
        type: Number, default: 0
    },
    isBanned: {
        type: Boolean, default: false
    },
    banExpiration: {
        type: Date
    },


    //*local
    // profilePicture: {
    //     type: String
    // },
    //*cloud
    profilePicture: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    credentialUpdatedAt: {
        type: Date,
        default: Date.now()
    },
    deletedAt: {
        type: Date,

    }

},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })

userSchema.virtual("fullName",).get(function () {
    return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual("fullName").set(function (value) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
});


userSchema.virtual("age").get(function () {
    console.log("DOB value:", this.dob);
    return new Date().getFullYear() - new Date(this.dob).getFullYear();
});
userSchema.virtual("messages",{
    ref:"message",
    localField:"_id",
    foreignField:"receiver"
});

export const User = model("User", userSchema);

