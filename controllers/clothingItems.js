const clothingItem = require("../models/clothingItem");
const ClothingItems = require("../models/clothingItem");
const BadRequestError = require("../errors/badrequest");
const NotFoundError = require("../errors/notfound");
const ForbiddenError = require("../errors/forbidden");

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
        return next(new BadRequestError("Missing owner in request"));
      }
      if (!name || !weather || !imageUrl) {
        return next(new BadRequestError("All fields are required"));
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
        return next(
          new ForbiddenError("You are not authorized to perorm this action.")
        );
      }
      return clothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        if (!deletedItem) {
          return next(new NotFoundError("Item not found"));
        }
        if (!itemId) {
          return next(new BadRequestError("Item Id is required"));
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
