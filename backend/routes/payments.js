const express = require("express");
const {
  getPendingVendorPayments,
  makeVendorPayment,
  processVendorPayment, // ✅ Added this import
} = require("../controllers/paymentcontroller"); // ✅ Correct controller import

const router = express.Router();

// Route to get pending payments
router.get("/pending", getPendingVendorPayments);

// Route to make a payment to a vendor
router.post("/pay", makeVendorPayment);

// Route to process payment via Stripe (or other logic)
router.post("/process", processVendorPayment); // ✅ Fixed route

module.exports = router;
