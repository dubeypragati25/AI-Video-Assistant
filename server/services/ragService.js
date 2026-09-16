const axios = require("axios");


// =========================================
// ASK QUESTION TO PYTHON RAG SERVICE
// =========================================

const askMeetingQuestion = async (
    meetingId,
    question
) => {

    try {

        const pythonURL =
            `${process.env.PYTHON_AI_URL}/ask`;


        console.log(
            "Sending question to Python RAG:",
            pythonURL
        );


        const response = await axios.post(

            pythonURL,

            {
                meeting_id: meetingId,
                question: question
            },

            {
                timeout: 120000
            }

        );


        if (!response.data.success) {

            throw new Error(
                "Python RAG service failed."
            );

        }


        return response.data.answer;


    } catch (error) {

        console.error(
            "Python RAG service error:",
            error.response?.data ||
            error.message
        );


        throw new Error(
            "Failed to get answer from AI."
        );

    }

};


module.exports = {
    askMeetingQuestion
};