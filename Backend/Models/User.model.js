import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        //     name String
        //   phone String
        //   email String
        //   aadhar String
        //   password String
        //   exams ObjectID[]
        //   role String
        //   status String

        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        aadhar: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        exams: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Exam",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = model("User", userSchema);
export default User;
