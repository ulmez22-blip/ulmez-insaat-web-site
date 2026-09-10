import Link from 'next/link';

export default function ProjectCard({ project, locale, dict }) {
  const cover = project.images?.[0];

  return (
    <Link
      href={`/${locale}/projelerimiz/${project.slug}`}
      className="bg-white text-charcoal border border-charcoal/10 rounded-lg overflow-hidden flex flex-col h-full hover:border-brick hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
    >
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt={project.name[locale]} className="w-full h-40 object-cover" />
      ) : (
        <div className="h-1 w-10 bg-brick rounded-full m-5 mb-0" />
      )}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-medium mb-2">{project.name[locale]}</h3>
        {project.desc[locale] && (
          <p className="text-sm text-charcoal/60 leading-relaxed flex-1">{project.desc[locale]}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-charcoal text-paper text-xs rounded-full px-3 py-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C7.6 0 4 3.6 4 8c0 5.4 8 16 8 16s8-10.6 8-16c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
            </svg>
            {project.location}
          </span>
          {project.images?.length > 1 && (
            <span className="inline-flex items-center gap-1 border border-charcoal/20 text-charcoal/60 text-xs rounded-full px-3 py-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              {project.images.length}
            </span>
          )}
          {project.videoUrl && (
            <span className="inline-flex items-center gap-1 border border-charcoal/20 text-charcoal/70 text-xs rounded-full px-3 py-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Video
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
