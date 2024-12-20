const router = require("express").Router();
//const { getUsers, createUser } = require("../controllers/users");

router.get("/", () => console.log("getUsers"));
// router.get("/:userId", () => console.log("getUser"));
// router.post("/", () => console.log("createUser"));

module.exports = router;
