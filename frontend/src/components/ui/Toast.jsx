// Toast individual, puramente presentacional. La región aria-live y el
// ciclo de vida (timeout de desaparición) los administra ToastProvider;
// este componente solo resuelve el marcado + tono según `type` (RF-40).
const TONE_CLASSES = {
  success: 'bg-mint text-green',
  error: 'bg-coral/15 text-coral-dark',
  info: 'bg-purple/15 text-purple',
};

export default function Toast({ type = 'info', message }) {
  return (
    <div
      className={`motion-safe:animate-toast-in-up rounded-card px-4 py-3 text-sm font-semibold shadow-md ${TONE_CLASSES[type]}`}
    >
      {message}
    </div>
  );
}
