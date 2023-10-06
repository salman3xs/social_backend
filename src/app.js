import express from "express";
import { graphqlHTTP } from "express-graphql";
import schemaql from './schema/schema.js';
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from "mongoose";

export default class App {
    app;
    port;

    constructor(port) {
        this.app = express();
        this.port = port;
        this.connectToDataBases();
        this.initialize();
    }

    initialize() {
        this.app.use(cors({
            origin: ['*']
        }));
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(
            "/graphql",
            graphqlHTTP({
                schema: schemaql,
                graphiql: true,
            })
        );
    }

    connectToDataBases() {
        const uri = "mongodb+srv://social_app:7aO1exGq2hhubF4i@cluster0.yfrcavj.mongodb.net/?retryWrites=true&w=majority";
        mongoose.connect(uri);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Running a GraphQL API server at http://localhost:4000/graphql")
        });
    }
}
