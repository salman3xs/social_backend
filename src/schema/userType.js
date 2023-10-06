import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } from "graphql";
import { PostType } from './postType.js';
import postModel from '../models/postModel.js';
import userModel from '../models/userModel.js';

export const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        phone: { type: GraphQLString },
        posts: {
            type: GraphQLList(PostType), resolve(parent, args) {
                return postModel.find({ author: parent.id });
            },
        },
        following: {
            type: GraphQLList(UserType), resolve(parent, args) {
                var data = [];
                for (let index = 0; index < parent.following.length; index++) {
                    const user = userModel.findOne({ id: parent.following[index] });
                    data = [...data, user];
                }
                return data;
            },
        },
    })
});
