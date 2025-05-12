import { useEffect, useState } from "react";

import "../styles/NotificationBell.css";
import { timeAgo } from "../utils/timeAgo";

import notificationIcon from "../assets/icons/notification.png";

export const getNotifications = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_DATABASE_URL}/notifications`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
};

export const markNotificationsRead = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_DATABASE_URL}/notifications/read-all`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to mark as read");
  return res.json();
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markNotificationsRead();
      setNotifications([]);
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={() => setOpen(!open)}>
        <img src={notificationIcon} alt="Notification" />
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </div>
      {open && (
        <div className="notification-dropdown">
          <ul>
            {notifications.length === 0 ? (
              <li className="empty">No new notifications</li>
            ) : (
              notifications.map((n, i) => (
                <li key={i} className="notification-item">
                  <div className="notification-header">
                    <strong>{n.title}</strong>
                    <span className="time-ago">{timeAgo(n.timestamp)}</span>
                  </div>
                  <div className="notification-body">{n.message}</div>
                </li>
              ))
            )}
          </ul>
          {notifications.length > 0 && (
            <button className="mark-read" onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
}
