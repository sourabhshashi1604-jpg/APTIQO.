const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("🚀 APTIQO Backend API Running");
});

module.exports = app;