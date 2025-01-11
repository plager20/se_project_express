const clothingItem = require("../models/clothingItem");
const ClothingItems = require("../models/clothingItem");
const { ERROR_CODES, ERROR_MESSAGES, handleError } = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItems.find({})
    .then((item) => res.status(200).send(item))
    .catch((err) => handleError(err, res));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  if (!owner) {
    console.error("Missing owner in request");
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.MISSING_OWNER });
  }
  if (!name || !weather || !imageUrl) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.MISSING_FIELDS });
  }

  return ClothingItems.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => handleError(err, res));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  if (!itemId) {
    res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Item ID is required" });
    return;
  }

  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return res.status(ERROR_CODES.FORBIDDEN).send(ERROR_MESSAGES.FORBIDDEN);
      }
      return clothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        if (!deletedItem) {
          return res
            .status(ERROR_CODES.NOT_FOUND)
            .send(ERROR_MESSAGES.NOT_FOUND);
        }
        return res
          .status(200)
          .send({ message: "Item deleted successfully", data: deletedItem });
      });
    })

    .catch((err) => {
      handleError(err, res);
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
    .catch((err) => handleError(err, res));
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
    .catch((err) => handleError(err, res));
};

module.exports = {
  getClothingItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
