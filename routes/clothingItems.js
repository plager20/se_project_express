const router = require("express").Router();
const {
  getClothingItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { authorize } = require("../middlewares/auth");
const { validateCardBody } = require("../middlewares/validation");

router.get("/", getClothingItems);
router.post("/", validateCardBody, authorize, createItem);
router.delete("/:itemId", validateCardBody, authorize, deleteItem);
router.put("/:itemId/likes", validateCardBody, authorize, likeItem);
router.delete("/:itemId/likes", validateCardBody, authorize, dislikeItem);

module.exports = router;
