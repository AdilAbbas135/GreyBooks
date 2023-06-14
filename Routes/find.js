const express = require("express");
const TutionModel = require("../Models/Teacher/Tution");
const { default: mongoose } = require("mongoose");
const JobsModel = require("../Models/Institute/Jobs");
const ApplyOnJobModel = require("../Models/Institute/ApplyOnJob");
const InstituteModel = require("../Models/Institute/Institute");
const router = express.Router();

//GET ALL TUTIONS FOR ALL TUTIONS PAGE
router.get("/tutions", async (req, res) => {
  // console.log("request recieved at the backend");

  try {
    const tutions = await TutionModel.aggregate([
      {
        $lookup: {
          from: "teachers",
          localField: "TeacherId",
          foreignField: "_id",
          as: "Teacher",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return res.status(200).json(tutions);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET SINGLE TUTION DETAIL FOR SINGLE TUTION PAGE
router.get("/tutions/singleTution", async (req, res) => {
  try {
    const TutionId = req.query.TutionId;
    const tution = await TutionModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(TutionId) } },
      {
        $lookup: {
          from: "teachers",
          localField: "TeacherId",
          foreignField: "_id",
          as: "Teacher",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return res.status(200).json(tution[0]);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// FIND ALL JOBS For Public Jobs Page
router.get("/jobs", async (req, res) => {
  try {
    const Jobs = await JobsModel.aggregate([
      {
        $lookup: {
          from: "institutes",
          localField: "userId",
          foreignField: "_id",
          as: "institute",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    return res.status(200).json(Jobs);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// FIND SINGLE JOB DETAIL For Public Jobs Page
router.post("/jobs/:id", async (req, res) => {
  try {
    const Job = await JobsModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "institutes",
          localField: "userId",
          foreignField: "_id",
          as: "institute",
        },
      },
    ]);
    let IsAlreadyApplied = false;
    if (req.body?.userId) {
      IsAlreadyApplied = await ApplyOnJobModel.findOne({
        userId: req.body.userId,
        JobId: Job[0]?._id,
      });
      if (IsAlreadyApplied?._id) {
        IsAlreadyApplied = true;
      }
    }
    return res.status(200).json({ Job: Job[0], IsAlreadyApplied });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// FIND ALL Institutes For Public Jobs Page
router.get("/institutes", async (req, res) => {
  try {
    const Institutes = await InstituteModel.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    return res.status(200).json(Institutes);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// FIND SINGLE Institute DETAIL For Public Jobs Page
router.post("/institute/:id", async (req, res) => {
  try {
    const Institute = await InstituteModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "userId",
          as: "Jobs",
        },
      },
    ]);

    return res.status(200).json(Institute[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
