const mongoose = require("mongoose");
const { Schema } = mongoose;
const MessageSchema = new Schema(
  {
    RoomId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    SenderId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    RecieverId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Message: { type: String },
  },
  { timestamps: true }
);

const MessagesModel = mongoose.model("messages", MessageSchema);
module.exports = MessagesModel;
