export default function LogoWatermark({ className = '' }) {
  return (
    <img
      src="/logo.jpg"
      alt=""
      aria-hidden="true"
      className={`pointer-events-none select-none absolute grayscale opacity-[0.14] ${className}`}
      style={{
        WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 75%)',
        maskImage: 'radial-gradient(circle, black 50%, transparent 75%)',
      }}
    />
  );
}
