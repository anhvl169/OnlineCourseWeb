const ollama = require("ollama").default;
const { searchWeb } = require("./search.service");
console.log("OLLAMA MODULE:", ollama);
const generateAIResponse = async (message) => {

    try {

        const searchResults =
            await searchWeb(message);

        // ❌ search fail
        if (
            !searchResults ||
            searchResults.length === 0
        ) {

            return {
                answer:
                    "Hiện chưa kết nối được tới internet để tìm kiếm thông tin.",
                sources: [],
                internetFailed: true
            };
        }

        const webContext =
            searchResults
                .map((r, i) => `
[${i + 1}]
Title: ${r.title}

Content:
${r.content}

URL:
${r.url}
`)
                .join("\n");

        const response =
            await ollama.chat({
                model: "qwen3-vl:4b",

                messages: [
                    {
                        role: "system",
                        content: `
Bạn là AI assistant.

QUAN TRỌNG:
- Chỉ nói "không có internet"
  nếu KHÔNG có web results.
- Nếu có web results,
  PHẢI trả lời bằng dữ liệu web.
`
                    },
                    {
                        role: "user",
                        content: `
Question:
${message}

Web Results:
${webContext}
`
                    }
                ]
            });

        return {
            answer: response.message.content,
            sources: searchResults,
            internetFailed: false
        };

    } catch (err) {

        console.error(err);

        return {
            answer:
                "Hiện chưa kết nối được tới internet để tìm kiếm thông tin.",
            sources: [],
            internetFailed: true
        };
    }
};


module.exports = {
    generateAIResponse
};
