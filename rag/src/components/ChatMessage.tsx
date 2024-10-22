import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

export function ChatMessage({ content, isUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-3xl`}>
        <Avatar className="w-10 h-10">
          <AvatarImage src={isUser ? "/user-avatar.png" : "/bot-avatar.png"} /> 
          <AvatarFallback>{isUser ? "U" : "B"}</AvatarFallback>
        </Avatar>
        <div className={`mx-3 p-4 rounded-lg ${isUser ? 'bg-teal-400 text-gray-900' : 'bg-gray-800 text-white'}`}>
          <p className="text-lg">{content}</p>
        </div>
      </div>
    </div>
  )
}
