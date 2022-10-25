const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const {
  authenticationMiddleware,
  authorizationMiddleware,
} = require("../utils/middlewares");

router
  .post("/authenticate", userController.authenticate)
  .post(
    "/",
    authenticationMiddleware,
    authorizationMiddleware,
    userController.registerUser
  )
  .put(
    "/:id",
    authenticationMiddleware,
    authorizationMiddleware,
    userController.updateUser
  )
  .patch(
    "/:id",
    authenticationMiddleware,
    authorizationMiddleware,
    userController.addRole
  )
  .get(
    "/",
    authenticationMiddleware,
    authorizationMiddleware,
    userController.getUsers
  );

module.exports = router;
