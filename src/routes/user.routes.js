const express = require("express");
const prisma = require("../config/prisma");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// GET /me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User account was not found.",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong while fetching the profile.",
    });
  }
});

// GET /dashboard
router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: {
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User account was not found.",
      });
    }

    const displayName = user.name || user.email;

    return res.status(200).json({
      message: `Welcome, ${displayName}!`,
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong while loading the dashboard.",
    });
  }
});

module.exports = router;
