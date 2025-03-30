import express from "express";
import Exam from "../Models/Exam.models.js";
import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import shamir from "shamirs-secret-sharing";
const router = express.Router();

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post("/create", async (req, res) => {
    const { name, admin, date, duration } = req.body;
    try {
        if (!name || !admin || !date || !duration) {
            return res.status(400).json({
                status: "failure",
                message: "All fields are required",
            });
        }
        const newExam = await Exam.create({ name, admin, date, duration });
        await newExam.save();
        res.status(201).json({
            status: "success",
            message: "Exam successfully created",
        });
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: "Something went wrong!",
            error: err.message,
        });
    }
});

router.post("/add/b_members", async (req, res) => {
    try {
        const { ExamId } = req.body;
        const exam = await Exam.findById(ExamId);
        if (!exam) {
            return res
                .status(404)
                .json({ status: "failure", message: "Exam not found!" });
        }
        const { b_members } = req.body;
        b_members.map((member) => exam.b_members.push(member));
        await exam.save();
        res.status(200).json({
            status: "success",
            message: "Board members added successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: "Something went wrong!",
            error: err.message,
        });
    }
});

router.post("/add/paper", async (req, res) => {
    try {
        const { ExamId } = req.body;
        const exam = await Exam.findById(ExamId);
        if (!exam) {
            return res
                .status(404)
                .json({ status: "failure", message: "Exam not found!" });
        }
        const { paper } = req.body;
        exam.papers.push(paper);
        await exam.save();
        res.status(200).json({
            status: "success",
            message: "Paper added successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: "Something went wrong!",
            error: err.message,
        });
    }
});

export const upload = multer({ dest: "uploads/" });
const IV_LENGTH = 16;

const TOTAL_PARTS = 5; // Number of board members
const MINIMUM_PARTS = 2;

router.post("/upload-final-paper", upload.single("file"), async (req, res) => {
    try {
        const { ExamId } = req.body;
        const exam = await Exam.findById(ExamId);

        if (!exam) {
            return res.status(404).json({
                status: "failure",
                message: "Exam not found!",
            });
        }

        const filePath = req.file.path;

        // ✅ Step 1: Read PDF and convert to binary
        const pdfData = fs.readFileSync(filePath);

        // ✅ Step 2: Generate Encryption Key and IV
        const ENCRYPTION_KEY = crypto.randomBytes(32); // 256-bit key
        const iv = crypto.randomBytes(IV_LENGTH);

        // ✅ Step 3: Encrypt binary data with AES-256
        const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

        let encrypted = cipher.update(pdfData);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        // ✅ Step 4: Save the encrypted binary file
        const encryptedFilePath = `encrypted/${Date.now()}-encrypted.bin`;
        const absoluteEncryptedPath = join(
            __dirname,
            `../${encryptedFilePath}`
        );

        // Save encrypted binary with IV at the beginning
        fs.writeFileSync(absoluteEncryptedPath, Buffer.concat([iv, encrypted]));

        const shards = shamir.split(ENCRYPTION_KEY, {
            shares: TOTAL_PARTS,
            threshold: MINIMUM_PARTS,
        });

        const boardMembers = (await exam.populate("b_members")).b_members;

        const distributedKeys = boardMembers.map((member, index) => ({
            memberId: member._id,
            name: member.name,
            keyShard: shards[index].toString("base64"),
            sequence: index + 1,
        }));

        // ✅ Step 5: Store file path and encryption key (HEX format)
        exam.f_paper.push(encryptedFilePath);
        exam.keyParts = distributedKeys;
        exam.encryptionKey = ENCRYPTION_KEY.toString("base64"); // Store key as HEX string
        await exam.save();

        // ✅ Clean up temporary file
        fs.unlinkSync(filePath);

        res.status(200).json({
            message: "File encrypted successfully",
            file: encryptedFilePath,
        });
    } catch (error) {
        console.error("Encryption failed:", error);
        res.status(500).json({
            status: "failure",
            message: "Encryption failed",
            error: error.message,
        });
    }
});

// ============================
// 🔓 DECRYPTION ROUTE
// ============================
router.post("/decrypt", async (req, res) => {
    try {
        const { examId, keyShards } = req.body;

        console.log("Received key shards:", keyShards);

        // ✅ 1. Retrieve the exam record
        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({
                status: "failure",
                message: "Exam not found!",
            });
        }

        // ✅ 2. Verify key shard format
        if (!keyShards || keyShards.length < MINIMUM_PARTS) {
            console.error("Missing or insufficient key shards:", keyShards);
            return res.status(400).json({
                status: "failure",
                message: `At least ${MINIMUM_PARTS} key parts are required`,
            });
        }

        // ✅ 3. Sort and decode the key shards
        const sortedShards = keyShards
            .sort((a, b) => a.sequence - b.sequence)
            .map((shard) => {
                console.log("Decoding shard:", shard);
                return Buffer.from(shard.keyShard, "base64");  // Ensure base64 decoding
            });

        console.log("Sorted Shards:", sortedShards);

        // ✅ 4. Combine the shards into the original encryption key
        const reconstructedKey = shamir.combine(sortedShards);

        console.log("Reconstructed Key:", reconstructedKey);
        if (!reconstructedKey || reconstructedKey.length !== 32) {
            console.error("Invalid reconstructed key:", reconstructedKey);
            return res.status(400).json({
                status: "failure",
                message: "Key reconstruction failed or invalid length",
            });
        }

        // ✅ 5. Retrieve the latest encrypted file
        const filePath = exam.f_paper[exam.f_paper.length - 1];
        const encryptedFilePath = join(__dirname, `../${filePath}`);

        if (!fs.existsSync(encryptedFilePath)) {
            console.error("Encrypted file not found:", encryptedFilePath);
            return res.status(404).json({
                status: "failure",
                message: "Encrypted file not found!",
            });
        }

        // ✅ 6. Read the encrypted binary file
        const encryptedData = fs.readFileSync(encryptedFilePath);

        // ✅ 7. Extract IV and encrypted content
        const iv = encryptedData.slice(0, IV_LENGTH);
        const encryptedContent = encryptedData.slice(IV_LENGTH);

        console.log("IV Length:", iv.length);
        console.log("Encrypted Content Length:", encryptedContent.length);

        // ✅ 8. Decrypt the content with the reconstructed key
        const decipher = crypto.createDecipheriv("aes-256-cbc", reconstructedKey, iv);

        let decrypted = decipher.update(encryptedContent);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        // ✅ 9. Save the decrypted PDF
        const pdfFilePath = `decrypted/${Date.now()}-decrypted.pdf`;
        const decryptedFilePath = join(__dirname, `../${pdfFilePath}`);

        exam.decryptedPapers.push(pdfFilePath)

        fs.writeFileSync(decryptedFilePath, decrypted);

        // ✅ 10. Send the decrypted file
        res.status(200).sendFile(decryptedFilePath);

        // ✅ 11. Clean up the encrypted file
        fs.unlinkSync(encryptedFilePath);

    } catch (error) {
        console.error("Decryption failed:", error);
        res.status(500).json({
            status: "failure",
            message: "Decryption failed",
            error: error.message,
        });
    }
});

export default router;
