import { getDict } from '../../../lib/i18n';
import { getProjects } from '../../../lib/db';
import ProjectCard from '../../../components/ProjectCard';
import Reveal, { RevealGroup, RevealItem } from '../../../components/Reveal';

export default function ProjectsPage({ params }) {
  const { locale } = params;
  const dict = getDict(locale);
  const projects = getProjects();

  return (
    <div className="bg-charcoal text-paper min-h-[60vh]">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <Reveal>
          <h1 className="font-display text-3xl font-bold mb-2">{dict.projectsTitle}</h1>
          <p className="text-paper/60 mb-10 max-w-xl">{dict.projectsSubtitle}</p>
        </Reveal>

        {projects.length === 0 ? (
          <p className="text-sm text-paper/60">—</p>
        ) : (
          <RevealGroup className="grid md:grid-cols-3 gap-4">
            {projects.map((p) => (
              <RevealItem key={p.slug || p.id}>
                <ProjectCard project={p} locale={locale} dict={dict} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </div>
  );
}
