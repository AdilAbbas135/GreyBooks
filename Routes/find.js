const express = require("express");
const BooksModel = require("../Model/Books");
const { default: mongoose } = require("mongoose");
const router = express.Router();

//SEARCH BOOK ACCORDING TO THE GIVEN NAME
router.post("/search", async (req, res) => {
  try {
    // console.log(req.body);
    const Books = await BooksModel.aggregate([
      {
        $match: {
          $and: [
            {
              Name: {
                $regex: req.body?.Name ? new RegExp(req.body.Name, "i") : null,
              },
            },
          ],
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    return res.status(200).json({ Books });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//FETCH ALL BOOK
router.get("/books", async (req, res) => {
  try {
    const Books = await BooksModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "Category",
          foreignField: "_id",
          as: "Category",
        },
      },
      { $unwind: "$Category" },
    ]);
    return res.status(200).json({ Books });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//FETCH SINGLE BOOK DETAILS
router.get("/books/:id", async (req, res) => {
  try {
    const Book = await BooksModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "profileId",
          foreignField: "_id",
          as: "User",
        },
      },
    ]);
    return res.status(200).json({ Book: Book[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//FETCH ALL BOOKS OF A SPECIFIC CATEGORY
router.get("/books/category/:category", async (req, res) => {
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
