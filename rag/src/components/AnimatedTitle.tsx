import React, { useState, useEffect } from 'react';

interface AnimatedTitleProps {
  title: string;
  subtitle: string;
}

export function AnimatedTitle({ title, subtitle }: AnimatedTitleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingTitle, setIsTypingTitle] = useState(true);
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    const fullText = title + '\n' + subtitle;
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingTitle(false);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [title, subtitle]);

  useEffect(() => {
    if (!isTypingTitle) {
      const caretInterval = setInterval(() => {
        setShowCaret((prev) => !prev);
      }, 500);

      return () => clearInterval(caretInterval);
    }
  }, [isTypingTitle]);

  return (
    <div className="text-center mb-16">
      <h1 className="text-6xl font-bold text-white mb-6 whitespace-pre-line">
        {displayedText.split('\n')[0]}
      </h1>
      <p className="text-teal-400 text-3xl">
        {displayedText.split('\n')[1]}
        {!isTypingTitle && showCaret && <span className="animate-blink">|</span>}
      </p>
    </div>
  );
}