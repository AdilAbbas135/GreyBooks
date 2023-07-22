const express = require("express");
const VerifyToken = require("../Middlewear/VerifyToken");
const RoomModel = require("../Model/Rooms");
const { default: mongoose } = require("mongoose");
const MessagesModel = require("../Model/Messages");
const ProfileModel = require("../Model/Profile");
const router = express.Router();

// FETCH ALL ROOMS OF A SPECIFIC USER
router.post("/all-rooms", VerifyToken, async (req, res) => {
  try {
    const Chats = await RoomModel.find({
      Members: { $in: [req.user.profileId] },
    });
    return res.status(200).json(Chats);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// FETCH ALL CHAT HISTORY OF A SPECIFIC SENDER AND RECIEVER
router.post("/chat", VerifyToken, async (req, res) => {
  try {
    const Room = await RoomModel.findOne({
      Members: { $in: [req.user.profileId, req.body?.RecieverId] },
    });

    const Reciever = await ProfileModel.findById(req.body?.RecieverId);
    const Sender = await ProfileModel.findById(req.user?.profileId);
    const AllChats = await MessagesModel.aggregate([
      {
        $match: {
          RoomId: Room?._id,
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "RecieverId",
          foreignField: "_id",
          as: "Reciever",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return res.status(200).json({ AllChats, Reciever, Sender });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//SEND A MESSAGE
router.post("/send-message", VerifyToken, async (req, res) => {
  try {
    let FinalRoom;
    const Room = await RoomModel.findOne({
      Members: { $in: [req.user.profileId, req.body.RecieverId] },
    });
    console.log("room is");
    console.log(Room);
    if (!Room._id) {
      FinalRoom = await RoomModel.create({
        Members: [req.user.profileId, req.body.RecieverId],
      });
    } else {
      FinalRoom = Room;
    }
    await MessagesModel.create({
      RoomId: FinalRoom._id,
      SenderId: req.user.profileId,
      RecieverId: req.body.RecieverId,
      Message: req.body.Message,
    });
    return res.status(200).json({ msg: "Message Sent Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
