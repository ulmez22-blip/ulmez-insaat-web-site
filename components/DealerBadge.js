export default function DealerBadge({ dealer, dict }) {
  const card = (
    <div className="bg-white text-charcoal border border-charcoal/10 rounded-lg h-28 flex items-center justify-center px-6 hover:border-brick hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      {dealer.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dealer.logo} alt={dealer.name} className="max-h-14 max-w-full object-contain" />
      ) : (
        <span className="font-display font-bold text-xl tracking-wide text-charcoal/70">
          {dealer.name}
        </span>
      )}
    </div>
  );

  if (!dealer.url) return card;

  return (
    <a href={dealer.url} target="_blank" rel="noopener noreferrer" aria-label={dealer.name}>
      {card}
    </a>
  );
}
