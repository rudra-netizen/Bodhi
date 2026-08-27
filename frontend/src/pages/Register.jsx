import React from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    const apiBase = (
      import.meta.env.VITE_API_URL || "http://localhost:3000"
    ).replace(/\/+$/, "");
    window.location.href = `${apiBase}/api/auth/google`;
  };

  return (
    <div className="register-page">
      <div className="register-card">
        {/* ================= BRAND ================= */}

        <h1 className="register-logo">
          Bodhi <span>AI</span>
        </h1>

        {/* ================= SUBTITLE ================= */}

        <p className="register-subtitle">Create your account</p>

        {/* ================= GOOGLE SECTION ================= */}

        <div className="google-section">
          <p className="google-heading">Sign up with your Gmail account</p>

          <button className="google-signin-button" onClick={handleGoogleSignup}>
            <div className="google-left">
              <div className="google-avatar">B</div>

              <div className="google-account">
                <span className="google-name">Continue with Google</span>

                <span className="google-email">
                  Sign up using your Gmail account
                </span>
              </div>
            </div>

            <div className="google-logo">G</div>
          </button>
        </div>

        {/* ================= LOGIN ================= */}

        <p className="login-text">
          Already have an account?{" "}
          <button className="login-link" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
