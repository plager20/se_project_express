const clothingItem = require("../models/clothingItem");
const ClothingItems = require("../models/clothingItem");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const BadRequestError = require("../errors/badrequest");
const NotFoundError = require("../errors/notfound");

const getClothingItems = (req, res, next) => {
  ClothingItems.find({})
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      return next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItems.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid request"));
      }
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
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return res
          .status(ERROR_CODES.FORBIDDEN)
          .send({ message: ERROR_MESSAGES.FORBIDDEN });
      }
      return clothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        if (!deletedItem) {
          return res
            .status(ERROR_CODES.NOT_FOUND)
            .send(ERROR_MESSAGES.NOT_FOUND);
        }
        if (!itemId) {
          res
            .status(ERROR_CODES.BAD_REQUEST)
            .send({ message: "Item ID is required" });
          return;
        }
        return res
          .status(200)
          .send({ message: "Item deleted successfully", data: deletedItem });
      });
    })

    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
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
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
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
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      return next(err);
    });
};

module.exports = {
  getClothingItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
