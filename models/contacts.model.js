const mongoose = require("mongoose");
const { Schema } = mongoose;

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const contactsSchema = new Schema({
  email: {
    type: String,
    required: [true, "Contacts must have an email"],
    validate: [validateEmail, "Please enter a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
    unique: true,
  },
  isLead: {
    type: Boolean,
    default: false,
  },
  _authorId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Contact", contactsSchema);
