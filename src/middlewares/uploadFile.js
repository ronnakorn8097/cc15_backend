const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public"); // ไม่มี error
  },
  filename: (req, file, cb) => {
    const split = file.originalname.split(".");
    cb(
      null,
      "" +
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        split[split.length - 1]
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
