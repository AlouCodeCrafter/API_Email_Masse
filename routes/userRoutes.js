const router = require("express").Router();
const { Route } = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

//User
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.userUpdate);
router.delete("/:id", userController.userDelete);

// auth Controller
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.post("/logout", authController.logout);

module.exports = router;
