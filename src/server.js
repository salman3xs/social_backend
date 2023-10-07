// Import the App class from the app.js file
import App from "./app.js";

// Create a new App instance and specify the port to listen on
const app = new App(4000);

// Start the Express server
app.listen();