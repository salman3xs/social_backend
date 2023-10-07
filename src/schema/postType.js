import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } from 'graphql';
import userModel from '../models/userModel.js';
import { UserType } from './userType.js';


export const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: GraphQLID },
        author: {
            type: UserType,
            resolve(parent, args) {
                return userModel.findOne({ id: parent.author });
            }
        },
        content: { type: GraphQLString },
        img: { type: GraphQLString },
        mentionedUsers: {
            type: GraphQLList(UserType), resolve(parent, args) {
                var data = [];
                for (let index = 0; index < parent.mentionedUsers.length; index++) {
                    const user = userModel.findOne({ id: parent.mentionedUsers[index] });
                    data = [...data, user];
                }
                return data;
            }
        },
    })
});
