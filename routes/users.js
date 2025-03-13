const router = require("express").Router();
const { authorize } = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUserUpdateBody } = require("../middlewares/validation");

router.get("/me", authorize, getCurrentUser);
router.patch("/me", authorize, validateUserUpdateBody, updateUser);

module.exports = router;
