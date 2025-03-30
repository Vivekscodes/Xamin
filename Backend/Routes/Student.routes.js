import express from 'express';
const router = express.Router();
import Student from '../Models/Student.model.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);


const __dirname = dirname(__filename);


router.post('/register', async (req, res) => {
    const {name, phone, email, aadhar, gender, password, examId, roll_no} = req.body;
    try {
        if(!name || !phone || !email || !aadhar || !gender || !password || !roll_no) 
            return res.status(400).json({status: 'failure', message: 'All fields are required.'})
        const newStudent = await Student.create({name, phone, email, aadhar, gender, password, roll_no});
        newStudent.exams.push(examId);
        await newStudent.save();
        res.status(201).json({statusbar: 'success', message: 'Student was successfully added!'})

    }catch(err) {
        res.status(500).json({status: "failure", message: "Something went wrong", error: err.message});
    }
})

router.post('/login', async (req, res) => {
    const {roll_no, password} = req.body;
    try {
        const foundStudent = await Student.findOne({roll_no});
        if(!foundStudent) return res.status(404).json({status: 'failure', message: 'Student not found.'});
        if(foundStudent.password!== password) return res.status(401).json({status: 'failure', message: 'Incorrect password.'});
        const decryptedPapers = foundStudent.decryptedPaper
        const paper = path.join(__dirname, `../${decryptedPaper}`);
        
        res.status(200).sendFile(paper)
        
    } catch (err) {
        res.status(500).json({status: 'failure', message: 'Something went wrong', error: err.message});
        
    }
})

export default router;