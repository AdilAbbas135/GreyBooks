const http = require("http");
const express = require("express");
const app = express();
const connect_to_db = require("./db");
var cors = require("cors");
// var cookieParser = require("cookie-parser");
const PORT = 8800;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end("Hello World!");
});

app.listen(PORT, () => {
  console.log("the app is running at port " + PORT);
});

// Middlewears
connect_to_db();
app.use(express.json());
app.use(cors());
// app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
