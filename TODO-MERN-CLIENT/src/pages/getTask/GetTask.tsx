import { useEffect, useState } from "react";
import DashBoard from "../DashBoard/DashBoard";
import "./getTask.css";
import axios from "axios";
import { URL } from "../../App";
import { Link } from "react-router-dom";

interface Task {
  _id: string;
  taskName: string;
  taskDate: string;
  done: boolean;
}

const GetTask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchUserIdAndTasks = async () => {
      try {
        const res = await axios.get(`${URL}/account/me`, {
          withCredentials: true,
        });

        if (res.data.user && res.data.user.id) {
          const userId = res.data.user.id;

          const taskRes = await axios.get(`${URL}/user/getTasks/${userId}`, {
            withCredentials: true,
          });

          if (taskRes.data.tasks.length === 0) {
            setMessage("No tasks found");
          } else {
            setTasks(taskRes.data.tasks);
          }
        } else {
          setMessage("Unable to get user");
        }
      } catch (err: any) {
        console.error(err);
        setMessage(err.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndTasks();
  }, []);

  const handleDelete = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setDeletingId(taskId);
      await axios.delete(`${URL}/user/deleteTask/${taskId}`, {
        withCredentials: true,
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setToast("Task deleted successfully");
      setTimeout(() => setToast(""), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleDone = async (taskId: string) => {
    try {
      const res = await axios.patch(`${URL}/user/toggleDone/${taskId}`, null, {
        withCredentials: true,
      });

      const updatedTask = res.data.task;

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to update task");
    }
  };

  return (
    <DashBoard>
      <div className="task-container darkBlue_bg">
        <h1 className="task-title lightSalmon_text">Task List</h1>
        {toast && <p className="success-toast lightSalmon_text">{toast}</p>}
        {loading ? (
          <p className="lightSalmon_text">Loading...</p>
        ) : message ? (
          <p className="errorMsgs lightSalmon_text">{message}</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className="task-item darkBlue_bg" key={task._id}>
                <div className="task-info">
                  <h3 className="lightSalmon_text">
                    {task.taskName} {task.done && <span>✅</span>}
                  </h3>
                  <p className="lightSalmon_text1">{task.taskDate}</p>
                </div>
                <div className="task-actions">
                  <Link to={`/edit-task/${task._id}`}>
                    <button className="edit-btn">Edit</button>
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(task._id)}
                  >
                    {deletingId === task._id ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    className="complete-btn"
                    onClick={() => handleToggleDone(task._id)}
                  >
                    {task.done ? "Undone" : "done"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashBoard>
  );
};

export default GetTask;
