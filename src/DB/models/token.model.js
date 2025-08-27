import { model, Schema } from 'mongoose';


const typeToken={
    access:"access",
    refresh:"refresh"
}

const TokenSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    type:{
        type:String,
        enum:Object.values(typeToken),
        default:typeToken.refresh
        
    }
},{
    timestamps: true,
    // versionKey: false
});
const Token = model('Token', TokenSchema);
export default Token;