"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const connectToDb = require("./src/config/mongodb");
const router = require("./src/routes");
const { createServer } = require("http");
const { socketServer } = require("./src/services/notifications");
//Adding basic middlewares

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(express.json()); // for parsing application/json

//routes
app.use("/v1", router);

//db connection
connectToDb();

const httpServer = createServer(app);

// socket server
socketServer(httpServer);
// port
require("dotenv").config();
const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
