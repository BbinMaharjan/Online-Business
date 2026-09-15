import dotenv from "dotenv";
dotenv.config();

import "./config/database";
import app from "./app";

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log(`E-Commerce Backend running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

export default server;
