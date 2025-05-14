// backend/utils/multer.js
const multer = require("multer");
const path = require("path");

// Profile Picture Storage
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const uploadProfile = multer({ storage: profileStorage });


// Service Image Storage
const serviceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/services");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const uploadService = multer({ storage: serviceStorage });

module.exports = {
  uploadProfile,
  uploadService,
};
