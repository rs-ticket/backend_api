require('dotenv').config();
import mongoose from 'mongoose';

const connectDB = () => {
    console.log(process.env.MONGODB_URL);
    mongoose.connect(String(process.env.MONGODB_URL))
    .then(()=> console.log('Connected to MongoDB', process.env.MONGODB_URL));
}

export default connectDB;