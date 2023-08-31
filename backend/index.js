const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const URI = process.env.MONGO_URI;

mongoose
  .connect(URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running on ${PORT} and Mongo DB connected successfully`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/v1", userRoutes);
