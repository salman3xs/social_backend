import mongoose, { Schema } from "mongoose";

// Define the post model schema
const postModel = new Schema({
    // The post's ID
    id: String,
    // The ID of the user who created the post
    author: String,
    // The post's content
    content: String,
    // The post's image
    img: String,
    // An array of the users mentioned in the post
    mentionedUsers: Array,
  });
  
  // Export the post model
  export default mongoose.model('Post', postModel);