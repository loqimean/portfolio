interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export const Toast = ({ message, type }: ToastProps) => (
  <div
    role="alert"
    className={`fixed bottom-6 right-6 z-9999 max-w-sm px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-300 ${
      type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}
  >
    {type === 'success' ? (
      <span className="icon-[mdi--check-circle] size-6 shrink-0" />
    ) : (
      <span className="icon-[mdi--alert-circle] size-6 shrink-0" />
    )}
    <p className="m-0 text-sm font-medium">{message}</p>
  </div>
);
