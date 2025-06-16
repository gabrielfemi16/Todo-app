import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";
// import download from "/download.jpeg";
import { useAuth } from "../../context/AuthContext";
import { URL } from "../../App";

interface SidebarProps {
  isOpen: boolean;
  toggleNavbar: () => void;
}

const Sidebar = ({ isOpen, toggleNavbar }: SidebarProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed in sidebar:", err);
    }
  };
  return (
    <div className={`sidebar darkBlue_bg ${isOpen ? "open" : "closed"}`}>
      <div className="flex_row">
        <h2 className="lightSalmon_text title">My Dashboard</h2>
        <i
          className="fa-solid fa-angle-left lightSalmon_text1"
          onClick={toggleNavbar}
        ></i>
      </div>

      <div className="lightSalmon_bg flex_row title2">
        <i className="fa-solid fa-house"></i>
        <Link to="/">Dashboard</Link>
        <i className="fa-solid fa-angle-right"></i>
      </div>

      <p className="lightSalmon_text sub_title">User Links</p>

      <div className="links flex_column">
        <div className="linkItem lightSalmon_text flex_row1">
          <i className="fa-solid fa-folder-plus"></i>
          <Link to="/createTask" className="white_text">
            create task
          </Link>
        </div>
        <div className="linkItem lightSalmon_text flex_row1">
          <i className="fa-solid fa-get-pocket"></i>
          <Link to="/" className="white_text">
            See all task
          </Link>
        </div>
        <div className="linkItem lightSalmon_text flex_row1">
          <i className="fa-solid fa-gear"></i>
          <Link to="/settings" className="white_text">
            settings
          </Link>
        </div>
      </div>

      <p className="lightSalmon_text sub_title">Sales</p>

      <div className="links flex_column">
        <div className="linkItem lightSalmon_text flex_row1">
          <i className="fa-solid fa-folder-plus"></i>
          <Link to="/createTask" className="white_text">
            create task
          </Link>
        </div>
        <div className="linkItem lightSalmon_text flex_row1">
          <i className="fa-solid fa-get-pocket"></i>
          <Link to="/" className="white_text">
            See all task
          </Link>
        </div>
        <div className="linkItem lightSalmon_text flex_row1">
          <i className="fa-solid fa-gear"></i>
          <Link to="/settings" className="white_text">
            settings
          </Link>
        </div>
      </div>

      <p className="lightSalmon_text sub_title">Admin</p>

      <div className="links flex_column mb1">
        <div className="linkItem lightSalmon_text flex_row1">
          <i className="fa-solid fa-folder-plus"></i>
          <Link to="/createTask" className="white_text">
            create task
          </Link>
        </div>
        <div className="linkItem lightSalmon_text flex_row1">
          <i className="fa-solid fa-get-pocket"></i>
          <Link to="/" className="white_text">
            See all task
          </Link>
        </div>
        <div className="linkItem lightSalmon_text flex_row1">
          <i className="fa-solid fa-gear"></i>
          <Link to="/settings" className="white_text">
            settings
          </Link>
        </div>
      </div>

      <div className="limkitem lightSalmon-text flex_row1">
        <i className="fa-soild fa-gear"></i>
        <div
          onClick={handleLogout}
          className="white_text"
          style={{ cursor: "pointer" }}
        >
          Logout
        </div>
      </div>

      <div className="bottom flex_row darkBlue_bg">
        <img src={`${URL}/uploads/${user?.image}`} alt="avarta" />
        <p className="lightSalmon_text">{user?.username || "Guest"}</p>
        <i className="fa-solid fa-user-gear lightSalmon_text1"></i>
      </div>
    </div>
  );
};

export default Sidebar;
