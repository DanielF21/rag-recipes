import { Search, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ChatInput({ input, handleInputChange, handleSubmit }: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex items-center space-x-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={handleInputChange}
            className="w-full pl-14 pr-4 py-6 text-xl rounded-full border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-7 h-7" />
        </div>
        <Button 
          type="submit" 
          size="lg" 
          className="bg-teal-600 hover:bg-teal-700 text-gray-900 rounded-full w-[51px] h-[51px] flex items-center justify-center flex-shrink-0"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </form>
  );
}
