import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } from 'graphql';
import userModel from '../models/userModel.js';
import { UserType } from './userType.js';
// Define the PostType type
export const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        // Field to resolve the post's ID
        id: { type: GraphQLID },

        // Field to resolve the post's author
        author: {
            type: UserType,
            resolve(parent, args) {
                // Find the user by the post's author ID
                return userModel.findOne({ id: parent.author });
            },
        },

        // Field to resolve the post's content
        content: { type: GraphQLString },

        // Field to resolve the post's image
        img: { type: GraphQLString },

        // Field to resolve the post's mentioned users
        mentionedUsers: {
            type: GraphQLList(UserType),
            resolve(parent, args) {
                // Create an empty array to store the mentioned users
                var data = [];

                // Loop through the post's mentioned user IDs
                for (let index = 0; index < parent.mentionedUsers.length; index++) {
                    // Find the user by the mentioned user ID
                    const user = userModel.findOne({ id: parent.mentionedUsers[index] });

                    // Add the user to the data array
                    data = [...data, user];
                }

                // Return the data array
                return data;
            },
        },
    }),
});