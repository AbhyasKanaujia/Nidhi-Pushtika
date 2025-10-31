import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";
// import Reports from "./pages/Reports";
// import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import HeaderBar from "./components/HeaderBar";
import Footer from "./components/Footer";
import { Container } from "./components/ui/container";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <HeaderBar />
          <main className="flex-grow">
            <Container>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Transactions />} />
                  <Route path="/transactions" element={<Transactions />} />
                  {/* <Route path="/reports" element={<Reports />} /> */}
                  {/* <Route path="/users" element={<Users />} /> */}
                </Route>
              </Routes>
            </Container>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
