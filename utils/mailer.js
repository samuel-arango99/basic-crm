const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "42f684f2411a0d",
    pass: "600945c21dfd97",
  },
});

const sendEmail = async (mailTo, campaign) => {
  await transport.sendMail({
    from: "node-crm@sas.com",
    to: mailTo,
    subject: "You've been included in a campaign!",
    text: `Hello user, you've been included in a campaign with the following information: \n
            Description: ${campaign.description}. \n
            Starting at: ${campaign.startingDate}. \n
            Ending at: ${campaign.endingDate}`,
  });
};

module.exports = sendEmail;
