import { Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
// import Growth from "./pages/Growth";
import JobTracker from "./pages/JobTracker";

import Login from "./pages/Login";
import Signup from "./pages/SignUp";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* 🔓 PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 🔒 PROTECTED */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="planner" element={<Planner />} />
        {/* <Route path="growth" element={<Growth />} /> */}
        <Route path="jobs" element={<JobTracker />} />
      </Route>

    </Routes>
  );
}

export default App;