import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDict } from '../../../../lib/i18n';
import { getProjectBySlug } from '../../../../lib/db';
import Gallery from '../../../../components/Gallery';
import Reveal from '../../../../components/Reveal';

export default function ProjectDetail({ params }) {
  const { locale, slug } = params;
  const dict = getDict(locale);
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="bg-charcoal text-paper min-h-[60vh]">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <Link href={`/${locale}/projelerimiz`} className="text-sm text-ochre hover:text-brick inline-flex items-center gap-1 mb-6">
          ← {dict.allProjects}
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <Reveal>
            <Gallery images={project.images} alt={project.name[locale]} className="h-72 md:h-96" />
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display text-3xl font-bold mb-3">{project.name[locale]}</h1>
            <span className="inline-flex items-center gap-1 bg-navylight border border-paper/10 text-paper text-xs rounded-full px-3 py-1.5 mb-5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C7.6 0 4 3.6 4 8c0 5.4 8 16 8 16s8-10.6 8-16c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
              </svg>
              {project.location}
            </span>
            {project.desc[locale] && (
              <p className="text-paper/70 leading-relaxed mb-6">{project.desc[locale]}</p>
            )}
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brick hover:bg-brickdark transition-colors text-charcoal text-sm font-medium px-5 py-2.5 rounded"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {dict.watchVideo}
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
