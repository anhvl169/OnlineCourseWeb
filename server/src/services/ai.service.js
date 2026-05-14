const ollama =
    require("ollama").default;

const { searchWeb } =
    require("./search.service");

const { searchCourses } =
    require("./course.service");

const generateAIResponse =
    async (message) => {

        try {

            // SEARCH COURSES

            const courses =
                await searchCourses(
                    message
                );

            // SEARCH WEB

            const searchResults =
                await searchWeb(
                    message
                );

            // FORMAT COURSE DATA

            const courseContext =
                courses.map((c, i) => `
[${i + 1}]

Title:
${c.title}

Category:
${c.category_name}

Description:
${c.description}

Price:
${c.price}
`).join("\n");

            // FORMAT WEB DATA

            const webContext =
                searchResults.map((r, i) => `
[${i + 1}]

Title:
${r.title}

Content:
${r.content}
`).join("\n");

            if (courses.length === 0) {
                return {
                    answer:
                        "Hiện chưa có khóa học phù hợp trong hệ thống.",
                    recommendedCourses: [],
                    sources: searchResults
                };
            }
            // ASK AI

            const response =
                await ollama.chat({

                    model: "qwen3-vl:4b",

                    messages: [

                        {
                            role: "system",

                            content: `
Bạn là AI tư vấn khóa học.

NHIỆM VỤ:

1. Phân tích nhu cầu user
2. Recommend khóa học từ database
3. Dùng web results để giải thích roadmap
4. Ưu tiên recommend course từ database

QUAN TRỌNG:

- Chỉ recommend khóa học có trong DATABASE COURSE
- Nếu DATABASE COURSE rỗng:
  + KHÔNG được tự tạo khóa học
  + KHÔNG được bịa course nội bộ
  + Chỉ được đề xuất kỹ năng nên học
- Không invent course names
- Không giả định course tồn tại
`
                        },

                        {
                            role: "user",

                            content: `
User Question:
${message}

DATABASE COURSES:
${courseContext}

WEB RESULTS:
${webContext}
`
                        }

                    ]

                });

            return {

                answer:
                    response.message.content,

                recommendedCourses:
                    courses,

                sources:
                    searchResults

            };
        } catch (err) {
            console.error(err);
            return {
                answer:
                    "AI service error.",
                recommendedCourses: [],
                sources: []
            };

        }

    };

module.exports = {
    generateAIResponse
};