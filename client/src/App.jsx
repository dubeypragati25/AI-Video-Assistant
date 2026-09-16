import { Navigate, Route, Routes } from "react-router-dom";

import Landing from "./views/Landing/Landing";
import Login from "./views/Login/Login";
import Register from "./views/Register/Register";
import Dashboard from "./views/Dashboard/Dashboard";
import NewMeeting from "./views/NewMeeting/NewMeeting";
import MeetingDetails from "./views/MeetingDetails/MeetingDetails";
import AskAI from "./views/AskAI/AskAI";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/meetings/new"
                    element={<NewMeeting />}
                />

                <Route
                    path="/meetings/:id"
                    element={<MeetingDetails />}
                />

                {/* ADD THIS */}
                <Route
                    path="/meetings/:id/ask"
                    element={<AskAI />}
                />
            </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
};

export default App;