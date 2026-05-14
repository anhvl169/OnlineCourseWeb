const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const askAI = async (prompt) => {

    const response = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            {
                role: "system",
                content: `
Bạn là AI tư vấn khóa học.
Chỉ recommend khóa học từ dữ liệu được cung cấp.
`
            },
            {
                role: "user",
                content: prompt
            }
        ]
    });

    return response.choices[0].message.content;
};

module.exports = {
    askAI
};