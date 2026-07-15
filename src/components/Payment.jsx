import React, { useState } from "react";
import Swal from "sweetalert2";
import { createPaymentOrder } from "../api/paymentApi";

const Payment = ({ appointmentId, amount, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await createPaymentOrder(appointmentId);

      if (response.status === 1) {
        const { paymentId, orderId, amount: orderAmount, currency, key } = response.data;

        const options = {
          key: key,
          amount: orderAmount,
          currency: currency,
          name: "Leaf Homeo Care",
          description: "Appointment Payment",
          order_id: orderId,
          handler: function (response) {
            // Payment successful
            Swal.fire({
              icon: "success",
              title: "Payment Successful",
              text: "Your payment has been processed successfully.",
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              if (onSuccess) onSuccess(response);
            });
          },
          prefill: {
            name: "",
            email: "",
            contact: "",
          },
          theme: {
            color: "#10B981",
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              if (onCancel) onCancel();
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to create payment order",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Payment failed. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : `Pay ₹${amount}`}
    </button>
  );
};

export default Payment;
