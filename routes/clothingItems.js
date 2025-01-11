const router = require("express").Router();
const {
  getClothingItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { authorize } = require("../middlewares/auth");

router.get("/", getClothingItems);
router.post("/", authorize, createItem);
router.delete("/:itemId", authorize, deleteItem);
router.put("/:itemId/likes", authorize, likeItem);
router.delete("/:itemId/likes", authorize, dislikeItem);

module.exports = router;
