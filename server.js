const jsonServer = require("json-server");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");
const server = jsonServer.create();
const router = jsonServer.router("data.json");
const middlewares = jsonServer.defaults();

const uploadFolder = path.join(__dirname, "Olympia images");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

server.use(
  cors({
    origin: "https://elliotabrahamsson.github.io",
  })
);

server.use(middlewares);
server.use(router);

server.post("/uploadImage", upload.single("picture"), (req, res) => {
  console.log("upload endpoint hit");
  next();
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageURL = `/Olympia%20images/${req.file.filename}`;
  res.json({ imageURL });
});

server.use("/Olympia images", express.static(uploadFolder));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
