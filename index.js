const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
    io.to(room).emit("userJoined", `User ${socket.id} has joined the room`);
  });

  socket.on("sendMessage", (data) => {
    console.log(
      `Message from ${data.sender}: ${data.message} in room ${data.room}`
    );
    io.to(data.room).emit("receiveMessage", {
      sender: data.sender,
      message: data.message,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
