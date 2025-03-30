import express from "express";
import dotenv from "dotenv";
import connectDB from "./Database/ConnectDB.js";
import encodeRouter from './Routes/encrypt.js'
import examRouter from './Routes/Exams.routes.js'
import userRouter from './Routes/users.js'
import studentRouter from './Routes/Student.routes.js'
const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.use('/exam', examRouter)
app.use('/user', userRouter)
app.use('/student', studentRouter)
app.use('/encode', encodeRouter)

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
    connectDB();
});
