import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
    name: String,
    status: Boolean
    // postedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // }
});

const TaskModel = mongoose.model("tasks", taskSchema);
export default  TaskModel ;
