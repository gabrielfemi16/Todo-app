import { useEffect, useState } from "react";
import DashBoard from "../DashBoard/DashBoard";
import "./createTask.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../../App";

const CreateTask = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get(`${URL}/account/me`, {
          withCredentials: true,
        });

        if (res.data.user && res.data.user.id) {
          setUserId(res.data.user.id); // the user id
        } else {
          setMessage("Unable to fetch user ID");
        }
      } catch (err) {
        console.error("Failed to fetch user ID:", err);
        setMessage("Failed to fetch user please log in again");
      }
    };
    fetchUserId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!userId) {
      setMessage(" user ID not available");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${URL}/user/createTask/${userId}`,
        {
          taskName,
          taskDate,
        },
        {
          withCredentials: true,
        }
      );

      setMessage(res.data.message || "Task created succcessfully");
      setTaskName("");
      setTaskDate("");

      navigate("/");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Somthing went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashBoard>
      <h1 className="lightSalmon_text task_title">Create Task</h1>
      <form className="darkBlue_bg" onSubmit={handleSubmit}>
        <label htmlFor="taskName" className="lightSalmon_text">
          Task Name
        </label>
        <input
          type="text"
          id="taskName"
          placeholder="enter task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <label htmlFor="date" className="lightSalmon_text">
          Completion Date
        </label>
        <input
          type="date"
          id="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
        />
        <button className="lightSalmon_bg" type="submit" disabled={loading}>
          {loading ? "Creating Task..." : "Submit"}
        </button>

        {message && <p className="errorMsgs lightSalmon_text">{message}</p>}
      </form>
    </DashBoard>
  );
};

export default CreateTask;
