const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const imgur = require("imgur");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());

app.post("/uploads/", async (req, res) => {
  const file = req.files[0];
  try {
    const url = await imgur.uploadFile(`./uploads/${file.filename}`);
    res.json({ message: url.data.link });
    fs.unlinkSync(`./uploads/${file.filename}`);
  } catch (error) {
    console.log("error", error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on ${PORT}`));