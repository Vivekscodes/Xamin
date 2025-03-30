import express from "express";
const router = express.Router();
import User from '../Models/User.model.js'

router.post("/register", async (req, res) => {
    try {
        const { name, phone, email, gender, password, aadhar } = req.body;
        if (!name || !phone || !email || !gender || !password || !aadhar) {
            return res.status(400).json({
                status: "failure",
                message: "All fields are required!",
            });
        }
        const newUser = new User({ name, phone, email, gender, password, aadhar });
        await newUser.save();
        res.status(201).json({
            status: "success",
            message: "User created successfully!",
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "failure",
            message: "Something went wrong",
            error: error,
        });
    }
});

export default router