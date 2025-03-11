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
router.post("/", validateCardBody, authorize, createItem);
router.delete("/:itemId", validateId, authorize, deleteItem);
router.put("/:itemId/likes", validateId, authorize, likeItem);
router.delete("/:itemId/likes", validateId, authorize, dislikeItem);

module.exports = router;
