const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connect_to_db = async () => {
  dotenv.config();
  try {
    await mongoose.connect(process.env.database_url, (err, connect) => {
      if (err) {
        console.log("Error in Mongoose Connect");
        console.log(err);
      } else {
        console.log("connected to db successfullly");
      }
    });
  } catch (error) {}
};

module.exports = connect_to_db;
