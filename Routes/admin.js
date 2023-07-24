const express = require("express");
const ProfileModel = require("../Model/Profile");
const DocumentsModal = require("../Model/Documents");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("request recieved");
    const Data = await DocumentsModal.aggregate([
      {
        $lookup: {
          from: "profiles",
          localField: "profileId",
          foreignField: "_id",
          as: "User",
        },
      },

      { $unwind: "$User" },
    ]);
    return res.status(200).json(Data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/approveaccount", async (req, res) => {
  try {
    // console.log(req.body);
    await ProfileModel.findByIdAndUpdate(
      req.body.User?._id,
      {
        $set: { isNeedy: true },
      },
      { upsert: true }
    );
    await DocumentsModal.findByIdAndDelete(req.body?._id);
    return res.status(200).json({ msg: "Account Approved Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
