const router = require("express").Router();

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", getUsers);

module.exports = router;
