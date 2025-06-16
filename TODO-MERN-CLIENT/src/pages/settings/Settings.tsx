import { useEffect, useState } from "react";
import DashBoard from "../DashBoard/DashBoard";
import "./settings.css";
import axios from "axios";
import { URL } from "../../App";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<any>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${URL}/account/me`, {
          withCredentials: true,
        });
        const userData = res.data.user;
        if (userData && userData.id) {
          setUserId(userData.id);
          setUser(userData);
          setUsername(userData.username || "");
        } else {
          setMessage("User not found");
        }
      } catch (err) {
        console.error(err);
        setMessage("Error loading user");
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!userId) {
      setMessage("User ID missing");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    if (file) formData.append("image", file);

    try {
      const res = await axios.put(
        `${URL}/user/updateUser/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setMessage(res.data.message);

      const updatedRes = await axios.get(`${URL}/account/me`, {
        withCredentials: true,
      });
      const updatedUser = updatedRes.data.user;

      setUser(updatedUser);
      setUsername(updatedUser.username);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Update failed. please try again.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashBoard>
      <h1 className="lightSalmon_text settings_title">Update Profile</h1>
      {message && <p className="errorMsgs lightSalmon_text">{message}</p>}

      <div className="profile_image_preview">
        {user?.image && (
          <img
            src={`${URL}/uploads/${user.image}`}
            alt="profile"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}
      </div>
      <form className="darkBlue_bg" onSubmit={handleSubmit}>
        <label htmlFor="pics" className="lightSalmon_text">
          Upload photo
        </label>
        <input
          type="file"
          id="pics"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <label htmlFor="username" className="lightSalmon_text">
          username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="lightSalmon_bg" type="submit" disabled={loading}>
          {loading ? "Updating..." : "update user info"}
        </button>
      </form>
    </DashBoard>
  );
};

export default Settings;
