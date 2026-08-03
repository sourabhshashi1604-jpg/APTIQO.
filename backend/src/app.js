const express = require("express");
const Test = require("./models/test"); // ← ADD THIS LINE

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send(`
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 50px auto; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white;">
            <h1 style="margin-top: 0; font-size: 2.2rem; font-weight: 700;">🚀 APTIQO Backend</h1>
            <p style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 25px;">The server is running and successfully connected to MongoDB!</p>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: left;">
                <h3 style="margin-top: 0; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 8px;">Database Test Route</h3>
                <p style="font-size: 0.95rem; margin-bottom: 15px;">Click the button below to hit the test route. This will create a new test entry in the database and display all current database entries.</p>
                <a href="/test" style="display: inline-block; background: #00c6ff; color: #1e3c72; text-decoration: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; transition: transform 0.2s;">Run Database Test ↗</a>
            </div>
            <div style="font-size: 0.85rem; opacity: 0.7;">
                Running on port 5000 • Connected to MongoDB
            </div>
        </div>
    `);
});

app.get("/test", async (req, res) => {
    try {
        // Create a new document with the current timestamp
        const doc = await Test.create({
            message: `Hello APTIQO! Test entry created at ${new Date().toLocaleTimeString()}`,
        });

        // Fetch all documents from the database to show changes
        const allDocs = await Test.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            message: "Database write successful! Here are the documents currently in the database:",
            newlyCreated: doc,
            totalCount: allDocs.length,
            databaseEntries: allDocs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

module.exports = app;
