import React from "react";
import { toast } from "react-toastify";

export const Toast = (message, className = "", icon) => {
  toast(
    <div className={`font-bold ${className}`}>
      {message}
    </div>,
    {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      icon: icon,
    }
  );
};
