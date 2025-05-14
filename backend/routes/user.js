const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller");
const {uploadProfile}=require("../utils/multer")

router
  .get("/getAllUser", userController.getAllUser)
  .post("/createUser", uploadProfile.single("profilePic"), userController.createUser)
  .post("/getUser", userController.getUser)
  .delete("/deleteUser",userController.deleteUser);

module.exports = router;
