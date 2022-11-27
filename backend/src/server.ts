import express from "express";
import api from "./routes/api";

const server = express();

const port = 3001;

server.use("/", api);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
