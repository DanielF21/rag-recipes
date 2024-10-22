'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { AnimatedTitle } from './AnimatedTitle';
import { ExportButton } from './ExportButton';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  citations?: Array<{ url: string; title: string }>;
}

export default function RAGChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [content, setContent] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      const scrollToBottom = () => {
        messageContainerRef.current?.scrollTo({
          top: messageContainerRef.current?.scrollHeight,
          behavior: 'smooth'
        });
      };
      
      scrollToBottom();
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, content]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmitWrapper = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    try {
      const userMessage: Message = { id: uuidv4(), role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        citations: []
      };
      setMessages(prev => [...prev, assistantMessage]);

      const response = await fetch('/api/pinecone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [userMessage] }),
      });

      if (!response.ok) throw new Error('Failed to fetch');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        try {
          const contentMatch = chunk.match(/"content":\s*"([^"]*)/);
          if (contentMatch && contentMatch[1]) {
            const newContent = contentMatch[1].replace(/\\n/g, '\n');
            setContent(newContent);
            setMessages(prev => 
              prev.map(msg => 
                msg.id === assistantMessage.id 
                  ? { ...msg, content: newContent }
                  : msg
              )
            );
          }

          if (chunk.includes('"done":true')) {
            const finalContentMatch = chunk.match(/"content":\s*"([^"]*)/);
            if (finalContentMatch && finalContentMatch[1]) {
              const finalContent = finalContentMatch[1].replace(/\\n/g, '\n');
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, content: finalContent }
                    : msg
                )
              );
            }
          }

          const citationsMatch = chunk.match(/"citations":\s*(\[[^\]]+\])/);
          if (citationsMatch && citationsMatch[1]) {
            try {
              const citations = JSON.parse(citationsMatch[1]);
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, citations }
                    : msg
                )
              );
            } catch { 
            }
          }
        } catch (e) {
          console.error('Error processing chunk:', e);
        }
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col space-y-4 h-full">
        <AnimatedTitle 
          title="Ask me about Mexican Food"
          subtitle="I know over 3000 recipes"
        />
        
        <div ref={messageContainerRef} className="flex-grow overflow-y-auto space-y-8">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id}
              content={message.content}
              isUser={message.role === 'user'}
              citations={message.citations || []}
            />
          ))}
        </div>

        <div className="flex items-center space-x-1">
          <ChatInput 
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmitWrapper}
          />
          <ExportButton messages={messages} />
        </div>
      </div>
    </div>
  );
}
