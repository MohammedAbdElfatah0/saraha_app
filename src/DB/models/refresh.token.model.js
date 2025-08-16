import { model, Schema } from 'mongoose';
const refreshTokenSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
},{
    timestamps: true,
    // versionKey: false
});
const RefreshToken = model('RefreshToken', refreshTokenSchema);
export default RefreshToken;