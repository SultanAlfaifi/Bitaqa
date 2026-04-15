export default function BioSection({ bio, websiteUrl }) {
  if (!bio && !websiteUrl) return null
  return (
    <div className="text-center space-y-2">
      {bio && (
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{bio}</p>
      )}
      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:underline inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {websiteUrl.replace(/^https?:\/\//, '')}
        </a>
      )}
    </div>
  )
}
