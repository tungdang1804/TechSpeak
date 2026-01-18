import React, { useState } from 'react';
import { Vocabulary } from '../types';
import { playAudio } from '../utils/audioUtils';
import { Volume2, RotateCw } from 'lucide-react';

interface FlashcardProps {
  vocab: Vocabulary;
}

const Flashcard: React.FC<FlashcardProps> = ({ vocab }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    playAudio(vocab.word);
  };

  return (
    <div className="w-full max-w-sm h-80 mx-auto cursor-pointer perspective-1000" onClick={handleFlip}>
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Face */}
        <div className="absolute w-full h-full bg-white rounded-2xl shadow-lg border border-pink-100 flex flex-col items-center justify-center p-6 backface-hidden">
          <img 
            src={vocab.imageUrl} 
            alt={vocab.word} 
            className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-pink-50"
          />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{vocab.word}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <RotateCw size={14} /> Chạm để lật
          </p>
          <button 
            onClick={handlePlayAudio}
            className="mt-4 p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition shadow-md"
          >
            <Volume2 size={24} />
          </button>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full bg-pink-500 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 backface-hidden rotate-y-180">
          <h3 className="text-2xl font-bold mb-2">{vocab.word}</h3>
          <p className="text-xl italic mb-4 text-pink-100">"{vocab.translation}"</p>
          <hr className="w-1/2 border-pink-300 mb-4"/>
          <p className="text-center text-sm">{vocab.definition}</p>
          <button 
            onClick={handlePlayAudio}
            className="mt-6 p-2 bg-white text-pink-600 rounded-full hover:bg-gray-100 transition shadow-sm"
          >
             <Volume2 size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Flashcard;