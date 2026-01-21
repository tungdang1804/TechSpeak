
import { useState, useRef } from 'react';
import { Chat } from '@google/genai';
import { createRoleplaySession, sendRoleplayMessage, analyzeConversationHistory } from '../../services/ai/conversationService';
import { playAudio } from '../../utils/audioUtils';
import { auth } from '../../services/firebase';
import { addPoints, getUserProfile } from '../../services/userService';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

export const useRoleplayLogic = (scenarioContext: string, multiplier: number = 1.0) => {
  const [session, setSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const { isRecording, base64Data, mimeType, start, stop } = useAudioRecorder();
  const [processing, setProcessing] = useState(false);
  const [completion, setCompletion] = useState(0);
  const [currentSatisfaction, setCurrentSatisfaction] = useState(60);
  const [summary, setSummary] = useState<any | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const initSession = async () => {
    setProcessing(true);
    const uid = auth.currentUser?.uid || "guest";
    const profile = await getUserProfile(uid);
    const level = profile.starLevel + 1;
    const newSession = createRoleplaySession(scenarioContext, level);
    setSession(newSession);
    setMessages([]);
    setSummary(null);
    setCompletion(0);
    setProcessing(false);
  };

  const startConversation = async () => {
    if (!session) return;
    setProcessing(true);
    try {
      const response = await sendRoleplayMessage(session, null, "Hello, can we start?");
      setMessages([{ id: Date.now().toString(), sender: 'ai', text: response.ai_response }]);
      playAudio(response.ai_response);
    } finally { setProcessing(false); }
  };

  const handleStopRecording = async () => {
    await stop();
  };

  // Effect theo dõi base64 từ recorder
  const lastBase64 = useRef<string | null>(null);
  if (base64Data && base64Data !== lastBase64.current && !isRecording) {
    lastBase64.current = base64Data;
    handleUserResponse(base64Data, mimeType);
  }

  async function handleUserResponse(b64: string, type: string) {
    if (!session) return;
    setProcessing(true);
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempId, sender: 'user', text: '' }]);
    
    try {
      const response = await sendRoleplayMessage(session, b64, null, type);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempId);
        return [...filtered, 
          { id: tempId, sender: 'user', transcript: response.user_transcript, feedback: response.feedback, score: response.score, text: '' },
          { id: (Date.now() + 1).toString(), sender: 'ai', text: response.ai_response, satisfaction: response.satisfaction }
        ];
      });
      setCompletion(response.completion_percentage);
      setCurrentSatisfaction(response.satisfaction);
      playAudio(response.ai_response);
    } finally { setProcessing(false); }
  }

  const finishAndGrade = async () => {
    setIsFinishing(true);
    const history = messages.map(m => ({ role: m.sender === 'user' ? 'Technician' : 'Customer', text: m.transcript || m.text }));
    try {
      const report = await analyzeConversationHistory(history);
      const points = Math.floor(report.professional_rating * multiplier);
      await addPoints(auth.currentUser?.uid || "guest", points, `Roleplay Performance`);
      setSummary({ ...report, pointsEarned: points, bonusMultiplier: multiplier });
    } finally { setIsFinishing(false); }
  };

  return {
    messages, isRecording, processing, completion, currentSatisfaction,
    summary, isFinishing, initSession, startConversation, startRecording: start, 
    setIsRecording: handleStopRecording, finishAndGrade
  };
};
