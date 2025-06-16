import { useEffect, useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../../App";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCpassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${URL}/account/register`, {
        email,
        username,
        password,
        cPassword,
      });

      setMessage(res.data.message);
      navigate("/login");
    } catch (err: any) {
      console.log(err);
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("RegisterPage");

    return () => {
      document.body.classList.remove("RegisterPage");
    };
  }, []);
  return (
    <>
      <h1 className="lightSalmon_text register_title">Register</h1>
      <form className="darkBlue_bg" onSubmit={handleSubmit}>
        <label htmlFor="email" className="lightSalmon_text">
          email
        </label>
        <input
          type="text"
          id="email"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="username" className="lightSalmon_text">
          username
        </label>
        <input
          type="text"
          id="username"
          placeholder="enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password" className="lightSalmon_text">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="cPassword" className="lightSalmon_text">
          Password
        </label>
        <input
          type="Password"
          id="cPassword"
          placeholder="confirm password"
          value={cPassword}
          onChange={(e) => setCpassword(e.target.value)}
        />

        <button className="lightSalmon_bg" type="submit" disabled={loading}>
          {loading ? "Resitering..." : "submit"}
        </button>
        <Link to="/login">already have an account?</Link>

        {message && <p className="lightSalmon_text errorMsgs">{message}</p>}
      </form>
    </>
  );
};

export default Register;

//dependency array [] - makes sure it runs once 
