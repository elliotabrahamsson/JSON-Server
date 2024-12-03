const jsonServer = require("json-server");
const cors = require("cors");
const server = jsonServer.create();
const router = jsonServer.router("data.json");
const middlewares = jsonServer.defaults();

server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
cors({
  origin: "https://elliotabrahamsson.github.io",
});
server.use(middlewares);
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
