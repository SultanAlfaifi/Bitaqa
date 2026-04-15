const levelStyles = {
  BEGINNER: 'bg-gray-100 text-gray-600 border-gray-200',
  INTERMEDIATE: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  EXPERT: 'bg-indigo-600 text-white border-indigo-600',
}

export default function SkillChips({ skills }) {
  if (!skills || skills.length === 0) return null
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-3">المهارات</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className={`px-3 py-1 rounded-full text-sm font-medium border ${levelStyles[skill.level] || levelStyles.BEGINNER}`}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  )
}
