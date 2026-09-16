const Meeting = require("../models/Meeting");

const {
    processMeetingWithAI
} = require("../services/aiService");

const {
    askMeetingQuestion
} = require("../services/ragService");

// =========================================
// CREATE MEETING
// =========================================

const createMeeting = async (req, res) => {
    try {

        const {
            title,
            sourceType,
            source,
            language
        } = req.body;


        // Validate required fields
        if (!title || !sourceType || !source) {

            return res.status(400).json({
                success: false,
                message: "Title, sourceType and source are required"
            });

        }


        // -----------------------------------------
        // 1. Create meeting in MongoDB
        // -----------------------------------------

        const meeting = await Meeting.create({

            userId: req.user._id,

            title,

            sourceType,

            source,

            language: language || "english",

            status: "processing"

        });


        // -----------------------------------------
        // 2. Respond immediately to React
        // -----------------------------------------

        res.status(201).json({

            success: true,

            message: "Meeting created successfully",

            meeting

        });


        // -----------------------------------------
        // 3. Run Python AI pipeline
        //    in the background
        // -----------------------------------------

        try {

            const aiResult =
                await processMeetingWithAI(
                    source,
                    language || "english"
                );


            console.log(
                `AI processing completed for meeting ${meeting._id}`
            );


            // -----------------------------------------
            // 4. Save Python AI results
            //    into MongoDB
            // -----------------------------------------

            await Meeting.findByIdAndUpdate(

                meeting._id,

                {

                    // Python-generated RAG ID
                    aiMeetingId:
                        aiResult.meeting_id || "",


                    // AI generated content
                    transcript:
                        aiResult.transcript || "",

                    summary:
                        aiResult.summary || "",

                    actionItems:
                        aiResult.action_items || "",

                    keyDecisions:
                        aiResult.key_decisions || "",

                    openQuestions:
                        aiResult.open_questions || "",


                    // Processing completed
                    status: "completed"

                }

            );


            console.log(
                `AI meeting ID saved: ${aiResult.meeting_id}`
            );


        } catch (aiError) {

            console.error(

                `AI processing failed for meeting ${meeting._id}:`,

                aiError.message

            );


            // -----------------------------------------
            // 5. Mark meeting as failed
            // -----------------------------------------

            await Meeting.findByIdAndUpdate(

                meeting._id,

                {

                    status: "failed"

                }

            );

        }


    } catch (error) {

        console.error(
            "Create meeting error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to create meeting",

            error: error.message

        });

    }
};



// =========================================
// GET ALL MEETINGS
// =========================================

const getMeetings = async (req, res) => {

    try {

        const meetings = await Meeting.find({

            userId: req.user._id

        }).sort({

            createdAt: -1

        });


        res.status(200).json({

            success: true,

            count: meetings.length,

            meetings

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Failed to fetch meetings",

            error: error.message

        });

    }

};



// =========================================
// GET SINGLE MEETING
// =========================================

const getMeetingById = async (req, res) => {

    try {

        const meeting = await Meeting.findOne({

            _id: req.params.id,

            userId: req.user._id

        });


        if (!meeting) {

            return res.status(404).json({

                success: false,

                message: "Meeting not found"

            });

        }


        res.status(200).json({

            success: true,

            meeting

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Failed to fetch meeting",

            error: error.message

        });

    }

};

// =========================================
// ASK QUESTION ABOUT MEETING
// =========================================

const askMeetingQuestionController = async (
    req,
    res
) => {

    try {

        const {
            question
        } = req.body;


        // -----------------------------------------
        // 1. Validate question
        // -----------------------------------------

        if (!question || !question.trim()) {

            return res.status(400).json({

                success: false,

                message: "Question is required"

            });

        }


        // -----------------------------------------
        // 2. Find meeting belonging to user
        // -----------------------------------------

        const meeting = await Meeting.findOne({

            _id: req.params.id,

            userId: req.user._id

        });


        if (!meeting) {

            return res.status(404).json({

                success: false,

                message: "Meeting not found"

            });

        }


        // -----------------------------------------
        // 3. Make sure AI processing completed
        // -----------------------------------------

        if (meeting.status !== "completed") {

            return res.status(400).json({

                success: false,

                message:
                    "Meeting is not ready for questions yet."

            });

        }


        // -----------------------------------------
        // 4. Make sure RAG ID exists
        // -----------------------------------------

        if (!meeting.aiMeetingId) {

            return res.status(400).json({

                success: false,

                message:
                    "RAG data is not available for this meeting."

            });

        }


        // -----------------------------------------
        // 5. Ask Python RAG service
        // -----------------------------------------

        const answer =
            await askMeetingQuestion(

                meeting.aiMeetingId,

                question.trim()

            );


        // -----------------------------------------
        // 6. Return answer to React
        // -----------------------------------------

        return res.status(200).json({

            success: true,

            answer

        });


    } catch (error) {

        console.error(
            "Ask meeting question error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to answer question",

            error: error.message

        });

    }

};



// =========================================
// DELETE MEETING
// =========================================

const deleteMeeting = async (req, res) => {

    try {

        const meeting = await Meeting.findOne({

            _id: req.params.id,

            userId: req.user._id

        });


        if (!meeting) {

            return res.status(404).json({

                success: false,

                message: "Meeting not found"

            });

        }


        await meeting.deleteOne();


        res.status(200).json({

            success: true,

            message: "Meeting deleted successfully"

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Failed to delete meeting",

            error: error.message

        });

    }

};



module.exports = {
    createMeeting,
    getMeetings,
    getMeetingById,
    askMeetingQuestionController,
    deleteMeeting
};