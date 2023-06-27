const mongoose = require("mongoose");
const { Schema } = mongoose;
const CategorySchema = new Schema(
  {
    Name: {
      type: String,
    },
  },
  { timestamps: true }
);
const CategoryModel = mongoose.model("categories", CategorySchema);
module.exports = CategoryModel;
