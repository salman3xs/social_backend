import mongoose, { Schema } from "mongoose";

// Define the user model schema
const userModel = new Schema({
    // The user's ID
    id: String,
    // The user's name
    name: String,
    // The user's phone number
    phone: String,
    // An array of the user's posts
    post: Array,
    // An array of the users that the user is following
    following: Array,
});

// Export the user model
export default mongoose.model('User', userModel);
