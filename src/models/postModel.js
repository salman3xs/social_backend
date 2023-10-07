import mongoose, { Schema } from "mongoose";

const postModel = new Schema({
    id: String,
    author: String,
    content: String,
    img: String,
    mentionedUsers: Array,
});

export default mongoose.model('Post', postModel);