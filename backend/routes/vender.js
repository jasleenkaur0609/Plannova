const express = require("express");
const router = express.Router();
const venderController = require("../controllers/vendercontroller");
const verifyToken=require("../middleware/authMiddleware")
const {uploadProfile} = require("../utils/multer");

router
  .get("/getAllVender", venderController.getAllVender)
  .get("/getRole", verifyToken, venderController.getRole)
  .get("/bookings", verifyToken, venderController.getVendorBookings)
  .get("/booked-dates", verifyToken, venderController.getBookedDates)
  .get("/blocked-dates", verifyToken, venderController.getBlockedDates)
  .get("/completed-bookings", verifyToken, venderController.getCompletedBookings)
  .get("/reviews", verifyToken, venderController.getVendorReviews)
  .patch("/bookings", verifyToken, venderController.changeBookingStatus)
  .post("/createVender", uploadProfile.single("profilePic"), venderController.createVender)
  .post("/set-blocked-dates", verifyToken, venderController.setBlockedDates)
  .put("/updateProfile", verifyToken, venderController.updateProfile)
  .get("/getVender", verifyToken, venderController.getVender)
  .delete("/deleteVender",venderController.deleteVender)

module.exports = router;
