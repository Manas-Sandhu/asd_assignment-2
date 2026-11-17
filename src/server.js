require("dotenv").config();

const app = require("./app");

const PORT = Number(process.env.PORT) || 3000;

if (!process.env.JWTSECRET) {
  throw new Error("JWTSECRET is missing. Create a .env file using .env.example.");
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
