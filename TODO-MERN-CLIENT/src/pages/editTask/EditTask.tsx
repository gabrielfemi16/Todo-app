import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { URL } from "../../App";
import DashBoard from "../DashBoard/DashBoard";

const EditTask = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  //location comes from the useLocation() hook in react-router-dom, and it gives you access to the current URL path and related info inside your component
  const location = useLocation();
  const navigate = useNavigate();

  const taskId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchtask = async () => {
      try {
        const res = await axios.get(`${URL}/user/getTask/${taskId}`, {
          withCredentials: true,
        });

        const task = res.data.task;
        setTaskName(task.taskName);
        setTaskDate(task.taskDate.split("T")[0]);
      } catch (err: any) {
        setMessage(err.response?.data?.message || "Failed to load Task");
      }
    };
    fetchtask();
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${URL}/user/updateTask/${taskId}`,
        { taskName, taskDate },
        { withCredentials: true }
      );
      navigate("/");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashBoard>
      <h2 className="form-title lightSalmon_text task_title">
        Edit: {taskName}
      </h2>
      {message && <p className="errorMsgs lightSalmon_text">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label className="lightSalmon_text">Task Name</label>
          <input
            type="text"
            id="taskName"
            placeholder="Enter Task"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
          <div>
            <label className="lightSalmon_text">Task date</label>
            <input
              type="date"
              id="taskDate"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Task"}
        </button>
      </form>
    </DashBoard>
  );
};

export default EditTask;

/*
this line: setTaskdate(task.taskDate.split("T")[0])
is used to format the date properly form an HTML <input type ="date"> field.

Explanation: since task.taskDate is something like: "2025-05-08T00:00.000Z"

then : task.tasDate.split("T")
returns: ["2025-05-08", 00:00.000Z]

task. taskDate.split("T")[0]
gives you just: "2025-05-08"
this is the format (YYYY-MM-DD) that HTML date inputs require.
 */
