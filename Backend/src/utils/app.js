const express = require("express");
require("dotenv").config();

const app = express();

app.use((req, res) => {
  res.send("this is from server");
});

app.listen(process.env.PORT, () => {
  console.log("Listening at ", process.env.PORT);
});
