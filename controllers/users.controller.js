const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config("../.env");

const authenticate = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username: username,
      password: crypto.createHash("sha256").update(password).digest("hex"),
    });

    if (user) {
      const tokenExpiresIn = new Date().getTime() + 5 * 60000;
      const token = jwt.sign(
        {
          userId: user._id,
          expiresIn: tokenExpiresIn,
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({ jwt: token, expiration_date: tokenExpiresIn });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(400).json({ error: { message: "Something wrong occured" } });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v -password");

    res.status(200).json({ amount: users.length, users });
  } catch (err) {
    console.log(err);
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, password, roles } = req.body;
    const user = await User.create({
      username,
      password,
      roles,
    });

    res.status(200).json({
      success: {
        message: `New user ${user.username} created`,
      },
    });
  } catch (err) {
    let message = "";
    if (err.message.includes("E11000")) {
      message = "Username already in use, please try another one!";
    } else {
      message = "Something went wrong!";
    }

    res.status(400).json({ error: { message } });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, password, roles } = req.body;

  try {
    const userTobeUpdated = await User.findById(userId);
    if (!userTobeUpdated) throw new Error(`Invalid ID ${userId}`);

    userTobeUpdated.username = username;
    userTobeUpdated.password = password;
    userTobeUpdated.roles = roles;

    await userTobeUpdated.save();

    res.status(200).json({ success: { message: `${username} updated` } });
  } catch (err) {
    let message = "";
    if (err.message.includes("E11000")) {
      message = "Username already in use, please try another one!";
    } else if (err.message.includes(userId)) {
      message = `Invalid ID ${userId}`;
    } else {
      message = "Please verify that you provide a username and a password";
    }
    res.status(400).json({
      error: {
        message,
      },
    });
  }
};

const addRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  try {
    const userTobeUpdated = await User.findById(userId);
    if (!userTobeUpdated) throw new Error(`Invalid ID ${userId}`);

    const currentRoles = userTobeUpdated.roles;

    let message = "";

    if (currentRoles.includes(role)) {
      message = `User ${userTobeUpdated.username} already has role ${role}`;
    } else {
      userTobeUpdated.roles.push(role);
      await userTobeUpdated.save();
      message = `Role of ${userTobeUpdated.username} updated`;
    }

    res.status(200).json({
      success: { message },
    });
  } catch (err) {
    let message = "";

    if (err.message.includes(userId)) {
      message = `Invalid ID ${userId}`;
    } else {
      message =
        "Please make sure to give the role a valid value (admin, user or both)";
    }
    res.status(400).json({
      error: {
        message,
      },
    });
  }
};

const getUserRoles = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user.roles;
};

module.exports = {
  authenticate,
  getUsers,
  registerUser,
  updateUser,
  addRole,
  getUserRoles,
};
