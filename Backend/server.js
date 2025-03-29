import express from "express";
import dotenv from "dotenv";
import connectDB from "./Database/ConnectDB.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
    connectDB();
});
