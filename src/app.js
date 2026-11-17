const express = require("express");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "JWT Authentication API is running." });
});

app.use("/", authRoutes);
app.use("/", userRoutes);

// Handle invalid JSON bodies.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Request body must contain valid JSON.",
    });
  }

  return next(error);
});

module.exports = app;
