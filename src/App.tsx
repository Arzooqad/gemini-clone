import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

function App() {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <DashboardPage />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated ? <ChatPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/auth"} replace />}
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
