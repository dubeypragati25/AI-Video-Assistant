const axios = require("axios");

const processMeetingWithAI = async (source, language) => {
    try {
        const pythonURL =
            `${process.env.PYTHON_AI_URL}/process`;

        console.log("Python API URL:", pythonURL);

        const response = await axios.post(
            pythonURL,
            {
                source,
                language
            },
            {
                timeout: 30 * 60 * 1000
            }
        );

        if (!response.data.success) {
            throw new Error(
                "Python AI service failed to process the meeting."
            );
        }

        return response.data.result;

    } catch (error) {
        console.error(
            "Python AI service error:",
            error.response?.data || error.message
        );

        throw new Error("AI processing failed");
    }
};

module.exports = {
    processMeetingWithAI
};