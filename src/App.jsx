import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/globals.css";
import Navbar from "./features/layout/Navbar";
import LoadingOverlay from "./features/common/LoadingOverlay";
import ProtectedRoute from "./features/layout/ProtectedRoute";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ThreadsPage from "./features/threads/ThreadsPage";
import ThreadDetailPage from "./features/thread/ThreadDetailPage";
import NewThreadPage from "./features/threads/NewThreadPage";
import LeaderboardPage from "./features/leaderboard/LeaderboardPage";
import NotFound from "./features/common/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <LoadingOverlay />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ThreadsPage />} />
          <Route path="/threads/:id" element={<ThreadDetailPage />} />
          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <NewThreadPage />
              </ProtectedRoute>
            }
          />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
