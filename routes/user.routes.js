const express = require("express");
const {
  handleUserRegister,
  handleUserLogin,
  handleGetAllUsers,
  handleGetCurrentUser,
  handleUpdateUser,
  handleDeleteUser,
  handleGetAvailableUsers,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", handleUserRegister);
router.post("/login", handleUserLogin);

router.get("/get-all-users", handleGetAllUsers);
router.get("/get-current-user", handleGetCurrentUser);

router.get("/available-users/:userId", handleGetAvailableUsers);

router.delete("/delete-user", handleDeleteUser);

router.put("/update-user/:id", handleUpdateUser);

module.exports = router;
