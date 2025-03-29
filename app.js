const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Use CORS middleware
app.use(cors());

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Route for the home page
app.get("/", (req, res) => {
  res.render("index");
});

// Socket.io connection handling
io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    io.emit("receive-location", {
      id: socket.id,
      ...data,
    });
  });
  console.log("A user connected");

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });

  // Add more socket event handlers as needed
});

// Start the server
const PORT = process.env.PORT || 8001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
