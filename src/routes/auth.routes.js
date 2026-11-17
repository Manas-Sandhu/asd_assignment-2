const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const generateToken = require("../utils/generateToken");

const router = express.Router();
const SALT_ROUNDS = 10;

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// POST /signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.trim() === "" ||
      password.length < 6
    ) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A valid email and a password of at least 6 characters are required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Conflict",
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        ...(typeof name === "string" && name.trim()
          ? { name: name.trim() }
          : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: "Registration successful.",
      user,
      token,
    });
  } catch (error) {
    // Handles concurrent signup attempts for the same unique email.
    if (error && error.code === "P2002") {
      return res.status(409).json({
        error: "Conflict",
        message: "An account with this email already exists.",
      });
    }

    console.error("Signup error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong while creating the account.",
    });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.trim() === "" ||
      password.length === 0
    ) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Email and password are required as strings.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Keep the same response for an unknown email and a wrong password.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong while logging in.",
    });
  }
});

module.exports = router;
