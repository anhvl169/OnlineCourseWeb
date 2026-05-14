const ollama =
    require("ollama").default;

const extractSkills =
    async (message) => {

        const response =
            await ollama.chat({

                model: "qwen3-vl:4b",

                messages: [

                    {
                        role: "system",

                        content: `
Extract learning skills/topics
from user message.

IMPORTANT:
- Return ONLY JSON
- No markdown
- No explanation

Example:

{
  "skills": [
    "Node.js",
    "Socket.IO",
    "Multiplayer"
  ]
}
`
                    },

                    {
                        role: "user",

                        content: message
                    }

                ]

            });

        try {
            console.log("EXTRACTED SKILLS:", skills);
            return JSON.parse(
                response.message.content
            );

        } catch {

            return {
                skills: []
            };

        }

    };

module.exports = {
    extractSkills
};