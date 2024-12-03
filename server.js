const jsonServer = require("json-server");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const express = require("express");
const server = jsonServer.create();
const router = jsonServer.router("data.json");
const middlewares = jsonServer.defaults();

const uploadFolder = path.join(__dirname, "Olympia Images");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

server.use(cors({ origin: "https://elliotabrahamsson.github.io" }));

server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

server.use(middlewares);
server.use(router);

server.post("/uploadImage", upload.single("picture"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Ingen fil uppladdad.");
  }

  const imageUrl = `/Olympia Images/${req.file.filename}`;
  res.json({ imageUrl });
});

server.use("/Olympia Images", express.static(uploadFolder));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
