import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterDetails.css";

function RegisterDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { firstName, lastName, password, confirmPassword } = formData;

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const apiBaseUrl =
        import.meta.env.VITE_API_URL || "https://bodhi-5wnm.onrender.com/";

      /*
        Google OAuth se email already backend/session
        mein available hai.

        Yahan email dobara send karne ki zarurat nahi.
      */

      const response = await fetch(
        `${apiBaseUrl}/api/auth/google/complete-profile`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            password,
          }),
        },
      );

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      // Successful registration
      navigate("/registration-success");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    navigate("/register");
  }

  return (
    <div className="register-details-page">
      <div className="register-details-card">
        {/* LOGO */}
        <h1 className="bodhi-logo">
          Bodhi <span>AI</span>
        </h1>

        <p className="register-subtitle">Complete your account</p>

        <form onSubmit={handleSubmit}>
          {/* FIRST NAME */}
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>

            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="given-name"
            />
          </div>

          {/* LAST NAME */}
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>

            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="password">Create Password</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          {/* ERROR */}
          {error && <p className="register-error">{error}</p>}

          {/* CREATE ACCOUNT */}
          <button
            type="submit"
            className="create-account-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* BACK */}
          <button type="button" className="back-btn" onClick={handleBack}>
            Back
          </button>
        </form>

        {/* LOGIN */}
        <p className="login-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterDetails;
