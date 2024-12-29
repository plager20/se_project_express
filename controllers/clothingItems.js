const clothingItem = require("../models/clothingItem");
const ClothingItems = require("../models/clothingItem");

const getClothignItems = (req, res) => {
  ClothingItems.find({})
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItems.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send({}))
    .catch((err) => {
      if (err.name == "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(400).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name == "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name == "DocumentNotFoundError") {
        console.log(err);
        return res.status(404).send({ message: err.message });
      }
      console.log(err.message);
      return res.status(400).send({ message: err.message });
    });
};

module.exports = {
  getClothignItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
