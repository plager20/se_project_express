const router = require("express").Router();
const {
  getClothingItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { authorize } = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

router.get("/", getClothingItems);
router.post("/", authorize, validateCardBody, createItem);
router.delete("/:itemId", authorize, validateId, deleteItem);
router.put("/:itemId/likes", authorize, validateId, likeItem);
router.delete("/:itemId/likes", authorize, validateId, dislikeItem);

module.exports = router;
