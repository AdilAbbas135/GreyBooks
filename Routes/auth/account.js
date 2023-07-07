const express = require("express");
const router = express.Router();
const AllUsersModel = require("../../Model/Allusers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTPModel = require("../../Model/Token");
const UserModel = require("../../Model/Users");
const SendMail = require("../../utils/SendMail");
const ProfileModel = require("../../Model/Profile");
const VerifyToken = require("../../Middlewear/VerifyToken");
const BooksModel = require("../../Model/Books");
const { default: mongoose } = require("mongoose");

// ROUTE 1 : REGISTER WITH MAIL AND SEND VERIFY EMAIL
router.post("/createaccount", async (req, res) => {
  try {
    const finduser = await AllUsersModel.findOne({ Email: req.query.email });
    if (!finduser) {
      const finduser2 = await UserModel.findOne({ email: req.query.email });
      let user = null;
      if (!finduser2) {
        user = await UserModel.create({
          email: req.body.Email,
          UserName: req.body.UserName,
          Password: req.body.Password,
        });
      } else {
        user = finduser2;
      }
      if (user) {
        const token = assigntoken(user);
        if (token) {
          return res.status(200).json({
            success: true,
            userid: user?._id,
            msg: "email has been sent to your email addrsss",
          });
        } else {
          return res
            .status(400)
            .json({ success: false, msg: "error in sending the mail" });
        }
      } else {
        return res
          .status(400)
          .json({ success: false, msg: "error in creating the user" });
      }
    } else {
      return res.status(400).json({ msg: "This Email is Already Registered" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

async function assigntoken(user) {
  const token = await OTPModel.create({
    userId: user._id,
    token: Math.floor(1000 + Math.random() * 9000),
  });
  const url = `Your Otp Token is ${token.token}`;
  const sendmail = await SendMail(user.email, "Verify Your Email Address", url);
  if (sendmail) {
    return true;
  } else {
    return false;
  }
}

// ROUTE 2 : VERIFY TOKEN/EMAIL AND CREATE USER ACCOUNT
router.post("/verifyemail/", async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userid);
    if (user) {
      const token = await OTPModel.findOne({
        userId: user._id,
        token: Number(req.body.Token),
      });
      if (token) {
        const newUser = await AllUsersModel.create({
          Email: user.email,
          Password: req.body.Password,
          UserName: req.body.UserName,
          isEmailVerified: true,
        });
        if (newUser) {
          await UserModel.findByIdAndDelete(req.body.userid);
          await OTPModel.findByIdAndDelete(token._id);
          const Profile = await ProfileModel.findOne({ Email: req.body.Email });
          if (!Profile) {
            const newProfile = await ProfileModel.create({
              UserName: req.body.UserName ? req.body.UserName : "",
              Email: req.body.Email,
              Password: req.body.Password,
              userId: newUser?._id,
            });
            if (newProfile) {
              const updateUserModel = await AllUsersModel.findByIdAndUpdate(
                newProfile.userId,
                {
                  $set: {
                    profileId: newProfile._id,
                    Password: req.body.Password,
                  },
                }
              );
              if (updateUserModel) {
                const authtoken = jwt.sign(
                  {
                    userId: newProfile.userId,
                    profileId: newProfile._id,
                    email: newProfile.Email,
                    ProfilePicture: newProfile.ProfilePicture,
                  },
                  process.env.JWT_SECRET_KEY,
                  { expiresIn: "1d" }
                );
                return res.status(200).json({
                  success: true,
                  User: updateUserModel,
                  Profile: newProfile,
                  authtoken,
                  msg: "profile creaed and user model updated successfully",
                });
              } else {
                res.status(400).json({
                  success: true,
                  Profile: newProfile,
                  error: "profile created but user model was not updated",
                });
              }
            }
          }

          // return res.status(200).json({
          //   success: true,
          //   User: newUser,
          // });
        } else {
          return res.status(400).json({
            success: false,
            user: false,
            msg: "error in creating the user account",
          });
        }
      } else {
        return res.status(400).json({ success: false, error: "invalid Link" });
      }
    } else {
      return res.status(400).json({ success: false, error: "Invalid Link" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ROUTE 3 : Login User with Email and password
router.post("/login", async (req, res) => {
  try {
    const User = await AllUsersModel.findOne({ Email: req.body.Email });
    if (User) {
      if (User.Password === req.body.Password) {
        const authtoken = jwt.sign(
          {
            userId: User?._id,
            profileId: User?.profileId,
            email: User?.Email,
            isEmailVerified: User?.isEmailVerified,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        return res.status(200).json({
          success: true,
          msg: "Login Sucessfull",
          authtoken,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "Wrong Credentials! Try Again" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Wrong Credentials! Try Again" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/books", VerifyToken, async (req, res) => {
  try {
    const Books = await BooksModel.aggregate([
      {
        $match: {
          profileId: new mongoose.Types.ObjectId(req.user.profileId),
        },
      },
    ]);
    return res.status(200).json({ Books });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
