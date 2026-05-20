const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildPrompt } = require('./prompt');

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
});

const generateSQL = async (question) => {

    const prompt = buildPrompt(question);

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return response.trim();
};

module.exports = {
    generateSQL
};