const express = require("express");
const VerifyToken = require("../Middlewear/VerifyToken");
const RoomModel = require("../Model/allChats");
const { default: mongoose } = require("mongoose");
const router = express.Router();

// FETCH ALL CHATS OF A SPECIFIC USER
router.post("/all", VerifyToken, async (req, res) => {
  try {
    const Chats = await RoomModel.aggregate([
      { $match: { SenderId: new mongoose.Types.ObjectId(req.user.profileId) } },
    ]);

    return res.status(200).json(Chats);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
