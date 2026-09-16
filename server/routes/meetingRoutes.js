const express = require("express");

const {
    createMeeting,
    getMeetings,
    getMeetingById,
    askMeetingQuestionController,
    deleteMeeting
} = require("../controllers/meetingController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createMeeting);

router.get("/", protect, getMeetings);

router.get("/:id", protect, getMeetingById);

router.post(
    "/:id/ask",
    protect,
    askMeetingQuestionController
);

router.delete("/:id", protect, deleteMeeting);

module.exports = router;