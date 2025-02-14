import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: true,
    index: true
  },
  subject: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  regulation: {
    type: String,
    required: true
  },
  year: {
    type: String,  // Changed to String to handle "1st", "2nd" etc.
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  examMonth: {
    type: String,
    required: true
  },
  serialNo: {
    type: Number,
    required: true
  },
  shortQuestion: String,
  longQuestion: String,
  unit: {
    type: Number,
    required: true
  },
  btLevel: {
    type: Number, // Changed to Number since B.T Level is numeric
    required: true
  }
});

export default mongoose.model("Question", QuestionSchema);