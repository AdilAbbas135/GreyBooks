const express = require("express");
const VerifyToken = require("../Middlewear/VerifyToken");
const router = express.Router();

router.post("/addbook", VerifyToken, async (req, res) => {
  try {
    console.log("request recieved");
    console.log(req.user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
