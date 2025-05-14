const { connectToDatabase } = require("../database");
const { Parser } = require("json2csv");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const validator=require("validator");
const { ObjectId } = require("mongodb");

module.exports.createAdmin = async function (req, res) {
  try {
    const db = await connectToDatabase();
    console.log("Database connected successfully!");

    const { name, email, phone, uid } = req.body;

    // If a file is uploaded via multer, extract its filename
    const profilePic = req.file ? req.file.filename : null;

    // Validation
    if (!name || !email || !phone || !uid) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (!validator.isMobilePhone(phone, "any")) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    const vendorData = {
      name,
      email,
      phone,
      uid,
      profilePic, // null if not uploaded
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("admins").insertOne(vendorData);

    res.status(201).json({
      message: "Admin Created Successfully",
      vendorId: result.insertedId,
    });
  } catch (error) {
    console.error("Create Admin Error:", error.message);
    res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
};

module.exports.getAdmin = async function (req, res) {
  try {
    const db = await connectToDatabase();
    const admin = await db.collection("admins").findOne({ email: req.body.email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json({ id: admin._id, data: admin });
  } catch (error) {
    console.error("Get Admin Error:", error.message);
    res.status(500).json({ message: "Failed to get admin", error: error.message });
  }
};

module.exports.getAllAdmin = async function (req, res) {
  try {
    const db = await connectToDatabase();
    const admins = await db.collection("admins").find({}).toArray();
    res.status(200).json(admins.map((admin) => ({ id: admin._id, data: admin })));
  } catch (error) {
    console.error("Get All Admins Error:", error.message);
    res.status(500).json({ message: "Failed to get admins", error: error.message });
  }
};

// --- Transaction Controller with Enhanced Features ---
module.exports.getTransactions = async function (req, res) {
  try {
    const db = await connectToDatabase();
    const {
      page = 1,
      type,
      status,
      search = '',
      startDate,
      endDate,
    } = req.query;

    const limit = 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: "i" } },
        { eventName: { $regex: search, $options: "i" } },
      ];
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const transactions = await db
      .collection("transactions")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("transactions").countDocuments(filter);

    // Flag suspicious ones
    const flagged = transactions.map((t) => ({
      ...t,
      flagged: t.amount > 100000, // Example threshold
    }));

    res.status(200).json({ transactions: flagged, total });
  } catch (error) {
    console.error("Get Transactions Error:", error.message);
    res.status(500).json({ message: "Failed to get transactions", error: error.message });
  }
};

// ✅ Export CSV
module.exports.exportCSV = async function (req, res) {
  try {
    const db = await connectToDatabase();
    const transactions = await db.collection("transactions").find({}).toArray();

    const parser = new Parser();
    const csv = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    return res.send(csv);
  } catch (error) {
    console.error("CSV Export Error:", error.message);
    res.status(500).json({ message: "CSV Export Failed", error: error.message });
  }
};

// ✅ Download All Receipts as ZIP
module.exports.downloadAllReceipts = async function (req, res) {
  try {
    const receiptsPath = path.join(__dirname, "../uploads/receipts");
    const archive = archiver("zip");

    res.attachment("all_receipts.zip");
    archive.pipe(res);

    fs.readdirSync(receiptsPath).forEach((file) => {
      archive.file(`${receiptsPath}/${file}`, { name: file });
    });

    archive.finalize();
  } catch (error) {
    console.error("ZIP Error:", error.message);
    res.status(500).json({ message: "ZIP download failed", error: error.message });
  }
};

// ✅ Download Individual Receipt
module.exports.downloadReceipt = async function (req, res) {
  try {
    const file = req.params.filename;
    const filepath = path.join(__dirname, "../uploads/receipts", file);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: "Receipt not found" });
    }
    res.download(filepath);
  } catch (error) {
    console.error("Download Receipt Error:", error.message);
    res.status(500).json({ message: "Download failed", error: error.message });
  }
};

module.exports.getAllServices = async function (req, res) {
  try {
    const db = await connectToDatabase();

    // Step 1: Get all services
    const services = await db.collection("services").find({}).toArray();

    // Step 2: Get unique vendor IDs from services
    const vendorIds = [
      ...new Set(services.map(service => new ObjectId(service.vendor)))
    ];

    // Step 3: Fetch vendor documents
    const vendors = await db.collection("venders")
      .find({ _id: { $in: vendorIds } })
      .project({ name: 1 })
      .toArray();

    // Step 4: Create vendor ID to name map
    const vendorMap = vendors.reduce((acc, vendor) => {
      acc[vendor._id.toString()] = vendor.name;
      return acc;
    }, {});

    // Step 5: Format services with vendor name
    const formattedServices = services.map(service => ({
      ...service,
      vendor: vendorMap[service.vendor] || "Unknown Vendor"
    }));

    res.status(200).json({ success: true, services: formattedServices });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
};

