import xlsx from "xlsx";
import Question from "../models/Question.js";

export const uploadQuestions = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "File is required" });
        }

        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return res.status(400).json({ error: "Excel file is empty" });
        }

        // Process and validate data
        const questions = data.map((row) => ({
            subjectCode: String(row["Subject Code"] || ""),
            subject: String(row["Subject"] || ""),
            branch: String(row["Branch"] || ""),
            regulation: String(row["Regulation"] || ""),
            year: String(row["Year"] || ""),
            semester: parseInt(row["Sem"]) || 0,
            examMonth: String(row["Month"] || ""),
            serialNo: parseInt(row["S.No."]) || 0,
            shortQuestion: String(row["Short Questions"] || ""),
            longQuestion: String(row["Long Questions"] || ""),
            unit: parseInt(row["Unit"]) || 0,
            btLevel: parseInt(row["B.T Level"]) || 0,
        }));

        // Delete existing questions for this subject code
        const subjectCode = questions[0].subjectCode;
        await Question.deleteMany({ subjectCode });

        await Question.insertMany(questions);

        return res.json({
            message: "Questions uploaded successfully!",
            count: questions.length,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message || "Failed to process file",
        });
    }
};
