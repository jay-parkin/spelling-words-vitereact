import { useNavigate } from "react-router-dom";

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/auth");
  };

  return (
    <div className="dashboard-navbar">
      <h2>Dashboard</h2>
      <div className="dashboard-navbar-buttons">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
