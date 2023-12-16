import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 1234;
let ping = 0;
app.get("/", (req, res) => {
  console.log("ping : ", ping++);
  res.send("hello");
});
const io = new Server(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("hello", (data) => {
    console.log(data);
  });
});
server.listen(PORT, (error) => {
  error && console.log(error);
  !error && console.log(`server is running at http://localhost:${PORT}`);
});