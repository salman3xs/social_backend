import express from "express";
import { graphqlHTTP } from "express-graphql";
import schemaql from './schema/schema.js';
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from "mongoose";

// Export the App class
export default class App {
    constructor(port) {
      // Create an Express instance
      this.app = express();
  
      // Set the port to listen on
      this.port = port;
  
      // Connect to the database
      this.connectToDataBases();
  
      // Initialize the Express application
      this.initialize();
    }
  
    initialize() {
      // Use CORS middleware to allow cross-origin requests
      this.app.use(cors({
        origin: ['*']
      }));
  
      // Use BodyParser middleware to parse JSON and URL-encoded requests
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: true }));
  
      // Mount the GraphQL API server on the Express application
      this.app.use(
        "/graphql",
        graphqlHTTP({
          schema: schemaql,
          graphiql: true,
        })
      );
    }
  
    connectToDataBases() {
      // Connect to the MongoDB database
      const uri = "mongodb+srv://social_app:7aO1exGq2hhubF4i@cluster0.yfrcavj.mongodb.net/?retryWrites=true&w=majority";
      mongoose.connect(uri);
    }
  
    listen() {
      // Start the Express server
      this.app.listen(this.port, () => {
        console.log("Running a GraphQL API server at http://localhost:4000/graphql");
      });
    }
  }