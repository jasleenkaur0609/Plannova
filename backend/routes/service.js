const express = require("express");
const router = express.Router();
const serviceController=require('../controllers/servicecontroller');
const verifyToken=require("../middleware/authMiddleware")
const {uploadService} = require("../utils/multer");

router
.post("/addService", uploadService.single("ServiceImage"), verifyToken, serviceController.addService)
.get("/getServices", verifyToken, serviceController.getServices)
.put("/editService/:id", uploadService.single("ServiceImage"), verifyToken, serviceController.editService)
.delete("/deleteService/:id", verifyToken, serviceController.deleteService)


module.exports = router;
