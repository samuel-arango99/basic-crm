const Contact = require("../models/contacts.model");

const getContacts = async (req, res) => {
  const isLeadFilter = req.query.isLead || "";
  const emailFilter = req.query.email || "";

  try {
    const contacts = await Contact.find({
      isLead: isLeadFilter !== "" ? isLeadFilter : { $in: [true, false] },
      email:
        emailFilter !== ""
          ? { $eq: emailFilter.replace(/'/g, "") }
          : { $ne: "" },
    })
      .select("-__v")
      .populate({
        path: "_authorId",
        select: "-password -roles -__v",
      });

    res.status(200).json({ numContacts: contacts.length, contacts });
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
};

const createContact = async (req, res) => {
  try {
    const { email, isLead, userId } = req.body;

    const validateExistingContact = await Contact.find({ email: email });

    if (validateExistingContact.length)
      throw new Error("Contact already created, please create a different one");

    const contact = await Contact.create({
      email: email,
      isLead: isLead,
      _authorId: userId,
    });

    if (contact) {
      res
        .status(200)
        .json({ success: { message: `Contact ${email} created` } });
    }
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
};

const updateContact = async (req, res) => {
  const contactId = req.params.id;
  const { email, isLead } = req.body;

  try {
    const contact = await Contact.findById(contactId);

    if (!contact) throw new Error("ID not associated to any contact");

    contact.email = email;
    contact.isLead = isLead;

    await contact.save();

    res.status(200).json({ success: { message: `Contact ${email} updated` } });
  } catch (err) {
    console.log(err.message);
    let message = "";
    if (err.message.includes("E11000")) {
      message = "Email already in use, please try another one!";
    } else if (err.message.includes(contactId)) {
      message = `Invalid ID ${contactId}`;
    } else {
      message = "Make sure 'email' and 'isLead' both have valid values";
    }
    res.status(400).json({ error: { message } });
  }
};

const deleteContact = async (req, res) => {
  const contactId = req.params.id;

  try {
    const deleted = await Contact.findByIdAndDelete(contactId);

    if (!deleted) throw new Error("ID not associated to any known contact");

    res
      .status(200)
      .json({ success: { message: `Contact ${deleted.email} deleted` } });
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};
