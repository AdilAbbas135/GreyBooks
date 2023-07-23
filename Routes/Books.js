const express = require("express");
const VerifyToken = require("../Middlewear/VerifyToken");
const CategoryModel = require("../Model/Category");
const BooksModel = require("../Model/Books");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    console.log("file original name is");
    console.log(file.originalname);
    const name = new Date().getTime() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

router.post("/testing", upload.single("file"), async (req, res) => {
  try {
    if (req.file.path) {
      return res.status(200).json(req.file);
    } else {
      return res.status(404).json({ error: "File Not Uploaded" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post(
  "/addbook",
  VerifyToken,
  upload.single("file"),
  async (req, res) => {
    try {
      await BooksModel.create({
        profileId: req.user.profileId,
        Image: req.file?.path ? req.file?.path : "",
        Name: req.body.Name,
        Description: req.body.Description,
        Price: req.body.Price,
        Category: req.body.Category,
      });
      return res.status(200).json({ msg: "Book Added Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/categories", async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
