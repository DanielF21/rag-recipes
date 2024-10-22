import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReactMarkdown from 'react-markdown'
import { CitationCard } from './CitationCard'

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  citations: Array<{ url: string; title: string }>;
}

export function ChatMessage({ content, isUser, citations }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start ${isUser ? 'max-w-[70%]' : 'max-w-[85%]'} w-full`}>
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={isUser ? "/user-avatar.png" : "/bot-avatar.png"} /> 
          <AvatarFallback>{isUser ? "U" : "B"}</AvatarFallback>
        </Avatar>
        <div className={`mx-3 p-4 rounded-lg ${isUser ? 'bg-teal-600 text-gray-900' : 'bg-gray-800 text-white'} flex-grow`}>
          {!isUser && citations.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {citations.map((citation, index) => (
                <CitationCard key={index} url={citation.url}>
                  <div className="h-16 flex items-center justify-center p-2">
                    <p className="text-white font-medium text-center text-sm">
                      {citation.title}
                    </p>
                  </div>
                </CitationCard>
              ))}
            </div>
          )}
          <ReactMarkdown className="text-lg prose prose-invert">{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}