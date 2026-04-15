export default function AvatarHeader({ profile }) {
  const initials = (profile.displayName || profile.username || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex flex-col items-center text-center">
      {profile.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt={profile.displayName || profile.username}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-100 mb-4"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center ring-4 ring-indigo-50 mb-4">
          <span className="text-3xl font-bold text-indigo-500">{initials}</span>
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900">
        {profile.displayName || profile.username}
      </h1>
      {profile.specialization && (
        <p className="text-indigo-600 font-medium mt-1">{profile.specialization}</p>
      )}
      {profile.location && (
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {profile.location}
        </p>
      )}
    </div>
  )
}
