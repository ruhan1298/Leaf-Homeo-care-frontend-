import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastNotification from '../components/ToastNotification';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const addToastWithNotification = useCallback((toast, notificationId) => {
    const id = Date.now();
    const newToast = { ...toast, id, notificationId };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showAppointmentRequest = useCallback((patientName, appointmentTime) => {
    return addToast({
      title: 'New Appointment Request',
      message: `${patientName} has requested an appointment for ${appointmentTime}`,
      type: 'appointment',
      position: 'top-end',
      duration: 0,
      showCloseButton: true
    });
  }, [addToast]);

  const showAppointmentAccepted = useCallback((patientName) => {
    return addToast({
      title: 'Appointment Accepted',
      message: `Appointment with ${patientName} has been accepted`,
      type: 'success',
      position: 'top-end',
      duration: 0,
      showCloseButton: true
    });
  }, [addToast]);

  const showAppointmentRejected = useCallback((patientName) => {
    return addToast({
      title: 'Appointment Rejected',
      message: `Appointment with ${patientName} has been rejected`,
      type: 'warning',
      position: 'top-end',
      duration: 0,
      showCloseButton: true
    });
  }, [addToast]);

  const showPaymentReceived = useCallback((amount, patientName) => {
    return addToast({
      title: 'Payment Received',
      message: `₹${amount} received from ${patientName}`,
      type: 'payment',
      position: 'top-end',
      duration: 0,
      showCloseButton: true
    });
  }, [addToast]);

  const showReminder = useCallback((message) => {
    return addToast({
      title: 'Reminder',
      message: message,
      type: 'reminder',
      position: 'top-end',
      duration: 0,
      showCloseButton: true
    });
  }, [addToast]);

  const showCustomToast = useCallback((title, message, type = 'info', options = {}) => {
    return addToast({
      title,
      message,
      type,
      position: options.position || 'top-end',
      duration: options.duration !== undefined ? options.duration : 0,
      showCloseButton: options.showCloseButton !== false
    });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    addToastWithNotification,
    removeToast,
    showAppointmentRequest,
    showAppointmentAccepted,
    showAppointmentRejected,
    showPaymentReceived,
    showReminder,
    showCustomToast
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          title={toast.title}
          message={toast.message}
          type={toast.type}
          position={toast.position}
          duration={toast.duration}
          showCloseButton={toast.showCloseButton}
          onClose={() => removeToast(toast.id)}
          notificationId={toast.notificationId}
        />
      ))}
    </NotificationContext.Provider>
  );
};