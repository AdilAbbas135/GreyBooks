const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connect_to_db = async () => {
  dotenv.config();
  try {
    await mongoose
      .connect(process.env.database_url)
      .then((connection) => {
        console.log("Connected to database Successfully");
      })
      .catch((error) => {
        console.log("Error connecting to database");
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect_to_db;
