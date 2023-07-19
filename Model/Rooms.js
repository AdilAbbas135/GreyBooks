const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoomSchema = new Schema(
  {
    Members: {
      type: Array,
    },
  },
  { timestamps: true }
);
const RoomModel = mongoose.model("rooms", RoomSchema);
module.exports = RoomModel;
