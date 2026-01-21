
import React, { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';

interface UnlockModalProps {
  target: { id: string; type: string; cost: number; title: string };
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const UnlockModal: React.FC<UnlockModalProps> = ({ target, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-[48px] p-10 text-center shadow-2xl scale-in">
        <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-[36px] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Lock size={40} />
        </div>
        <h3 className="text-2xl font-black text-app-text mb-2">Mở khóa nội dung</h3>
        <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed px-4">
          Bạn cần <span className="text-amber-500 font-black tracking-tight">{target.cost} STAR PTS</span> để mở khóa <b>{target.title}</b>.
        </p>
        <div className="space-y-4">
          <button 
            onClick={handleConfirm} 
            disabled={loading} 
            className="w-full py-5 bg-app-primary text-white rounded-3xl font-black shadow-xl shadow-app-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'XÁC NHẬN MỞ KHÓA'}
          </button>
          <button onClick={onCancel} className="w-full py-4 bg-slate-50 text-slate-400 rounded-3xl font-black uppercase text-[10px] tracking-widest">Để sau</button>
        </div>
      </div>
    </div>
  );
};

export default UnlockModal;
