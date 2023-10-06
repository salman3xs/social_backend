import mongoose, { Schema } from "mongoose";

const userModel = new Schema({
    id: String,
    name: String,
    phone: String,
    post: Array,
    following: Array,
});

export default mongoose.model('User',userModel);