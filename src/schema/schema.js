import { GraphQLObjectType, GraphQLID, GraphQLSchema, GraphQLList, GraphQLString, GraphQLNonNull } from "graphql";
import { PostType } from './postType.js';
import { UserType } from './userType.js';
import postModel from '../models/postModel.js';
import userModel from '../models/userModel.js';

// Define the RootQuery type
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // Field to resolve the newsfeed for the specified user
        newsfeed: {
            type: GraphQLList(PostType),
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                // Find the user by the specified ID
                const user = await userModel.findOne({ id: args.userId });

                // If the user exists
                if (user) {
                    // Create an empty array to store the newsfeed posts
                    var data = [];

                    // Add the user's own posts to the newsfeed
                    const selfPost = await postModel.find({ author: args.userId });
                    if (selfPost.length) {
                        data = [...data, ...selfPost];
                    }

                    // Loop through the user's following list
                    for (let i = 0; i < user.following.length; i++) {
                        // Get the user ID of the person the user is following
                        const u = user.following[i];

                        // Find all posts by the person the user is following
                        const post = await postModel.find({ author: u });

                        // If the person the user is following has any posts
                        if (post.length) {
                            // Add the posts to the newsfeed
                            data = [...data, ...post];
                        }
                    }

                    // Return the newsfeed posts
                    return data;
                } else {
                    // Return an empty array if the user does not exist
                    return [];
                }
            },
        },

        // Field to resolve a post by its ID
        post: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                // Find the post by the specified ID
                return postModel.findOne({ id: args.id });
            },
        },

        // Field to resolve a user by their ID
        user: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                // Find the user by the specified ID
                return userModel.findOne({ id: args.id });
            },
        },

        // Field to resolve all users
        allUser: {
            type: GraphQLList(UserType),
            args: {},
            resolve(parent, args) {
                // Find all users
                return userModel.find();
            },
        },
    },
});

// Define the Mutation type
const Mutation = new GraphQLObjectType({
    name: "Mutations",
    fields: {
        // Field to add a new user
        addUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                // Create a new user model instance
                let user = new userModel({
                    id: args.id,
                    name: args.name,
                    phone: args.phone,
                });

                // Save the user
                return user.save();
            },
        },

        // Field to add a new post
        addPost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                author: { type: new GraphQLNonNull(GraphQLID) },
                content: { type: new GraphQLNonNull(GraphQLString) },
                img: { type: GraphQLString },
                mentionedUsers: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
            },
            resolve(parent, args) {
                // Create a new post model instance
                let post = new postModel({
                    id: args.id,
                    author: args.author,
                    content: args.content,
                    img: args.img,
                    mentionedUsers: args.mentionedUsers,
                });

                // Save the post
                return post.save();
            },
        },

        // Field to follow or unfollow a user
        follow: {
            type: UserType,
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                otherUserId: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                // Find the user who is trying to follow or unfollow another user
                let user = await userModel.findOne({ id: args.userId });

                // If the user is not already following the other user
                if (!user.following.includes(args.otherUserId)) {
                    // Add the other user to the user's following list
                    user.following = [...user.following, args.otherUserId];
                } else {
                    // Remove the other user from the user's following list
                    user.following = user.following.filter((v) => v != args.otherUserId);
                }

                // Save the user
                return user.save({ isNew: false });
            },
        },
    },
});

// Export the GraphQL schema

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})

