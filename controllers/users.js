const User = require("../models/user");

//GET /users

const getUsers = (req, res) => {
  console.log("IN CONTROLLER");
  // User.find({})
  //   .then((users) => res.status(200).send(users))
  //   .catch((err) => {
  //     console.error(err);
  //     return res.status(500).send({ message: err.message });
  //   });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser };
