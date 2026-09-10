export default function MaterialSwatch({ color = '#C9BBA0', sku, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: color,
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 10px)',
      }}
    >
      <span className="absolute bottom-1.5 right-2 font-mono text-[10px] tracking-wide text-black/40">
        {sku}
      </span>
    </div>
  );
}
