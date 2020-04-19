const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Conect Database
connectDB();

//Init Middleware to get the body data from req.body
app.use(express.json({extended: false}))

app.get("/", (req, res) => res.send("API is running"));

//Define Routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/posts", require("./routes/api/posts"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/profile", require("./routes/api/profile"))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server connected at", {PORT}))