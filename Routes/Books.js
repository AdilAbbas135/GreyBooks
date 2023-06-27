const express = require("express");
const VerifyToken = require("../Middlewear/VerifyToken");
const CategoryModel = require("../Model/Category");
const router = express.Router();

router.post("/addbook", VerifyToken, async (req, res) => {
  try {
    console.log("request recieved");
    console.log(req.user);
    await CategoryModel.create({
      Name: req.body.Name,
    });
    return res.status(200).json({ msg: "Added book successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
