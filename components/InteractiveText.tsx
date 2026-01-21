
import React from 'react';

interface InteractiveTextProps {
  text: string;
  onWordClick: (word: string) => void;
  className?: string;
  isUser?: boolean;
}

const InteractiveText: React.FC<InteractiveTextProps> = ({ text, onWordClick, className, isUser }) => {
  // Tách từ và giữ nguyên các dấu câu dính kèm để hiển thị, nhưng làm sạch khi click
  const words = text.split(/(\s+)/);

  return (
    <div className={`${className} leading-relaxed`}>
      {words.map((part, idx) => {
        // Nếu là khoảng trắng thì trả về text thuần
        if (/\s+/.test(part)) return <span key={idx}>{part}</span>;
        
        // Làm sạch từ để tra cứu (bỏ dấu câu)
        const cleanWord = part.replace(/[.,!?;:()"]/g, "");

        return (
          <span 
            key={idx} 
            onClick={(e) => {
              e.stopPropagation();
              onWordClick(cleanWord);
            }}
            className={`cursor-pointer transition-colors px-0.5 rounded-sm active:bg-app-primary/20 hover:bg-black/5 ${isUser ? 'hover:bg-white/10' : ''}`}
          >
            {part}
          </span>
        );
      })}
    </div>
  );
};

export default InteractiveText;
