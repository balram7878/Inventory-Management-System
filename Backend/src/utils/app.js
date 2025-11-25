const express = require("express");
const sql = require("../../Database/postgres");
const redisClient = require("../../Database/redis");
require("dotenv").config();

const app = express();

app.use((req, res) => {
  res.send("this is from server");
});

const initializeConnections = async () => {
  try {
    await redisClient.connect();
    app.listen(process.env.PORT, () => {
      console.log("Listening at ", process.env.PORT);
    });
  } catch (err) {
    console.log(err);
  }
};

initializeConnections();
