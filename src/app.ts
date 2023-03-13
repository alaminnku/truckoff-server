import express from "express";

// Create port
const PORT = process.env.PORT || 5300;

// Create app
const app = express();

// Run server
app.listen(PORT, () => console.log("Server started"));
