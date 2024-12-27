const router = require("express").Router();
const {
  getClothignItems,
  createItem,
} = require("../controllers/clothingItems");

router.get("/", getClothignItems);
router.post("/", createItem);

module.exports = router;
