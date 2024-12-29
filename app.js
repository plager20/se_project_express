const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: "67717de48f4b7397ddf75f6d",
  };
  next();
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
