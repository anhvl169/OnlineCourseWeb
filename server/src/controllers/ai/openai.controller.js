const courseService = require("../../services/course.service");
const aiService = require("../../services/openai.service");

const recommendCourses = async (req, res) => {

    try {

        const { message } = req.body;

        const courses =
            await courseService.searchCourses(message);

        const courseText = courses.map(course => `
Title: ${course.title}
Description: ${course.description}
Category: ${course.category}
Level: ${course.level}
`).join("\n");

        const prompt = `
Người dùng muốn:

"${message}"

Danh sách khóa học hiện có:

${courseText}

Hãy:
1. Phân tích nhu cầu người dùng
2. Recommend khóa học phù hợp
3. Giải thích vì sao phù hợp
`;

        const aiResponse =
            await aiService.askAI(prompt);

        res.json({
            success: true,
            recommendations: courses,
            aiResponse
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    recommendCourses
};