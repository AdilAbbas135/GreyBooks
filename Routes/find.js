const express = require("express");
const BooksModel = require("../Model/Books");
const router = express.Router();

router.get("/books", async (req, res) => {
  try {
    const Books = await BooksModel.find();
    return res.status(200).json({ Books });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
