const jsonServer = require("json-server");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const server = jsonServer.create();
const router = jsonServer.router("data.json");
const middlewares = jsonServer.defaults();

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

server.post("/upload", (req, res) => {
  const { imageData, imageName } = req.body;

  if (!imageData || !imageName) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const base64Data = imageData.replace(
    /^data:image\/(png|jpg|jpeg);base64,/,
    ""
  );
  const imagePath = path.join(__dirname, "public", `${imageName}.png`);

  if (fs.existsSync(path.join(_dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"));
  }

  fs.writeFile(imagePath, base64Data, "base64", (err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Error saving image", details: err });
    }

    const imageURL = `http://localhost:3000/${imageName}.png`;
    res.status(200).json({ message: "bild uppladdad", imageURL });
  });
});

server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
