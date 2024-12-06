const express = require("express");
const cors = require("cors");
const multer = require("multer");
const AWS = require("aws-sdk");
const path = require("path");

const app = express();
app.use(cors());

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "Europe (Stockholm) eu-north-1",
});

const s3 = new AWS.S3();

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("picture"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileName = Date.now() + path.extname(req.file.originalname);
  const s3Params = {
    Bucket: "olympia-server",
    Key: `Olympia images/${fileName}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    ACL: "public-read",
  };

  try {
    const uploadResult = await s3.upload(s3Params).promise();
    console.log("Uppladdad", uploadResult.Location);

    res.status(200).json({ imageURL: uploadResult.Location });
  } catch (error) {
    console.error("Fel vid uppladdning till S3", error);
    res.status(500).json({ error: "Kunde inte ladda upp bilden" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
