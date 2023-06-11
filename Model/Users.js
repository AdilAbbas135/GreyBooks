const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  email: { type: String, required: true },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
