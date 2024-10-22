import { Card, CardContent } from "@/components/ui/card"

interface SuggestionCardProps {
  emoji: string;
  text: string;
  onClick: () => void;
}

export function SuggestionCard({ emoji, text, onClick }: SuggestionCardProps) {
  return (
    <Card 
      className="bg-gray-800 border border-gray-700 hover:border-teal-400 transition-colors duration-200 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6 flex items-center justify-center h-[80px]"> 
        <div className="flex flex-col items-center justify-center h-full"> 
          <p className="text-white text-center text-[1.25rem] font-medium">{text}</p> 
        </div>
      </CardContent>
    </Card>
  )
}
