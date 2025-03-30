import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
    {
        //     name String
        //   admin ObjectID
        //   b_members ObjectID[]
        //   p_formaters ObjectID[]
        //   papers String[]
        //   f_paper String[] //encrypted
        //   students ObjectID[]
        //   date Date
        //   duration Number
        //   status String

        name: {
            type: String,
            required: true,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        b_members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        p_formaters: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        papers: [
            {
                type: String,
            },
        ],
        f_paper: [
            {
                type: String,
            },
        ],
        students: [
            {
                type: String,
            },
        ],
        decryptedPaper: {
            type: String,
            default: null
        },
        encryptionKey: {
            type: String,
            default: null,
        },
        date: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Scheduled", "Completed", "Cancelled"],
            default: "Scheduled",
        },
        keyParts: [
            {
                memberId: { type: String, required: true }, // Board member ID
                name: { type: String, required: true }, // Board member name
                keyShard: { type: String, required: true }, // Sharded key in base64
                sequence: { type: Number, required: true }, // Sequence order
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Exam = mongoose.model("Exam", examSchema);
export default Exam;
