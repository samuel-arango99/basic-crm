const express = require("express");
const router = express.Router();
const campaignsController = require("../controllers/campaigns.controller");
const { authenticationMiddleware } = require("../utils/middlewares");

router
  .post("/", authenticationMiddleware, campaignsController.createCampaign)
  .post(
    "/:id/send_emails",
    authenticationMiddleware,
    campaignsController.sendEmails
  );

module.exports = router;
