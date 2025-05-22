```javascript
import mongoose from "mongoose";

// Define the schema for a Student
const studentSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true, // Name is mandatory
		},
		phone: {
			type: String,
			required: true, // Phone number is mandatory
		},
		email: {
			type: String,
			required: true, // Email is mandatory
		},
		aadhar: {
			type: String,
			required: true, // Aadhar number is mandatory
		},
		rollNo: {
			type: String,
			required: true, // Roll number is mandatory
		},
		gender: {
			type: String,
			enum: ["male", "female", "other"], // Gender must be one of these values
			required: true, // Gender is mandatory
		},
		password: {
			type: String,
			required: true, // Password is mandatory
		},
		exams: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Exam", // Reference to the Exam model
			},
		],
	},
	{
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

// Create the Student model from the schema
const Student = mongoose.model("Student", studentSchema);

// Export the Student model
export default Student;
```