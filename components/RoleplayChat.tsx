import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { createRoleplaySession, sendRoleplayMessage } from '../services/geminiService';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { playAudio } from '../utils/audioUtils';

interface RoleplayChatProps {
  scenarioContext: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const RoleplayChat: React.FC<RoleplayChatProps> = ({ scenarioContext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize session on mount
    const session = createRoleplaySession(scenarioContext);
    if (session) {
      setChatSession(session);
      // Initial greeting from AI
      setLoading(true);
      sendRoleplayMessage(session, null, "Start the roleplay by greeting me as a customer.").then((res) => {
        setMessages([{ id: 'init', sender: 'ai', text: res.ai_response }]);
        setLoading(false);
      });
    } else {
        setMessages([{ id: 'err', sender: 'ai', text: "Lỗi kết nối AI (Kiểm tra API Key)" }]);
    }
  }, [scenarioContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatSession) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    const response = await sendRoleplayMessage(chatSession, null, inputText);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: response.ai_response };
    
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
    
    // Auto-play AI response audio for immersion
    playAudio(response.ai_response);
  };

  return (
    <div className="flex flex-col h-[500px] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-pink-600 p-3 text-white text-center text-sm font-semibold">
        Bạn tập luyện AI
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-pink-200 text-pink-700' : 'bg-gray-200 text-gray-700'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-pink-500 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
               <Loader2 size={16} className="animate-spin text-pink-500" />
               <span className="text-xs text-gray-500">Đang suy nghĩ...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập câu trả lời..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !inputText}
          className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default RoleplayChat;