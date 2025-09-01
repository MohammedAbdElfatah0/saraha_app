import { ref } from 'joi';
import { Schema, model, models } from 'mongoose';
const messageSchema = Schema({
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        minlength: 3,
        maxlength: 1000,
        required: function () {
            if (this.attachment > 0) {
                return false;
            }
            return true;
        }
    },
    attachment: [{ secure_url: String, public_id: string }],
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},
    {
        timestamps: true,

    }
);
export default messageModel = model("Message", messageSchema);