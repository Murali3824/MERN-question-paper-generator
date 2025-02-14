import express from "express";
import Question from "../models/Question.js";
const router = express.Router();

const getQuestions = async (filters, btLevel, type, count) => {
  const questionField = type === 'short' ? 'shortQuestion' : 'longQuestion';
  const matchQuery = {
    subjectCode: filters.subject,
    branch: filters.branch,
    regulation: filters.regulation,
    year: filters.year.toString(),
    semester: parseInt(filters.semester),
    [questionField]: { $exists: true, $ne: '' }
  };

  if (filters.unit) {
    matchQuery.unit = parseInt(filters.unit);
  }

  if (btLevel) {
    matchQuery.btLevel = parseInt(btLevel);
  }

  return await Question.aggregate([
    { $match: matchQuery },
    { $sample: { size: count || 100 } }
  ]);
};

const getRandomQuestionsWithConstraints = async (filters, config, type) => {
  const questions = [];
  
  if (config.useUnitWise) {
    for (const [unit, totalUnitCount] of Object.entries(config.unitCounts)) {
      if (totalUnitCount <= 0) continue;
      
      const unitFilters = { ...filters, unit: parseInt(unit) };
      
      if (config.useBtLevels) {
        const btLevelCounts = { ...config.btLevelCounts };
        const totalBtCount = Object.values(btLevelCounts).reduce((a, b) => a + b, 0);
        
        const unitBtCounts = {};
        for (const [btLevel, btCount] of Object.entries(btLevelCounts)) {
          unitBtCounts[btLevel] = Math.round((btCount / totalBtCount) * totalUnitCount);
        }
        
        for (const [btLevel, count] of Object.entries(unitBtCounts)) {
          if (count <= 0) continue;
          
          const availableQuestions = await getQuestions(unitFilters, btLevel, type, count);
          questions.push(...availableQuestions.slice(0, count));
        }
      } else {
        const availableQuestions = await getQuestions(unitFilters, null, type, totalUnitCount);
        questions.push(...availableQuestions.slice(0, totalUnitCount));
      }
    }
  } else {
    if (config.useBtLevels) {
      for (const [btLevel, count] of Object.entries(config.btLevelCounts)) {
        if (count <= 0) continue;
        
        const availableQuestions = await getQuestions(filters, btLevel, type, count);
        questions.push(...availableQuestions.slice(0, count));
      }
    } else {
      const availableQuestions = await getQuestions(filters, null, type, config.totalCount);
      questions.push(...availableQuestions.slice(0, config.totalCount));
    }
  }

  return questions;
};

router.post("/", async (req, res) => {
  try {
    const { subject, branch, regulation, year, semester, unit, config } = req.body;

    // Validate required fields
    const requiredFields = ['subject', 'branch', 'regulation', 'year', 'semester', 'config'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate short questions configuration
    if (!config.short.useUnitWise && config.short.useBtLevels) {
      const totalBtCount = Object.values(config.short.btLevelCounts).reduce((a, b) => a + b, 0);
      if (totalBtCount !== config.short.totalCount) {
        return res.status(400).json({
          error: `Total count (${config.short.totalCount}) must match sum of BT level counts (${totalBtCount}) for short questions`
        });
      }
    }
    
    // Validate unit-wise configuration for short questions
    if (config.short.useUnitWise) {
      const totalUnitCount = Object.values(config.short.unitCounts).reduce((a, b) => a + b, 0);
      if (config.short.useBtLevels) {
        const totalBtCount = Object.values(config.short.btLevelCounts).reduce((a, b) => a + b, 0);
        if (totalUnitCount !== totalBtCount) {
          return res.status(400).json({
            error: `Total unit-wise count (${totalUnitCount}) must match total BT level count (${totalBtCount}) for short questions`
          });
        }
      }
    }

    // Validate long questions configuration
    if (!config.long.useUnitWise && config.long.useBtLevels) {
      const totalBtCount = Object.values(config.long.btLevelCounts).reduce((a, b) => a + b, 0);
      if (totalBtCount !== config.long.totalCount) {
        return res.status(400).json({
          error: `Total count (${config.long.totalCount}) must match sum of BT level counts (${totalBtCount}) for long questions`
        });
      }
    }

    // Validate unit-wise configuration for long questions
    if (config.long.useUnitWise) {
      const totalUnitCount = Object.values(config.long.unitCounts).reduce((a, b) => a + b, 0);
      if (config.long.useBtLevels) {
        const totalBtCount = Object.values(config.long.btLevelCounts).reduce((a, b) => a + b, 0);
        if (totalUnitCount !== totalBtCount) {
          return res.status(400).json({
            error: `Total unit-wise count (${totalUnitCount}) must match total BT level count (${totalBtCount}) for long questions`
          });
        }
      }
    }

    const filters = { subject, branch, regulation, year, semester };
    if (unit) filters.unit = unit;

    const shortAnswers = await getRandomQuestionsWithConstraints(filters, config.short, 'short');
    const longAnswers = await getRandomQuestionsWithConstraints(filters, config.long, 'long');

    const subjectInfo = await Question.findOne({ subjectCode: subject });
    if (!subjectInfo) {
      throw new Error('Subject not found');
    }

    const response = {
      metadata: {
        subjectCode: subject,
        subject: subjectInfo.subject,
        branch,
        regulation,
        year,
        semester,
        unit,
        totalQuestions: shortAnswers.length + longAnswers.length
      },
      shortAnswers: shortAnswers.map((q, index) => ({
        number: index + 1,
        question: q.shortQuestion,
        btLevel: q.btLevel,
        unit: q.unit
      })),
      longAnswers: longAnswers.map((q, index) => ({
        number: index + 1,
        question: q.longQuestion,
        btLevel: q.btLevel,
        unit: q.unit
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Generate paper error:', error);
    res.status(500).json({
      error: error.message || "Failed to generate paper"
    });
  }
});

router.get("/subjects", async (req, res) => {
  try {
    const subjects = await Question.aggregate([
      {
        $group: {
          _id: "$subjectCode",
          subjectCode: { $first: "$subjectCode" },
          subject: { $first: "$subject" },
          branch: { $first: "$branch" },
          regulation: { $first: "$regulation" },
          year: { $addToSet: "$year" },
          semester: { $addToSet: "$semester" }
        }
      },
      {
        $project: {
          _id: 0,
          subjectCode: 1,
          subject: 1,
          branch: 1,
          regulation: 1,
          year: 1,
          semester: 1
        }
      },
      { $sort: { branch: 1, subject: 1 } }
    ]);

    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ error: "No subjects found" });
    }

    res.json({ subjects });
  } catch (error) {
    console.error('Fetch subjects error:', error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

export default router;