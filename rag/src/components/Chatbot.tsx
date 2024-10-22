"use client"
import { useState } from 'react'
import { SuggestionCard } from './SuggestionCard'
import { CitationCard } from './CitationCard'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { AnimatedTitle } from './AnimatedTitle'

export default function RAGChatbot() {
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([])
  const [citations, setCitations] = useState<Array<{ text: string; url: string }>>([])

  const handleSubmit = (query: string) => {
    setMessages(prev => [...prev, { content: query, isUser: true }])
    
    // TODO: Implement RAG chatbot logic here
    setTimeout(() => {
      setMessages(prev => [...prev, { content: `You asked about: ${query}`, isUser: false }])
      setCitations(prev => [...prev, { text: 'Sample citation', url: 'https://example.com' }])
    }, 1000)
  }

  const suggestions = [
    { emoji: '💰', text: 'Card 1' },
    { emoji: '🔍', text: 'Card 2' },
    { emoji: '🧊', text: 'Card 3' },
    { emoji: '🏔️', text: 'Card 4' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-12">
        <AnimatedTitle 
          title="Ask me about Cooking"
          subtitle="I know over 1000 recipes"
        />
        
        <ChatInput onSubmit={handleSubmit} />
        
        <div className="space-y-12">
          {messages.length > 0 ? (
            <>
              <div className="space-y-8">
                {messages.map((message, index) => (
                  <ChatMessage key={index} content={message.content} isUser={message.isUser} />
                ))}
              </div>
              
              {citations.length > 0 && (
                <div>
                  <h2 className="text-white text-3xl mb-6">Citations</h2>
                  <div className="grid grid-cols-1 gap-8">
                    {citations.map((citation, index) => (
                      <CitationCard key={index} url={citation.url}>
                        <div className="h-full flex items-center justify-center p-9">
                          <p className="text-white font-medium text-center text-3xl">
                            {citation.text}
                          </p>
                        </div>
                      </CitationCard>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <h2 className="text-white text-3xl mb-8">Suggested queries</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {suggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={index}
                    emoji={suggestion.emoji}
                    text={suggestion.text}
                    onClick={() => handleSubmit(suggestion.text)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}