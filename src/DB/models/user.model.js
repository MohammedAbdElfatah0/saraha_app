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
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        // trim: true,
    },
    dob: {
        type: Date,
    }


}, 
{
    timestamps: true,
})

userSchema.virtual("fullName",).get(function () {
    return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual("fullname").set(function (value) {
    //  [this.firstName, this.lastName] = value.split(" ");
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
});


userSchema.virtual("age").get(function () {
    //new Date().getFullYear() - new Data(this.dob).getFullYear();
    return new Date().getFullYear() - this.dob.getFullYear();
});

export const user = model("User", userSchema);