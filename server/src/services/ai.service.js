const ollama = require("ollama");
console.log("OLLAMA MODULE:", ollama);
const generateAIResponse = async (message) => {

    try {

        const ollama =
            (await import("ollama")).default;

        const response = await ollama.chat({
            model: "qwen3-vl:4b",

            messages: [
                {
                    role: "system",
                    content: `
Bạn là trợ lý AI cho website khóa học online.

Nhiệm vụ:
- hỗ trợ khách hàng
- tư vấn khóa học
- trả lời ngắn gọn
- thân thiện
`
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        return response.message.content;

    } catch (err) {

        console.error("OLLAMA ERROR:", err);

        throw err;
    }
};

module.exports = {
    generateAIResponse
};
