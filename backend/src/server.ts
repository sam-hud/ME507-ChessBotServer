import api from "./routes/api";

const express = require("express"); // Includes express
const server = express();
const cors = require("cors");

const port = 443;

server.use(cors());
server.use(express.json()); // Enables JSON parsing

server.use("/", api);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
