import { useEffect, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    document.body.classList.add("LoginPage");
    return () => {
      document.body.classList.remove("LoginPage");
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/"); // Redirect to homepage on successful login
    } catch (err) {
      console.error("Login failed in component:", err);
    }
  };
  return (
    <>
      <h1 className="lightSalmon_text login_title">Login</h1>
      <form className="darkBlue_bg" onSubmit={handleSubmit}>
        <label htmlFor="email" className="lightSalmon_text">
          Email
        </label>
        <input
          type="text"
          id="email"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="date" className="lightSalmon_text">
          Password
        </label>
        <input
          type="password"
          placeholder="enter"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="lightSalmon_bg">
          {loading ? "Logging in..." : "submit"}
        </button>
        <div className="flex_row1">
          <Link to="/request-reset" className="lightSalmon_text">
            forgot password?
          </Link>
          <Link to="/register" className="lightSalmon_text">
            don't have an account?
          </Link>
        </div>
        {error && (
          <p className="error" style={{ color: "white", fontSize: "14px" }}>
            {" "}
            {error}{" "}
          </p>
        )}
      </form>
    </>
  );
};

export default Login;
