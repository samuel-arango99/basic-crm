const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "You cannot create a user without a username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please specify a password!"],
  },
  roles: {
    type: [String],
    enum: ["user", "admin"],
    default: ["user"],
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  const newPassword = crypto
    .createHash("sha256")
    .update(this.password)
    .digest("hex");
  this.password = newPassword;
  next();
});

module.exports = mongoose.model("User", userSchema);
