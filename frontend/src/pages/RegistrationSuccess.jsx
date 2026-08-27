import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RegistrationSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎉 Registration Successful!</h1>
      <p>Redirecting to login in 3 seconds...</p>
    </div>
  );
}
