"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING";
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);

    const res = await fetch("/api/notifications");
    const data = await res.json();

    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // mark as read
  const markAsRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchNotifications();
  };

  const getColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "border-green-500 bg-green-50";
      case "WARNING":
        return "border-yellow-500 bg-yellow-50";
      default:
        return "border-blue-500 bg-blue-50";
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`border-l-4 p-4 rounded shadow-sm ${getColor(
                n.type
              )} ${!n.isRead ? "font-semibold" : "opacity-70"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg">{n.title}</h2>
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-xs px-3 py-1 bg-black text-white rounded"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}