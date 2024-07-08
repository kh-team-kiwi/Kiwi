import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/components/common/ToastNotification.css'; 

const ToastNotification = ({ text, type = "default", ...props }) => {
  const showToast = () => {
    const commonProps = {
      closeButton: <i className="custom-toast-close-button">✖</i>,
      ...props,
    };

    switch (type) {
      case "success":
        toast.success(text, commonProps);
        break;
      case "error":
        toast.error(text, commonProps);
        break;
      case "info":
        toast.info(text, commonProps);
        break;
      case "warn":
        toast.warn(text, commonProps);
        break;
      default:
        toast(text, commonProps);
    }
  };

  React.useEffect(() => {
    if (text) {
      showToast();
    }
  }, [text]);

  return <ToastContainer position='bottom-right' autoClose={2000} hideProgressBar/>;
};

export default ToastNotification;