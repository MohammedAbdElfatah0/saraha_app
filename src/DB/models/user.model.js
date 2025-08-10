
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
        required: function (params) {
            if (this.phoneNumber) {
                return false; // Email is not required if phoneNumber is provided
            }
            return true; // Email is required if phoneNumber is not provided
        },
        trim: true,
        lowercase: true,
        // unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,

        required: function () {
            if (this.email) {
                return false; // phoneNumber is not required if phoneNumber is provided
            }
            return true; // phoneNumber is required if phoneNumber is not provided
        },
        // trim: true,
        // unique: true,
    },
    dob: {
        type: Date,
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
    //  [this.firstName, this.lastName] = value.split(" ");
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
});


userSchema.virtual("age").get(function () {
    //new Date().getFullYear() - new Data(this.dob).getFullYear();
    return new Date().getFullYear() - this.dob.getFullYear();
});

export const User = model("User", userSchema);

