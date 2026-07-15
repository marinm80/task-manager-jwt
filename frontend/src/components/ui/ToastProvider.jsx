import { createContext, useCallback, useContext, useRef, useState } from 'react';
import Toast from './Toast';

const ToastContext = createContext(null);

// Duración visible de cada toast antes de desaparecer automáticamente.
const TOAST_TIMEOUT_MS = 4000;

let nextToastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    clearTimeout(timeoutsRef.current.get(id));
    timeoutsRef.current.delete(id);
  }, []);

  const showToast = useCallback(
    (type, message) => {
      const id = nextToastId++;
      setToasts((current) => [...current, { id, type, message }]);
      const timeoutId = setTimeout(() => dismissToast(id), TOAST_TIMEOUT_MS);
      timeoutsRef.current.set(id, timeoutId);
    },
    [dismissToast]
  );

  // Un toast de error exige una región aria-live="assertive" (interrumpe al
  // lector de pantalla de inmediato); el resto usa "polite" (RF-40).
  const liveMode = toasts.some((toast) => toast.type === 'error') ? 'assertive' : 'polite';

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live={liveMode}
        role="status"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} type={toast.type} message={toast.message} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastProvider;
