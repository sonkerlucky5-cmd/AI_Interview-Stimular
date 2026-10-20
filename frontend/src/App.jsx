import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import ScrollProgress from "./components/ScrollProgress";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { AuthProvider } from "./context/AuthContext.jsx";
import useSmoothScroll from "./hooks/useSmoothScroll";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Dsa from "./pages/Dsa";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

import ResumeManager from "./pages/ResumeManager";
import JobDescriptions from "./pages/JobDescriptions";
import MatchResults from "./pages/MatchResults";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewRoom from "./pages/InterviewRoom";
import InterviewResult from "./pages/InterviewResult";
import InterviewHistory from "./pages/InterviewHistory";
import Analytics from "./pages/Analytics";
import LearningRoadmap from "./pages/LearningRoadmap";

function AppContent() {
  useSmoothScroll();

  return (
    <div className="app-shell">
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<Navigate to="/interviews/new" replace />} />
            <Route path="/dsa" element={<Dsa />} />
            <Route path="/results" element={<InterviewHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resumes" element={<ResumeManager />} />
            <Route path="/jobs" element={<JobDescriptions />} />
            <Route path="/matches" element={<MatchResults />} />
            <Route path="/interviews" element={<InterviewHistory />} />
            <Route path="/interviews/new" element={<InterviewSetup />} />
            <Route path="/interviews/:id" element={<InterviewRoom />} />
            <Route path="/interviews/:id/result" element={<InterviewResult />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/roadmap" element={<LearningRoadmap />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0c1220",
              color: "#ecf0ff",
              border: "1px solid rgba(133, 155, 201, 0.16)",
              borderRadius: "14px",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
