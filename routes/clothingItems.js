const router = require("express").Router();
const { celebrate } = require("celebrate");
const {
  getClothingItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { authorize } = require("../middlewares/auth");

router.get("/", getClothingItems);
router.post("/", celebrate, authorize, createItem);
router.delete("/:itemId", celebrate, authorize, deleteItem);
router.put("/:itemId/likes", celebrate, authorize, likeItem);
router.delete("/:itemId/likes", celebrate, authorize, dislikeItem);

module.exports = router;
