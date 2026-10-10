import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResumeManager from "./pages/ResumeManager";
import JobDescriptions from "./pages/JobDescriptions";
import MatchResults from "./pages/MatchResults";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewRoom from "./pages/InterviewRoom";
import InterviewResult from "./pages/InterviewResult";
import InterviewHistory from "./pages/InterviewHistory";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <Navbar />

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/resumes" element={<ResumeManager />} />
                <Route path="/jobs" element={<JobDescriptions />} />
                <Route path="/matches" element={<MatchResults />} />
                <Route path="/interviews/new" element={<InterviewSetup />} />
                <Route path="/interviews/:id" element={<InterviewRoom />} />
                <Route path="/interviews/:id/result" element={<InterviewResult />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
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
