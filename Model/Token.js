const mongoose = require("mongoose");
const { Schema } = mongoose;
const OTPSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    token: { type: Number, required: true },
    expires_at: { type: Date, default: Date.now, expires: 600 }, //will expire after 10 minutes
  },
  { timestamps: true }
);

const OTPModel = mongoose.model("otp", OTPSchema);
module.exports = OTPModel;
