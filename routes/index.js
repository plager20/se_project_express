const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { celebrate } = require("celebrate");
const NotFoundError = require("../errors/notfound");

router.post("/signin", celebrate, login);
router.post("/signup", celebrate, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  return next(new NotFoundError("Not Found"));
});

module.exports = router;
