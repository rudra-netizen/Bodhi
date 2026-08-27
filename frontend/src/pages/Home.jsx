import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* ================= HERO ================= */}

      <main className="hero-card">
        <div className="brand-pill">BODHI AI</div>

        <h1>
          Build smarter chat
          <br />
          experiences with next-
          <br />
          gen AI.
        </h1>

        <p className="hero-description">
          Unlock natural conversations, secure login, and persistent memory in a
          sleek AI assistant UI.
        </p>

        <div className="hero-buttons">
          <button
            className="gmail-button"
            onClick={() => navigate("/register")}
          >
            <span className="gmail-icon">G</span>
            Start with Gmail
          </button>

          <button className="login-button" onClick={() => navigate("/login")}>
            Already have an account?
          </button>
        </div>
      </main>

      {/* ================= FEATURES ================= */}

      <section className="features">
        {/* CARD 1 */}

        <div className="feature-card">
          <div className="check-icon">✓</div>

          <h2>Smart Conversations</h2>

          <p>
            Interact with Bodhi AI using intelligent prompts and get fast,
            contextual responses.
          </p>
        </div>

        {/* CARD 2 */}

        <div className="feature-card">
          <div className="check-icon">✓</div>

          <h2>Secure Gmail Login</h2>

          <p>
            Signup using your Gmail account and protect it with a strong
            password.
          </p>
        </div>

        {/* CARD 3 */}

        <div className="feature-card">
          <div className="check-icon">✓</div>

          <h2>Persistent Chat Memory</h2>

          <p>Keep your chat history and maintain context across sessions.</p>
        </div>

        {/* CARD 4 */}

        <div className="feature-card">
          <div className="check-icon">✓</div>

          <h2>Modern Real-time UI</h2>

          <p>
            Experience seamless real-time messaging with a clean and responsive
            interface.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
