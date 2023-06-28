import mongoose from "mongoose";


const resetTokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    token: String,
    },

    {
        timestamps: true
    }
    
);

const resetToken = mongoose.model("reset_tokens", resetTokenSchema);
export default resetToken;
