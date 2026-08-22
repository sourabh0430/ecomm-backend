import express from "express";
import db from "./config/database";

const app = express();

app.use(express.json())

app.get('/health', async (_req, res) => {

    try {
        await db.raw("SELECT 1");
        res.status(200).json({
            success: true,
            message: "E-Commerce API is Live"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Database is not connected"
        })
    }


})

export default app;