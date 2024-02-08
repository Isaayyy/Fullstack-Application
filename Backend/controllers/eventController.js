const EventModel = require("../models/event");
const path = require("path");
const multer = require("multer");

 
const storage = multer.diskStorage({
  destination: "/tmp/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage }).single("thumbnail");

const uploadThumbnail = (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer error occurred (e.g., file size exceeded)
        return res.status(400).json({
          success: false,
          message: "File upload error",
        });
      } else if (err) {
        // Other non-Multer errors
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }

      // Check if a file is uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an event thumbnail image",
        });
      }

      // Get the uploaded file path
      const thumbnailImagePath = req.file.path;

      // Respond with success message and the thumbnail path
      return res.status(200).json({
        success: true,
        message: "Thumbnail uploaded successfully",
        path: thumbnailImagePath,
      });
    });
  } catch (error) {
    console.error("Error uploading thumbnail:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

 

 const createEvent = async (req, res) => {
  try {
    // Extracting data from the request body
    const {
      eventTitle,
      eventDate,
      eventStartTime,
      eventEndTime,
      eventCategory,
      eventDescription,
      eventHost,
      eventLocation,
      eventThumbnailImageUrl,
    } = req.body;

    // Check if required fields are present
    const requiredFields = [
      "eventTitle",
      "eventDate",
      "eventStartTime",
      "eventEndTime",
      "eventCategory",
      "eventDescription",
      "eventHost",
      "eventLocation",
    ];

    const missingFields = requiredFields.filter(
      (field) => !req.body[field] || req.body[field].trim() === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please provide a value for the following fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate event date
    const currentDate = new Date();
    const inputDate = new Date(eventDate);

    if (inputDate <= currentDate) {
      return res.status(400).json({
        success: false,
        message: "Event date must be in the future",
      });
    }

    // Create a new event instance
    const newEvent = new EventModel({
      eventTitle,
      eventDate,
      eventStartTime,
      eventEndTime,
      eventCategory,
      eventDescription,
      eventHost,
      eventLocation,
      eventThumbnailImageUrl,
    });

    // Save the event to the database
    await newEvent.save();

    // Respond with success message
    return res.status(201).json({
      success: true,
      message: "Event created successfully",
    });
  } catch (error) {
    console.error("Error creating event:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
 
const getEvents = async (req, res) => {
  try {
    const churchEvents = await EventModel.find({ eventCategory: "church" }).lean();
    const outreachEvents = await EventModel.find({ eventCategory: "outreach" }).lean();
    res.json({ churchEvents, outreachEvents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve events" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const allEvents = await EventModel.find().lean();
    res.json({ allEvents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve events" });
  }
};


async function deleteEvent (req, res) {
  const requestId = req.params.id;

  try {
    // Find and delete the prayer request with the given ID
    const deletedRequest = await EventModel.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({ error: "Prayer request not found" });
    }

    res.json({ message: "Prayer request deleted successfully", deletedRequest });
  } catch (error) {
    console.error("Error deleting prayer request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const archiveEventById = async (eventId) => {
  try {
    const archivedEvent = await EventModel.findByIdAndUpdate(
      eventId,
      { isEventArchived: true },
      { new: true }
    );

    if (!archivedEvent) {
      throw new Error("Event not found");
    }

    return archivedEvent;
  } catch (error) {
    throw new Error(`Error archiving event: ${error.message}`);
  }
};

const archiveEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const archivedEvent = await archiveEventById(eventId);

    res.json({
      success: true,
      message: `Event '${archivedEvent.eventTitle}' archived successfully.`,
      archivedEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error archiving event. Please try again.",
    });
  }
};
const editEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    // Extracting data from the request body
    const {
      eventTitle,
      eventDate,
      eventStartTime,
      eventEndTime,
      eventCategory,
      eventDescription,
      eventHost,
      eventLocation,
      eventThumbnailImageUrl,
    } = req.body;

    // Check if required fields are present
    const requiredFields = [
      "eventTitle",
      "eventDate",
      "eventStartTime",
      "eventEndTime",
      "eventCategory",
      "eventDescription",
      "eventHost",
      "eventLocation",
    ];

    const missingFields = requiredFields.filter(
      (field) => !req.body[field] || req.body[field].trim() === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please provide a value for the following fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate event date
    const currentDate = new Date();
    const inputDate = new Date(eventDate);

    if (inputDate <= currentDate) {
      return res.status(400).json({
        success: false,
        message: "Event date must be in the future",
      });
    }

    // Find the event by ID and update its fields
    const updatedEvent = await EventModel.findByIdAndUpdate(
      eventId,
      {
        eventTitle,
        eventDate,
        eventStartTime,
        eventEndTime,
        eventCategory,
        eventDescription,
        eventHost,
        eventLocation,
        eventThumbnailImageUrl,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Respond with success message and the updated event
    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



module.exports = {
  createEvent,
  uploadThumbnail, getEvents, deleteEvent,  archiveEvent, editEvent, getAllEvents
};
