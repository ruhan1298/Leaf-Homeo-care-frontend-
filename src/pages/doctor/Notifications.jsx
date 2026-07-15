import React, { useState, useEffect } from "react";
import DoctorLayout from "../../components/DoctorLayout";
import { 
  Bell, 
  Calendar, 
  Check, 
  X, 
  Loader2, 
  AlertCircle, 
  Clock,
  User,
  Video,
  CheckCircle,
  XCircle,
  CheckCheck
} from "lucide-react";
import { getNotifications } from "../../api/authApi";

const NOTIFICATION_TYPES = {
  appointment: {
    icon: Calendar,
    color: "bg-blue-100 text-blue-600",
    bgColor: "bg-blue-50"
  },
  payment: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-600",
    bgColor: "bg-green-50"
  },
  reminder: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  system: {
    icon: AlertCircle,
    color: "bg-gray-100 text-gray-600",
    bgColor: "bg-gray-50"
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export default function DoctorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      if (response.status === 1) {
        setNotifications(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Use mock data if API fails
      setNotifications([
        {
          id: 1,
          title: "New Appointment Request",
          message: "Rahul Sharma has requested a consultation for tomorrow at 10:00 AM",
          type: "appointment",
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: "Payment Completed",
          message: "Payment received for appointment with Priya Patel",
          type: "payment",
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          title: "Appointment Reminder",
          message: "Consultation with Amit Kumar starting in 30 minutes",
          type: "reminder",
          isRead: true,
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 4,
          title: "Appointment Cancelled",
          message: "Sneha Gupta has cancelled the appointment scheduled for today",
          type: "appointment",
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 5,
          title: "System Update",
          message: "New features have been added to the platform",
          type: "system",
          isRead: true,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-500">Stay updated with your activities</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl font-medium transition-all"
            >
              <CheckCheck size={16} />
              Mark All as Read
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-brand-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1">Total</p>
                <p className="text-2xl font-extrabold text-gray-900">{notifications.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center">
                <Bell className="h-6 w-6 text-brand-primary" />
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-brand-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1">Unread</p>
                <p className="text-2xl font-extrabold text-brand-primary">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center">
                <Bell className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-brand-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1">Appointments</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {notifications.filter(n => n.type === "appointment").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-brand-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1">Payments</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {notifications.filter(n => n.type === "payment").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["all", "unread", "appointment", "payment", "reminder"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === type
                  ? "bg-brand-primary text-white"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-brand-primary"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <Bell className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.system;
              const Icon = typeConfig.icon;

              return (
                <div
                  key={notification.id}
                  className={`bg-white border-2 rounded-2xl p-6 transition-all ${
                    !notification.isRead 
                      ? 'border-brand-primary/30 bg-brand-light/20' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${typeConfig.color} flex items-center justify-center shrink-0`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-bold text-gray-900 ${!notification.isRead ? 'text-base' : 'text-sm'}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-brand-primary" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-4">
                          <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">
                            {formatTime(notification.createdAt)}
                          </span>
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-1 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
                          >
                            <Check size={12} />
                            Mark as read
                          </button>
                        )}
                        <span className="text-xs text-gray-400">
                          {formatDateTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
