const express = require("express");
const sql = require("../../Database/config/postgres");
const redisClient = require("../../Database/config/redis");
const authRouter=require("../../domains/auth/auth.routes");
require("dotenv").config();


const app = express();

app.use((req, res) => {
  res.send("this is from server");
});

app.use("/auth",authRouter);

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
