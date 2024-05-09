const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.routes.js");
const taskRoutes = require("./routes/task.routes.js");
const connectDB = require("./db/db.js");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Use routes
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
