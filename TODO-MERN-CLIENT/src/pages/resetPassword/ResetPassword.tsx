import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./resetPassword.css";
import { URL } from "../../App";

const ResetPassword = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("resetPassword");
    return () => {
      document.body.classList.remove("resetPassword");
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${URL}/user/reset-password`, {
        token,
        password,
        confirmPassword,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
    <h1 className="lightSalmon_text login_title">Reset Password</h1>
    <form className="darkBlue_bg" onSubmit={handleResetPassword}>
      <label htmlFor="password" className="lightSalmon_text">
        New Password
      </label>
      <input
        type="password"
        id="password"
        placeholder="enter your new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label htmlFor="confirmPassword" className="lightSalmon_text">
        confirm Password
      </label>
      <input
        type="password"
        placeholder="confirm your new password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button className="lightSalmon_bg">
        {isloading ? "Resetting..." : "Reset Password"}
      </button>
      {message && (
        <p className="error" style={{ color: "lightgreen" }}>
          {message}
        </p>
      )}
    </form>
  </>
  );
};

export default ResetPassword;
