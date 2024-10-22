import { useState } from 'react';
import { Message } from 'ai';
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ExportButtonProps {
  messages: Message[];
}

export function ExportButton({ messages }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportChatHistory = () => {
    setIsExporting(true);
    const chatLog = messages.map(msg => 
      `${msg.role.toUpperCase()}: ${msg.content}\n`
    ).join('\n');
    
    const blob = new Blob([chatLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mexican-food-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={exportChatHistory}
            size="icon"
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full w-[58px] h-[51px] flex items-center justify-center flex-shrink-0"
            disabled={isExporting || messages.length === 0}
          >
            <Download className="h-7 w-7" />
            <span className="sr-only">Export chat history</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export chat history</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}