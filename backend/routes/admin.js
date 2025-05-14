const express = require("express");
const router = express.Router();
const {uploadProfile, uploadService} = require("../utils/multer");
const adminController = require("../controllers/admincontroller");

// Admin routes
router.get("/getAllAdmin", adminController.getAllAdmin);
router.get("/getAllServices", adminController.getAllServices);
router.post("/createAdmin", uploadProfile.single("profilePic"), adminController.createAdmin);
router.post("/getAdmin", adminController.getAdmin);

// ✅ Transaction features
router.get("/transactions", adminController.getTransactions);
router.get("/exportCSV", adminController.exportCSV);
router.get("/downloadReceiptsZip", adminController.downloadAllReceipts);
router.get("/downloadReceipt/:filename", adminController.downloadReceipt);

module.exports = router;
