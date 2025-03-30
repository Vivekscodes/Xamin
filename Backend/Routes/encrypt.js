import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export const router = express.Router();

// File storage configuration
export const upload = multer({ dest: "uploads/" });

// Generate a single encryption key at server startup
export const ENCRYPTION_KEY = crypto.randomBytes(32);  // 256-bit key
console.log("Encryption Key (Base64):", ENCRYPTION_KEY.toString('base64'));  // Print the key in Base64 format

export const IV_LENGTH = 16;  // AES requires 16-byte IV

// Route for uploading and encrypting PDF
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Step 1: Read PDF and convert to binary
    const pdfData = fs.readFileSync(filePath);

    // Step 2: Encrypt binary data with AES-256
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(pdfData);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const encryptedFilePath = `encrypted/${Date.now()}-encrypted.bin`;
    fs.writeFileSync(encryptedFilePath, Buffer.concat([iv, encrypted]));

    // Clean up
    fs.unlinkSync(filePath);

    res.json({
      message: "File encrypted successfully",
      file: encryptedFilePath,
    });

  } catch (error) {
    console.error("Encryption failed:", error);
    res.status(500).send("Encryption failed");
  }
});

export default router;
