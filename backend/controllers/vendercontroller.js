const { connectToDatabase } = require("../database");
const { ObjectId } = require("mongodb");
const { createCalendarEvent } = require("../utils/googleCalendar");
const validator=require("validator")

module.exports.createVender = async function (req, res) {
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

    const result = await db.collection("venders").insertOne(vendorData);

    res.status(201).json({
      message: "Vendor Created Successfully",
      vendorId: result.insertedId,
    });
  } catch (error) {
    console.error("Create Vendor Error:", error.message);
    res.status(500).json({
      message: "Failed to create vendor",
      error: error.message,
    });
  }
};

module.exports.getVender = async function (req, res) {
    const db = await connectToDatabase();
  
    const vendor = await db.collection("venders").findOne({ uid : req.user.uid });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
  
    res.json(vendor);
};

module.exports.getAllVender = async function (req, res) {
  try {
    const db = await connectToDatabase();
    const vendors = await db.collection("venders").find({}).toArray();

    const list = vendors.map(vendor => ({
      id: vendor._id,
      data: vendor,
    }));

    res.status(200).json(list);
  } catch (error) {
    console.error("Get All Vendors Error:", error.message);
    res.status(500).json({ message: "Failed to get vendors", error: error.message });
  }
};

module.exports.getVendorBookings = async (req, res) => {
  try {
    const db = await connectToDatabase();

    const vendor = await db.collection("venders").findOne({ uid : req.user.uid });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    const bookings = await db.collection("bookingRequests").aggregate([
      { $match: { vendorId: vendor._id } },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$customer" },
      { $unwind: "$service" },
      { $unwind: "$event" },
      {
        $project: {
          vendorStatus: 1,
          createdAt: 1,
          status: 1,
          customerName: "$customer.name",
          serviceName: "$service.name",
          price: "$service.price",
          eventName: "$event.name",
          startDate: "$event.startDate",
          endDate: "$event.endDate",
          location: "$event.location"
        },
      },
    ]).toArray();

    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching vendor bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.getBookedDates = async (req, res) => {
  try {
    const db = await connectToDatabase();

    const vendor = await db.collection("venders").findOne({ uid: req.user.uid });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const bookings = await db.collection("bookingRequests").find({
      vendorId: vendor._id,
      status: "Accepted"
    }).toArray();

    const bookedDatesSet = new Set();

    for (const booking of bookings) {
      const event = await db.collection("events").findOne({ _id: booking.eventId });

      if (event?.startDate && event?.endDate) {
        let currentDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        while (currentDate <= endDate) {
          bookedDatesSet.add(currentDate.toLocaleDateString("en-CA"));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }

    const bookedDates = Array.from(bookedDatesSet);
    return res.json({ bookedDates });

  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.changeBookingStatus = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { bookingId, status } = req.body;

    const validStatuses = ["Accepted", "Declined", "Completed", "Pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const objectId = ObjectId.createFromHexString(bookingId);

    const booking = await db.collection("bookingRequests").findOne({ _id: objectId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking status
    await db.collection("bookingRequests").updateOne(
      { _id: objectId },
      { $set: { status } }
    );

    // Handle accepted status - create calendar events
    if (status === "Accepted") {
      const customer = await db.collection("users").findOne({ _id: booking.customerId });
      const vendor = await db.collection("venders").findOne({ _id: booking.vendorId });
      const service = await db.collection("services").findOne({ _id: booking.serviceId });
      const event = await db.collection("events").findOne({ _id: booking.eventId });

      //const customerTokens = await db.collection("googleTokens").findOne({ uid: customer.uid });
      //const vendorTokens = await db.collection("googleTokens").findOne({ uid: vendor.uid });

      //if (!customerTokens || !vendorTokens) {
        console.warn("Skipping calendar creation: Missing Google tokens.");
        return res.json({ message: `Booking status updated to ${status}, but calendar events were not created.` });
     // }

      const eventDetails = {
        summary: `${service.name} Booking - ${event.name}`,
        description: `Booking confirmed with ${vendor.name} for event: ${event.name}`,
        location: event.location,
        start: event.startDate,
        end: event.endDate,
      };

      await createCalendarEvent(customer.uid, {
        ...eventDetails,
        summary: `Service with ${vendor.name} - ${service.name}`,
      });

      await createCalendarEvent(vendor.uid, {
        ...eventDetails,
        summary: `Service for ${customer.name} - ${service.name}`,
      });
    }

    // Handle completed status - move to completedBookings and delete from bookingRequests
    if (status === "Completed") {
      const completedBooking = {
        customerId: booking.customerId,
        serviceId: booking.serviceId,
        vendorId: booking.vendorId,
        eventId: booking.eventId,
        completedAt: new Date(),
        amount: booking.price || 0,
        status: "pending",
        paymentDetails: {
          method: null,
          paymentId: null,
        },
        hasReviewed: false,
      };

      await db.collection("completedBookings").insertOne(completedBooking);
      await db.collection("bookingRequests").deleteOne({ _id: objectId });
    }

    return res.json({ message: `Booking status updated to ${status}` });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.getCompletedBookings = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const vendorFirebaseUID = req.user.uid;

    const vendor = await db.collection("venders").findOne({ uid: vendorFirebaseUID });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Get all completed bookings for this vendor
    const completedBookings = await db
      .collection("completedBookings")
      .find({ vendorId: vendor._id })
      .sort({ completedAt: -1 })
      .toArray();

    // Collect IDs
    const serviceIds = [...new Set(completedBookings.map(b => b.serviceId.toString()))];
    const customerIds = [...new Set(completedBookings.map(b => b.customerId.toString()))];
    const eventIds = [...new Set(completedBookings.map(b => b.eventId.toString()))];

    // Fetch related data
    const services = await db
      .collection("services")
      .find({ _id: { $in: serviceIds.map(id => new ObjectId(id)) } })
      .toArray();

    const customers = await db
      .collection("users")
      .find({ _id: { $in: customerIds.map(id => new ObjectId(id)) } })
      .toArray();

    const events = await db
      .collection("events")
      .find({ _id: { $in: eventIds.map(id => new ObjectId(id)) } })
      .toArray();

    // Create maps
    const serviceMap = {};
    services.forEach(s => (serviceMap[s._id.toString()] = s.name));

    const customerMap = {};
    customers.forEach(c => (customerMap[c._id.toString()] = c.name));

    const eventMap = {};
    events.forEach(e => (eventMap[e._id.toString()] = e.name));

    // Prepare final response
    const cleanedBookings = completedBookings.map(booking => ({
      _id: booking._id,
      customerName: customerMap[booking.customerId.toString()] || "Unknown Customer",
      eventName: eventMap[booking.eventId.toString()] || "Unknown Event",
      serviceName: serviceMap[booking.serviceId.toString()] || "Unknown Service",
      amount: booking.amount,
      status: booking.status,
      completedAt: booking.completedAt,
    }));

    return res.json(cleanedBookings);
  } catch (error) {
    console.error("Error fetching completed bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.getBlockedDates= async function (req, res) {
  try {
    const db = await connectToDatabase();
    const vendorId = req.user.uid; // Vendor's Firebase UID

    const vendor = await db.collection('venders').findOne({ uid: vendorId });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ blockedDates: vendor.blockedDates || [] });
  } catch (error) {
    console.error("Error fetching blocked dates:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports.setBlockedDates = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const vendorId = req.user.uid; // assuming `uid` is set in the token middleware
    const { blockedDates } = req.body;

    if (!Array.isArray(blockedDates)) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    await db.collection("venders").updateOne(
      { uid: vendorId },
      { $set: { blockedDates } },
      { upsert: true }
    );

    res.status(200).json({ message: "Blocked dates updated successfully." });
  } catch (error) {
    console.error("Error updating blocked dates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getVendorReviews = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const vendorFirebaseUID = req.user.uid;

    // Get vendor by UID
    const vendor = await db.collection("venders").findOne({ uid: vendorFirebaseUID });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Fetch all reviews (we'll filter by vendorId after populating completedBookings)
    const allReviews = await db.collection("vendorReviews").find().toArray();

    const filteredAndPopulatedReviews = await Promise.all(
      allReviews.map(async (review) => {
        const booking = await db.collection("completedBookings").findOne({ _id: review.bookingId });
        if (!booking || String(booking.vendorId) !== String(vendor._id)) {
          return null; // Skip if not matching vendor
        }

        const customer = await db.collection("users").findOne(
          { _id: booking.customerId },
          { projection: { name: 1 } }
        );
        const service = await db.collection("services").findOne(
          { _id: booking.serviceId },
          { projection: { name: 1 } }
        );
        const event = await db.collection("events").findOne(
          { _id: booking.eventId },
          { projection: { name: 1 } }
        );

        return {
          ...review,
          customerName: customer?.name || "Unknown Customer",
          serviceName: service?.name || "Unknown Service",
          eventName: event?.name || "Unknown Event",
        };
      })
    );

    const reviews = filteredAndPopulatedReviews.filter(Boolean); // Remove nulls

    return res.json({ reviews });
  } catch (error) {
    console.error("Error fetching vendor reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.updateProfile = async function (req, res) {
  const { email, phone } = req.body;
  const firebaseUID = req.user.uid;

  if (!email || !phone)
    return res.status(400).json({ message: "Email and phone required" });

  const db = await connectToDatabase();

  const result = await db.collection("venders").updateOne(
    { firebaseUID },
    { $set: { email, phone } }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Vendor not found" });
  }

  res.status(200).json({ message: "Profile updated" });
}

module.exports.deleteVender = async function (req, res) {
  try {
    const db = await connectToDatabase();
    const userEmail = req.query.email; // Use req.query to access email sent as query parameter

    console.log("Email:", userEmail);
    
    const result = await db.collection("venders").deleteMany({ email: userEmail });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Delete Vendor Error:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports.getRole=async(req,res)=>{
  try {
    const db = await connectToDatabase();
    let user = await db.collection("venders").findOne({ uid: req.user.uid });
    if (user) return res.json({ role: "vendor" });

    user = await db.collection("users").findOne({ uid: req.user.uid });
    if (user) return res.json({ role: "customer" });

    user = await db.collection("admins").findOne({ uid: req.user.uid });
    if (user) return res.json({ role: "admin" });

    return res.status(404).json({ message: "User not found" });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
}