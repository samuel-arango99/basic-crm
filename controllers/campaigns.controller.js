const Campaign = require("../models/campaigns.model");
const Contact = require("../models/contacts.model");
const sendEmail = require("../utils/mailer");

const createCampaign = async (req, res) => {
  const { description, startAt, endAt, isActive, contacts } = req.body;

  try {
    console.log(contacts);
    if (contacts.length === 0)
      throw new Error("You must specify an array of contact emails");

    const contactsIds = await Promise.all(
      contacts.map(async (val) => {
        let contact = await Contact.findOne({ email: val });

        if (!contact)
          throw new Error(
            `Cannot add contact ${val} to campaign because it doesn't exist. Remove it and try again`
          );
        return contact._id;
      })
    );

    const newCampaign = await Campaign.create({
      description,
      startAt,
      endAt,
      isActive,
      _contacts: contactsIds,
      _authorId: req.body.userId,
    });

    if (newCampaign)
      res
        .status(200)
        .json({ success: { message: "Marketing campaign created" } });
  } catch (err) {
    let message = "";
    if (err.message === "contacts.map is not a function") {
      message = "You must specify an array of contact emails";
    } else {
      message = err.message.replace(/Campaign validation failed:/g, "").trim();
    }
    res.status(400).json({
      error: {
        message,
      },
    });
  }
};

const sendEmails = async (req, res) => {
  const campaignID = req.params.id;

  try {
    const campaignInfo = await Campaign.findById(campaignID);

    if (!campaignInfo)
      throw new Error("ID not associated to any known campaign");

    if (!campaignInfo.isActive)
      throw new Error(
        "The campaign you're trying to send is inactive, please activate it and try again"
      );

    const mails = await Promise.all(
      campaignInfo._contacts.map(async (val) => {
        let contact = await Contact.findById(val);
        return contact.email;
      })
    );

    const infoShown = {
      description: campaignInfo.description,
      startingDate: campaignInfo.startAt,
      endingDate: campaignInfo.endAt,
    };

    await sendEmail(mails.join(", "), infoShown);

    res.status(200).json({ success: [campaignInfo._contacts.join(", ")] });
  } catch (err) {
    let message = "";

    if (err.message.includes(campaignID)) {
      message = `Invalid ID ${campaignID}`;
    } else {
      message = err.message;
    }
    res.status(400).json({
      error: {
        message,
      },
    });
  }
};

module.exports = {
  createCampaign,
  sendEmails,
};
