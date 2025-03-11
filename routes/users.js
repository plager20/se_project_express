const router = require("express").Router();
const { authorize } = require("../middlewares/auth");
const { celebrate } = require("celebrate");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", authorize, getCurrentUser);
router.patch("/me", celebrate, authorize, updateUser);

module.exports = router;
