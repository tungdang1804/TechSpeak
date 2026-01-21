
import React, { useEffect, useRef } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { playAudio } from '../../utils/audioUtils';
import InteractiveText from '../InteractiveText';

interface RoleplayMessageListProps {
  messages: any[];
  processing: boolean;
  onWordLookup: (word: string) => void;
}

const RoleplayMessageList: React.FC<RoleplayMessageListProps> = ({ messages, processing, onWordLookup }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, processing]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-44">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
          <div className={`p-5 rounded-[28px] text-sm shadow-sm border max-w-[85%] relative ${msg.sender === 'user' ? 'bg-indigo-600 text-white border-indigo-700 rounded-br-none' : 'bg-white text-slate-800 border-slate-100 rounded-bl-none'}`}>
             {msg.sender === 'ai' && (
               <button onClick={() => playAudio(msg.text)} className="absolute -top-3 -right-3 w-8 h-8 bg-white border shadow-md rounded-full flex items-center justify-center text-app-primary active:scale-90">
                 <Volume2 size={14} />
               </button>
             )}
             
             {msg.text || msg.transcript ? (
               <InteractiveText 
                text={msg.text || msg.transcript} 
                onWordClick={onWordLookup} 
                isUser={msg.sender === 'user'} 
                className={msg.sender === 'user' ? 'text-white' : 'text-slate-800'} 
               />
             ) : (
               <div className="flex items-center gap-2">
                 <Loader2 className="animate-spin" size={14} /> 
                 <span className="text-[10px] font-black uppercase">Đang phân tích...</span>
               </div>
             )}

             {msg.feedback && <div className="mt-3 pt-3 border-t border-white/10 text-[10px] font-bold text-white/70 italic">💡 {msg.feedback}</div>}
          </div>
        </div>
      ))}
      {processing && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
        <div className="flex justify-start animate-pulse">
           <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-100 flex items-center gap-3 shadow-md">
              <Loader2 className="animate-spin text-indigo-600" size={18} />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Đang nghe...</span>
           </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default React.memo(RoleplayMessageList);
