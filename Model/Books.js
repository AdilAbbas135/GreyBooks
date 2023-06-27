const mongoose = require("mongoose");
const { Schema } = mongoose;
const BooksSchema = new Schema(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Image: {
      type: String,
    },
    Name: {
      type: String,
    },
    Description: { type: String },
    Price: { type: Number },
    Category: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);
const BooksModel = mongoose.model("books", BooksSchema);
module.exports = BooksModel;
