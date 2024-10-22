import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { ReactNode } from 'react'

interface CitationCardProps {
  url: string;
  children: ReactNode;
}

export function CitationCard({ url, children }: CitationCardProps) {
  return (
    <Link href={url} passHref>
      <Card className="bg-gray-800 border border-gray-700 hover:border-teal-400 transition-colors duration-200 rounded-lg cursor-pointer">
        <CardContent className="p-0 h-[150px]">
          {children}
        </CardContent>
      </Card>
    </Link>
  )
}