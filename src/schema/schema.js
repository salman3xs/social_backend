import { GraphQLObjectType, GraphQLID, GraphQLSchema, GraphQLList, GraphQLString, GraphQLNonNull } from "graphql";
import { PostType } from './postType.js';
import { UserType } from './userType.js';
import postModel from '../models/postModel.js';
import userModel from '../models/userModel.js';

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        newsfeed: {
            type: GraphQLList(PostType),
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const user = userModel.findOne({ id: args.userId });
                if (user) {
                    var data = [];
                    const selfPost = postModel.find({ author: args.userId });
                    if (selfPost.length > 0) {
                        data = [...selfPost];
                        for (let i = 0; i < user.following.length; i++) {
                            const u = user.following[i];
                            console.log(u);
                            // const post = lodash.filter(posts, { author: u });
                            const post = postModel.filter({ author: u });
                            data = [...data, ...post];
                        }
                        return data;
                    } else {
                        return [];
                    }
                } else {
                    return [];
                }
            }
        },
        post: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return postModel.findOne({ id: args.id })
            }
        },
        user: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            }, resolve(parent, args) {
                return userModel.findOne({ id: args.id })
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutations",
    fields: {
        addUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let user = new userModel({
                    id: args.id,
                    name: args.name,
                    phone: args.phone,
                });
                return user.save();
            }
        },
        addPost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                author: { type: new GraphQLNonNull(GraphQLID) },
                content: { type: new GraphQLNonNull(GraphQLString) },
                tags: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
                mentionedUsers: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
            },
            resolve(parent, args) {
                let post = new postModel({
                    id: args.id,
                    author: args.author,
                    content: args.content,
                    tags: args.tags,
                    mentionedUsers: args.mentionedUsers
                });
                return post.save();
            }
        }
    }
})

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})

// 7aO1exGq2hhubF4i