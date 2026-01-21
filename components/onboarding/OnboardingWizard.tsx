
import React, { useState } from 'react';
import { UserProfile, updateProgress } from '../../services/userService';
import { 
  User, 
  ArrowRight, 
  Sparkles, 
  Wine, 
  Hammer, 
  Wrench,
  CheckCircle2,
  ChevronLeft,
  Lock
} from 'lucide-react';

interface OnboardingWizardProps {
  user: UserProfile;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user }) => {
  const [step, setStep] = useState(1);
  // Thêm optional chaining và fallback
  const [gender, setGender] = useState<'male' | 'female'>(user?.avatarConfig?.gender || 'female');
  const [name, setName] = useState(user?.displayName || '');
  const [industry, setIndustry] = useState(user?.primaryIndustry || 'nails');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const INDUSTRIES = [
    { id: 'nails', label: 'Nail & Spa', icon: <Sparkles />, desc: 'Chuyên viên Nail, Massage, Skincare', active: true },
    { id: 'bartender', label: 'Bartender', icon: <Wine />, desc: 'Pha chế, Phục vụ nhà hàng/bar', active: false },
    { id: 'flooring', label: 'Xây dựng', icon: <Hammer />, desc: 'Lót sàn, Thợ mộc, Điện nước', active: false },
    { id: 'mechanic', label: 'Cơ khí', icon: <Wrench />, desc: 'Sửa chữa ô tô, Vận hành máy', active: false },
  ];

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await updateProgress(user.uid, {
        displayName: name,
        primaryIndustry: industry as any,
        avatarConfig: { ...user.avatarConfig, gender },
        onboardingComplete: true
      });
    } catch (e) {
      alert("Lỗi lưu thông tin Onboarding");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-app-bg flex flex-col animate-fade-in overflow-hidden">
      {/* Progress Bar */}
      <div className="h-1 bg-slate-100 w-full flex">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`flex-1 transition-all duration-500 ${s <= step ? 'bg-app-primary' : 'bg-transparent'}`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col p-8 max-w-md mx-auto w-full">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="mb-8 self-start p-2 -ml-2 text-slate-400">
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Step 1: Gender / Character Base */}
        {step === 1 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="text-3xl font-black text-app-text mb-2 leading-tight">Chọn hình tượng<br/>của bạn</h2>
            <p className="text-sm text-slate-400 font-bold mb-12">Điều này sẽ xác định nhân vật Chibi đại diện cho bạn trong phòng học.</p>
            
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => setGender('female')}
                className={`flex flex-col items-center p-8 rounded-[40px] border-4 transition-all ${gender === 'female' ? 'bg-app-primary/10 border-app-primary' : 'bg-white border-slate-50 opacity-60'}`}
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm">👩‍🔧</div>
                <span className="font-black text-xs uppercase tracking-widest">Nữ giới</span>
              </button>
              <button 
                onClick={() => setGender('male')}
                className={`flex flex-col items-center p-8 rounded-[40px] border-4 transition-all ${gender === 'male' ? 'bg-app-primary/10 border-app-primary' : 'bg-white border-slate-50 opacity-60'}`}
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm">👨‍🔧</div>
                <span className="font-black text-xs uppercase tracking-widest">Nam giới</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Name */}
        {step === 2 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="text-3xl font-black text-app-text mb-2 leading-tight">Bạn tên là gì?</h2>
            <p className="text-sm text-slate-400 font-bold mb-12">Chúng sẽ dùng tên này để AI gọi bạn trong các tình huống thực chiến.</p>
            
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-app-primary" size={24} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full pl-16 pr-8 py-6 bg-white border-2 border-slate-100 rounded-[32px] text-lg font-black focus:border-app-primary focus:ring-4 focus:ring-app-primary/5 transition-all outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Industry */}
        {step === 3 && (
          <div className="flex-1 flex flex-col animate-fade-in pb-10">
            <h2 className="text-3xl font-black text-app-text mb-2 leading-tight">Ngành nghề<br/>bạn làm?</h2>
            <p className="text-sm text-slate-400 font-bold mb-8">Hiện tại chúng tôi tập trung tối ưu cho ngành Nail & Spa. Các ngành khác sẽ sớm ra mắt.</p>
            
            <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[50dvh] pb-4">
              {INDUSTRIES.map((ind) => (
                <button 
                  key={ind.id}
                  disabled={!ind.active}
                  onClick={() => ind.active && setIndustry(ind.id as any)}
                  className={`w-full p-6 rounded-[32px] border-4 flex items-center gap-5 transition-all text-left relative overflow-hidden ${!ind.active ? 'opacity-40 grayscale pointer-events-none' : industry === ind.id ? 'bg-app-primary text-white border-app-primary shadow-xl scale-[1.02]' : 'bg-white border-slate-50 text-app-text'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${industry === ind.id && ind.active ? 'bg-white/20' : 'bg-slate-50 text-app-primary'}`}>
                    {ind.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                       <h4 className="font-black text-sm">{ind.label}</h4>
                       {!ind.active && <span className="bg-slate-200 text-slate-500 text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Coming Soon</span>}
                    </div>
                    <p className={`text-[10px] font-bold ${industry === ind.id && ind.active ? 'text-white/70' : 'text-slate-400'}`}>{ind.desc}</p>
                  </div>
                  {industry === ind.id && ind.active ? <CheckCircle2 size={20} /> : !ind.active ? <Lock size={16} className="text-slate-300" /> : null}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={() => step < 3 ? setStep(step + 1) : handleFinish()}
          disabled={isSubmitting || (step === 2 && !name.trim())}
          className="w-full py-6 bg-app-text text-white rounded-[32px] font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all mt-6 disabled:opacity-50"
        >
          {isSubmitting ? 'ĐANG KHỞI TẠO...' : step === 3 ? 'BẮT ĐẦU HÀNH TRÌNH' : 'TIẾP TỤC'}
          {!isSubmitting && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default OnboardingWizard;
