import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import HeaderBar from "./components/HeaderBar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <HeaderBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
