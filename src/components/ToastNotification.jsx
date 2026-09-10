import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

const ToastNotification = ({
  title,
  message,
  type = 'info',
  position = 'top-end',
  duration = 0,
  showCloseButton = true,
  onClose,
  notificationId
}) => {
  useEffect(() => {
    const Toast = Swal.mixin({
      toast: true,
      position: position,
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: duration > 0,
      didOpen: (toast) => {
        if (duration > 0) {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
        // Add data-type attribute for custom styling
        toast.setAttribute('data-type', type);
      },
      willClose: async () => {
        if (onClose) onClose();
      }
    });

    const iconMap = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info',
      appointment: 'info',
      payment: 'success',
      reminder: 'warning'
    };

    Toast.fire({
      icon: iconMap[type] || 'info',
      title: title,
      text: message,
      showCloseButton: showCloseButton,
      customClass: {
        popup: 'toast-notification-popup',
        container: 'toast-notification-container'
      }
    });

    return () => {
      Swal.close();
    };
  }, [title, message, type, position, duration, showCloseButton, onClose]);

  return null;
};

export default ToastNotification;