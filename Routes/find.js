const express = require("express");
const BooksModel = require("../Model/Books");
const { default: mongoose } = require("mongoose");
const router = express.Router();

//FETCH ALL BOOK
router.get("/books", async (req, res) => {
  try {
    const Books = await BooksModel.find();
    return res.status(200).json({ Books });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//FETCH ALL BOOKS OF A SPECIFIC CATEGORY
router.get("/books/:category", async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.category)) {
      const Books = await BooksModel.find({ Category: req.params.category });
      return res.status(200).json({ Books });
    } else {
      return res.status(404).json({ error: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
});

module.exports = router;
