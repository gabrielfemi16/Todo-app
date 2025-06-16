import { useEffect, useState } from "react";
import "./requestReset.css";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../../App";

const RequestReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isloading, setIsLoading] = useState(false);
  useEffect(() => {
    document.body.classList.add("RequestPasswordReset");
    return () => {
      document.body.classList.remove("RequestPasswordReset");
    };
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
     const response = await axios.post(`${URL}/user/request-reset`,{
        email,
      })
      setMessage(response.data.message)
      setTimeout(()=> navigate("/"), 2000)
    } catch (error:any) {
        setMessage(error.response?.data?.message || "Someyhing went wrong");
    }finally{
        setIsLoading(false)
    }
  };
  return (
    <>
      <h1 className="lightSalmon_text login_title">Reset password</h1>
      <form className="darkBlue_bg" onSubmit={handleRequestReset}>
        <label htmlFor="email" className="lightSalmon_text">
          Email
        </label>
        <input
          type="eamil"
          placeholder="enter email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="lightSalmon_bg" type="submit" disabled={isloading}>
          {isloading ? "Requsting..." : "Requset Reset"}
        </button>
        {message && (
          <p className="error" style={{ color: "lightgreen"}}>
            {message}
          </p>
        )}
      </form>
    </>
  );
};

export default RequestReset;
