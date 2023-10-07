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
            async resolve(parent, args) {
                const user = await userModel.findOne({ id: args.userId });
                if (user) {
                    var data = [];
                    const selfPost = await postModel.find({ author: args.userId });
                    if (selfPost.length) {
                        data = [...selfPost];
                    }
                    for (let i = 0; i < user.following.length; i++) {
                        const u = user.following[i];
                        const post = await postModel.find({ author: u });
                        if (post.length) {
                            data = [...data, ...post];
                        }
                    }
                    return data;
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
        },
        allUser: {
            type: GraphQLList(UserType),
            args: {},
            resolve(parent, args) {
                return userModel.find()
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
                img: { type: GraphQLString },
                mentionedUsers: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
            },
            resolve(parent, args) {
                let post = new postModel({
                    id: args.id,
                    author: args.author,
                    content: args.content,
                    img: args.img,
                    mentionedUsers: args.mentionedUsers
                });
                return post.save();
            }
        },
        follow: {
            type: UserType,
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                otherUserId: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(parent, args) {
                let user = await userModel.findOne({ id: args.userId });
                if (!user.following.includes(args.otherUserId)) {
                    user.following = [...user.following, args.otherUserId];
                } else {
                    user.following = user.following.filter((v) => v != args.otherUserId);
                }
                return user.save({ isNew: false });
            }
        }
    }
})

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})

// 7aO1exGq2hhubF4i