const { connectToDatabase } = require("../database");
const { ObjectId } = require("mongodb");

module.exports.createEvent = async function (req, res) {
  try {
    const db = await connectToDatabase();
    const {
      name,
      startDate,
      endDate,
      location,
      description,
      estimatedCost,
      services, // still needed here to loop over
    } = req.body;

    const customerUID = req.user.uid;
    const customer = await db.collection("users").findOne({ uid: customerUID });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customerId = customer._id;

    // 1. Insert the event without 'services'
    const newEvent = {
      name,
      createdBy: customerId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      description,
      estimatedCost,
      createdAt: new Date(),
      bookingRequests: [] // will be updated shortly
    };

    const result = await db.collection("events").insertOne(newEvent);

    if (!result.insertedId) {
      return res.status(500).json({ message: "Failed to create event" });
    }

    const eventId = result.insertedId;

    // 2. Create booking requests for each service
    const bookingRequests = services.map(async (serviceId) => {
      const service = await db.collection("services").findOne({
        _id: new ObjectId(serviceId),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const bookingRequest = {
        eventId,
        customerId,
        serviceId: service._id,
        vendorId: service.vendor,
        status: "Pending",
        price: service.price,
        createdAt: new Date(),
      };

      const bookingResult = await db.collection("bookingRequests").insertOne(bookingRequest);
      return bookingResult.insertedId;
    });

    const bookingRequestIds = await Promise.all(bookingRequests);

    // 3. Update the event with the bookingRequest IDs
    await db.collection("events").updateOne(
      { _id: eventId },
      { $set: { bookingRequests: bookingRequestIds } }
    );

    res.status(200).json({
      message: "Event created and booking requests sent",
      bookingRequestIds,
    });

  } catch (error) {
    console.error("Error in createEvent:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.getUserEvents = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const customer = await db.collection("users").findOne({ uid: req.user.uid });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // 1. Get all events for the customer
    const events = await db
      .collection("events")
      .find({ createdBy: customer._id })
      .sort({ createdAt: -1 })
      .toArray();

    // 2. Extract all booking request IDs
    const allBookingRequestIds = events.flatMap(event =>
      event.bookingRequests || []
    ).map(id => new ObjectId(id));

    // 3. Fetch all booking requests
    const bookingRequests = await db.collection("bookingRequests")
      .find({ _id: { $in: allBookingRequestIds } })
      .toArray();

    // 4. Collect all unique service and vendor IDs
    const serviceIds = [...new Set(bookingRequests.map(req => req.serviceId.toString()))]
      .map(id => new ObjectId(id));
    const vendorIds = [...new Set(bookingRequests.map(req => req.vendorId.toString()))]
      .map(id => new ObjectId(id));

    // 5. Fetch services and vendors
    const serviceDocs = await db.collection("services")
      .find({ _id: { $in: serviceIds } }).toArray();
    const vendorDocs = await db.collection("venders")
      .find({ _id: { $in: vendorIds } }).toArray();

    // 6. Create maps for quick lookup
    const servicesMap = Object.fromEntries(serviceDocs.map(s => [s._id.toString(), s.name]));
    const vendorsMap = Object.fromEntries(vendorDocs.map(v => [v._id.toString(), v.name]));

    // 7. Map bookingRequests by eventId
    const bookingMap = {};
    bookingRequests.forEach(req => {
      const eId = req.eventId.toString();
      if (!bookingMap[eId]) bookingMap[eId] = [];
      bookingMap[eId].push({
        _id: req._id,
        serviceName: servicesMap[req.serviceId.toString()] || "Unknown Service",
        vendorName: vendorsMap[req.vendorId.toString()] || "Unknown Vendor",
        status: req.status

        
      });
    });

    // 8. Attach enriched booking requests to each event
    const enrichedEvents = events.map(event => ({
      ...event,
      bookingRequests: bookingMap[event._id.toString()] || []
    }));

    res.status(200).json({ events: enrichedEvents });

  } catch (err) {
    console.error("Error fetching user events:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const db = await connectToDatabase();

    // Fetch all events
    const events = await db.collection("events").find({}).sort({ createdAt: -1 }).toArray();

    // 1. Extract all booking request IDs from events
    const allBookingRequestIds = events.flatMap(event =>
      event.bookingRequests || []
    ).map(id => new ObjectId(id));

    // 2. Fetch all booking requests
    const bookingRequests = await db.collection("bookingRequests")
      .find({ _id: { $in: allBookingRequestIds } })
      .toArray();

    // 3. Collect all unique service, vendor, and customer IDs from booking requests
    const serviceIds = [...new Set(bookingRequests.map(req => req.serviceId.toString()))]
      .map(id => new ObjectId(id));
    const vendorIds = [...new Set(bookingRequests.map(req => req.vendorId.toString()))]
      .map(id => new ObjectId(id));

    // 4. Fetch services and vendors
    const serviceDocs = await db.collection("services")
      .find({ _id: { $in: serviceIds } }).toArray();
    const vendorDocs = await db.collection("venders")
      .find({ _id: { $in: vendorIds } }).toArray();

    // 5. Create maps for quick lookup by _id
    const servicesMap = Object.fromEntries(serviceDocs.map(s => [s._id.toString(), s.name]));
    const vendorsMap = Object.fromEntries(vendorDocs.map(v => [v._id.toString(), v.name]));

    // 6. Collect all customer IDs (from createdBy field in events)
    const customerIds = [...new Set(events.map(event => event.createdBy.toString()))]
      .map(id => new ObjectId(id));

    // 7. Fetch customers by their IDs
    const customerDocs = await db.collection("users")
      .find({ _id: { $in: customerIds } }).toArray();

    // 8. Create a map for quick lookup of customer names by their IDs
    const customersMap = Object.fromEntries(customerDocs.map(c => [c._id.toString(), c.name]));

    // 9. Map bookingRequests by eventId
    const bookingMap = {};
    bookingRequests.forEach(req => {
      const eId = req.eventId.toString();
      if (!bookingMap[eId]) bookingMap[eId] = [];
      bookingMap[eId].push({
        _id: req._id,
        serviceName: servicesMap[req.serviceId.toString()] || "Unknown Service",
        vendorName: vendorsMap[req.vendorId.toString()] || "Unknown Vendor",
        status: req.status
      });
    });

    // 10. Enrich events with booking requests and other event details
    const enrichedEvents = events.map(event => {
      return {
        name: event.name,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        description: event.description,
        estimatedCost: event.estimatedCost,
        createdAt: event.createdAt,
        createdBy: customersMap[event.createdBy.toString()] || "Unknown Customer", // Enrich createdBy with customerName
        bookingRequests: bookingMap[event._id.toString()] || []
      };
    });

    // 11. Send the enriched events as the response
    res.status(200).json({ events: enrichedEvents });

  } catch (err) {
    console.error("Error fetching events for admin:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
