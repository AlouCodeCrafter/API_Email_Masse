const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  email: {
    type: String,
    required: true,
    status: {
      type: String,
      enum: ["succes", "failure"],
      required: true,
    },
    timeStamp: {
      type: Date,
      default: Date.now,
    },
    message: {
      // message d'erreur ou de succes
      type: String,
    },
  },
});

const log = mongoose.model("log", logSchema);

module.exports = log;
