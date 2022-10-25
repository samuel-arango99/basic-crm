const express = require("express");
const router = express.Router();
const contactsController = require("../controllers/contacts.controller");
const {
  authenticationMiddleware,
  authorizationMiddleware,
} = require("../utils/middlewares");

router
  .get(
    "/",
    authenticationMiddleware,
    authorizationMiddleware,
    contactsController.getContacts
  )
  .post("/", authenticationMiddleware, contactsController.createContact)
  .put("/:id", authenticationMiddleware, contactsController.updateContact)
  .delete(
    "/:id",
    authenticationMiddleware,
    authorizationMiddleware,
    contactsController.deleteContact
  );

module.exports = router;
