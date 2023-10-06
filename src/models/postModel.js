import mongoose, { Schema } from "mongoose";

const postModel = new Schema({
    id: String,
    author: String,
    content: String,
    tags: Array,
    mentionedUsers: Array,
});

export default mongoose.model('Post', postModel);