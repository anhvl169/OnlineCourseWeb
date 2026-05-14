const { tavily } = require("@tavily/core");

const searchWeb = async (query) => {

    try {

        if (!query) {
            throw new Error("Query is required");
        }

        const tvly = tavily({
            apiKey: process.env.TAVILY_API_KEY
        });

        const response =
            await tvly.search(query);

        return response.results || [];

    } catch (err) {

        console.error(
            "Search error:",
            err.message
        );

        return [];
    }
};

module.exports = {
    searchWeb
};