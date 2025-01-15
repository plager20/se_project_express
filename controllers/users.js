const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const createUser = (req, res) => {
  try {
    const { email, password, name, avatar } = req.body;

    if (!email || !password || !name || !avatar) {
      res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "All fields are required" });
      return;
    }

    User.findOne({ email })
      .then((existingUser) => {
        if (existingUser) {
          const error = new Error("Email already exists");
          error.code = 11000;
          throw error;
        }
        return bcrypt.hash(password, 10);
      })
      .then((hashedPassword) => {
        if (!hashedPassword) return null;

        return User.create({ name, avatar, email, password: hashedPassword });
      })
      .then((user) => {
        if (user) {
          const userObject = user.toObject();
          delete userObject.password;
          res.status(201).send(userObject);
        }
      })
      .catch((err) => {
        console.error("An error occured while creating user", err);
        if (err.name === "ValidationError") {
          return res
            .status(ERROR_CODES.BAD_REQUEST)
            .send({ message: ERROR_MESSAGES.BAD_REQUEST });
        }
        if (err.code === 11000) {
          return res
            .status(ERROR_CODES.CONFLICT)
            .send({ message: "Email already exists" });
        }
        return res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: ERROR_MESSAGES.SERVER_ERROR });
      });
  } catch (err) {
    res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(ERROR_CODES.UNAUTHORIZED)
          .send({ message: ERROR_MESSAGES.UNAUTHORIZED });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user?._id;
  User.findById(userId)
    .orFail()
    .select("-password")
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ID_FORMAT });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ID_FORMAT });
        return;
      }
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

module.exports = { getCurrentUser, createUser, login, updateUser };
