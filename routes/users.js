const router = require("express").Router();
const { authorize } = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUserInfoBody } = require("../middlewares/validation");

router.get("/me", authorize, getCurrentUser);
router.patch("/me", validateUserInfoBody, authorize, updateUser);

module.exports = router;
