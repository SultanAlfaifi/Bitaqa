export default function ProjectCards({ projects }) {
  if (!projects || projects.length === 0) return null
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-3">المشاريع</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition"
          >
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-36 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="font-semibold text-gray-900 text-sm">{project.title}</h3>
            {project.description && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3">
                {project.description}
              </p>
            )}
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mt-3"
              >
                عرض المشروع
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
