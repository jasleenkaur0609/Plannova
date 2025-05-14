const { connectToDatabase } = require("../database");
const { ObjectId } = require("mongodb");

// Function to handle making a vendor payment
const makeVendorPayment = async (req, res) => {
  const { paymentId } = req.body;

  try {
    const db = await connectToDatabase();
    const vendorPayment = await db.collection("vendorPayments").findOne({ _id: new ObjectId(paymentId) });

    if (!vendorPayment) {
      return res.status(404).json({ success: false, message: "Vendor payment not found" });
    }

    // Mock payment successful
    const paidAt = new Date();
    const transactionRef = "TXN-" + Date.now();

    // 1. Update the vendorPayments record
    await db.collection("vendorPayments").updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status: "paid",
          paidAt,
          transactionRef,
        }
      }
    );

    // 2. Insert a new transaction entry
    await db.collection("transactions").insertOne({
      from: "admin",
      to: vendorPayment.vendorId,
      eventId: vendorPayment.eventId,
      userId: vendorPayment.userId,
      service: vendorPayment.serviceName,
      amount: vendorPayment.amount,
      type: "vendor-payment",
      initiatedBy: "admin",
      status: "success",
      createdAt: paidAt,
      transactionRef,
    });

    res.status(200).json({ success: true, message: "Payment successful and transaction recorded." });

  } catch (error) {
    console.error("Error making vendor payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Function to get pending vendor payments
const getPendingVendorPayments = async (req, res) => {
  console.log("Hello");
  try {
    console.log("Hii");
    const db = await connectToDatabase();
    const pendingPayments = await db.collection("vendorPayments").find({ status: "pending" }).toArray();
    res.status(200).json({ success: true, data: pendingPayments });
  } catch (error) {
    console.error("Error fetching vendor payments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  makeVendorPayment,
  getPendingVendorPayments,
};
