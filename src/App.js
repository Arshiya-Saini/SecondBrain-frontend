import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing    from "./pages/Landing.jsx";
import Login      from "./pages/Login.jsx";
import Signup     from "./pages/Signup.jsx";
import Dashboard  from "./pages/Dashboard.jsx";
import Profile    from "./pages/Profile.jsx";
import Notes      from "./pages/Notes.jsx";
import NoteDetail from "./pages/NoteDetail.jsx";
import Analytics  from "./pages/Analytics.jsx";
import Settings   from "./pages/Settings.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING — shown first when you open the website */}
        <Route path="/" element={<Landing />} />

        {/* PUBLIC ROUTES */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/notes" element={
          <ProtectedRoute><Notes /></ProtectedRoute>
        } />

        <Route path="/notes/:id" element={
          <ProtectedRoute><NoteDetail /></ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute><Analytics /></ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute><Settings /></ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
