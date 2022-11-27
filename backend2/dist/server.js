"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var api_1 = __importDefault(require("./routes/api"));
var express = require("express"); // 1. includes Express
var app = express(); // 2. initializes Express
var cors = require("cors");
var PORT = process.env.PORT || 3030;
app.use(express.json()); // Enables JSON parsing
app.use(cors());
console.log("Backend running");
// Routes go here
app.use("/", api_1["default"]); // 3. adds the recipe endpoints
app.listen(PORT, function () {
    console.log("server started on port ".concat(PORT));
});
