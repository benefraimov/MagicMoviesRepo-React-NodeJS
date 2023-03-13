const express = require("express");
require("colors");
require("dotenv").config();
const cors = require("cors");
const dbConnect = require("./config/db");

// Import Routers
const workers = require("./routes/workers");
const movies = require("./routes/movies");
const subscribers = require("./routes/subscribers");

// Connect mongooseDB
dbConnect();

// Turn express to an application
const App = express();

// enable json transferring
App.use(express.json());

// enable cors web browser security
App.use(cors());
App.get("/", (req, res) => {
    return res.status(200).send("server is running port 4000")
})
App.use("/api/workers", workers);
App.use("/api/movies", movies);
App.use("/api/subscribers", subscribers);

// using PORT address from .env
const server_port = process.env.PORT || 4000;

App.listen(server_port, () =>
    console.log(`Server is now running on port ${server_port}`)
);
