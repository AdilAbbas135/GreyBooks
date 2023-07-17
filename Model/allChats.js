const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoomSchema = new Schema(
  {
    SenderId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    RecieverId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);
const RoomModel = mongoose.model("rooms", RoomSchema);
module.exports = RoomModel;
