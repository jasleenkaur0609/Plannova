const validator = require("validator");
const { connectToDatabase } = require("../database");

module.exports.createUser = async function (req, res) {
  try {
    const db = await connectToDatabase();
    const { name, email, phone, uid } = req.body;
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

    const newUser = {
      name,
      email,
      phone,
      uid,
      profilePic,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({
      message: "User Created Successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Create User Error:", error.message);
    res.status(500).json({ error: "Failed to create user" });
  }
};

module.exports.getUser = async function (req, res) {
  try {
    const db = await connectToDatabase();
    const userEmail = req.body.email;

    const user = await db.collection("customers").findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      data: user
    });
  } catch (error) {
    console.error("Get User Error:", error.message);
    res.status(500).json({ message: "Failed to get user", error: error.message });
  }
};

// Get all users
module.exports.getAllUser = async function (req, res) {
  try {
    const db = await connectToDatabase();
    const users = await db.collection("users").find({}).toArray();

    const formattedUsers = users.map(user => ({
      id: user._id,
      data: user
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Get All Users Error:", error.message);
    res.status(500).json({ message: "Failed to get users", error: error.message });
  }
};

// Delete user by email
module.exports.deleteUser = async function (req, res) {
  try {
    const db = await connectToDatabase();
    const userEmail = req.query.email;

    const result = await db.collection("customers").deleteMany({ email: userEmail });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User(s) deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};