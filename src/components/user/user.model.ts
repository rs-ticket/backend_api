import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    status: Boolean
    // postedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // }
}, {
    timestamps: true
}

);

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
