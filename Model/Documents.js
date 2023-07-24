const mongoose = require("mongoose");
const { Schema } = mongoose;
const DocumentsSchema = new Schema(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Document: {
      type: String,
    },
    isDocumentsSubmitted: {
      type: Boolean,
      default: false,
    },
    Message: {
      type: String,
      required: true,
      default: "Please Submit Your Documents",
    },
    isDocumentsApproved: {
      type: Boolean,
      default: false,
    },
    isWaitingForApproval: {
      type: Boolean,
      default: true,
    },
    PhoneNo: {
      type: String,
    },
    CNIC: {
      type: String,
    },
    Occupation: {
      Type: String,
    },
  },
  { timestamps: true }
);

const DocumentsModal = mongoose.model("documents", DocumentsSchema);
module.exports = DocumentsModal;
