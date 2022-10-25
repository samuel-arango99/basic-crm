const mongoose = require("mongoose");
const { Schema } = mongoose;

const campaignSchema = new Schema({
  description: {
    type: String,
    required: [true, "A campaign must have a description"],
  },
  startAt: {
    type: Date,
    required: [true, "A campaign must have a starting date"],
  },
  endAt: {
    type: Date,
    required: [true, "A campaign must have an ending date"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  _contacts: [
    {
      type: mongoose.Schema.ObjectId,
      required: [true, "A campaign must have at least one contact"],
      ref: "Contact",
    },
  ],
  _authorId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Campaign", campaignSchema);
