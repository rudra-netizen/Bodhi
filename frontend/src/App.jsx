import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import RegisterDetails from "./pages/RegisterDetails";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/complete-registration" element={<RegisterDetails />} />

        <Route path="/complete-profile" element={<RegisterDetails />} />

        <Route path="/registration-success" element={<RegistrationSuccess />} />

        <Route path="/login" element={<Login />} />

        <Route path="/chat" element={<Chat />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
