import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } from "graphql";
import { PostType } from './postType.js';
import postModel from '../models/postModel.js';
import userModel from '../models/userModel.js';

// Define the UserType type
export const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      phone: { type: GraphQLString },
  
      // Field to resolve the user's posts
      posts: {
        type: GraphQLList(PostType),
        resolve(parent, args) {
          // Find all posts by the user
          return postModel.find({ author: parent.id });
        },
      },
  
      // Field to resolve the user's following
      following: {
        type: GraphQLList(UserType),
        resolve(parent, args) {
          // Create an empty array to store the following users
          var data = [];
  
          // Loop through the user's following IDs
          for (let index = 0; index < parent.following.length; index++) {
            // Find the user by the following ID
            const user = userModel.findOne({ id: parent.following[index] });
  
            // Add the user to the data array
            data = [...data, user];
          }
  
          // Return the data array
          return data;
        },
      },
    }),
  });
