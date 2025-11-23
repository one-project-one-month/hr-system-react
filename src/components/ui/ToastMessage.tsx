import React, { useEffect, useState, useRef } from 'react';
import '../css/Toast.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

const ToastMessage: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [closing, setClosing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setClosing(true);
      // match exit animation duration e.g. 500ms
      setTimeout(onClose, 500);
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setClosing(true);
    setTimeout(onClose, 500);
  };

  return (
    <div className={`toast toast--${type} ${closing ? 'toast--closing' : ''}`}>
      <span className='toast__message'>{message}</span>
      <button
        className='toast__close'
        onClick={handleClose}
        aria-label='Close'>
        &times;
      </button>
    </div>
  );
};

export default ToastMessage;
