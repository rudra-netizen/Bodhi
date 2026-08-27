import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      login(data.user);

      navigate("/chat");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>
          Bodhi <span>AI</span>
        </h1>

        <p className="auth-subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="bottom-text">
          Don't have an account?
          <span onClick={() => navigate("/register")}>Create one</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
