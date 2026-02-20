import { useEffect, useState } from 'react';

export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const TOAST_DURATION_MS = 4000;

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast.show, toast.message]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  return { toast, showToast };
};
