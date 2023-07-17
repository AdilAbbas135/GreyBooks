const express = require("express");
const VerifyToken = require("../Middlewear/VerifyToken");
const RoomModel = require("../Model/allChats");
const { default: mongoose } = require("mongoose");
const MessagesModel = require("../Model/Messages");
const router = express.Router();

// FETCH ALL CHAT ROOMS OF A SPECIFIC USER
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

// FETCH ALL CHAT HISTORY OF A SPECIFIC SENDER AND RECIEVER
router.post("/chat", VerifyToken, async (req, res) => {
  try {
    const AllChats = await MessagesModel.aggregate([
      {
        $match: {
          SenderId: req.user.profileId || req.body.RecieverId,
          RecieverId: req.user.profileId || req.body.RecieverId,
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: req.body.RecieverId,
          foreignField: "_id",
          as: "Reciever",
        },
      },
    ]);

    return res.status(200).json(AllChats);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
