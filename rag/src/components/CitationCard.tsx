import Link from 'next/link'

interface CitationCardProps {
  url: string
  children: React.ReactNode
}

export function CitationCard({ url, children }: CitationCardProps) {
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <div className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors">
        {children}
      </div>
    </Link>
  )
}