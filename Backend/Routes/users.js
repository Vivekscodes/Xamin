import express from "express";
const router = express.Router();
import User from "../Models/User.model.js";
import bcrypt from "bcryptjs";

router.post("/register", async (req, res) => {
    try {
        const { name, phone, email, gender, password, aadhar } = req.body;
        if (!name || !phone || !email || !gender || !password || !aadhar) {
            return res.status(400).json({
                status: "failure",
                message: "All fields are required!",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            phone,
            email,
            gender,
            password : hash,
            aadhar,
        });
        await newUser.save();
        res.status(201).json({
            status: "success",
            message: "User created successfully!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failure",
            message: "Something went wrong",
            error: error,
        });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser)
            return res
                .status(404)
                .json({ status: "failure", message: "User not found." });
        
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch)
            return res
                .status(401)
                .json({ status: "failure", message: "Incorrect password." });

        res.status(200).json({
            status: "success",
            message: "Login successful!",
        });
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: "Something went wrong",
            error: err.message,
        });
    }
});

router.get('/exams/:id', async (req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id).populate('exams');
        if (!user) return res.status(404).json({status: 'failure', message: 'User not found.'});
        res.status(200).json({status:'success', data: user});
    } catch (err) {
        res.status(500).json({status: 'failure', error: err.message, message: "Something went wrong!"})
    }
})

export default router;
