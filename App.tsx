import React, { useState, useEffect, useRef } from 'react';
import { generateRandomNumbers, formatDate, getNextDrawInfo, formatDrawDate } from './utils/lottoUtils';
import { generateAiNumbers } from './services/geminiService';
import { LottoSet } from './types';
import LottoBall from './components/LottoBall';
import GenerateButton from './components/GenerateButton';
import HistoryList from './components/HistoryList';

const App: React.FC = () => {
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<LottoSet[]>(() => {
    const saved = localStorage.getItem('lottoHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [aiWish, setAiWish] = useState('');
  const [activeTab, setActiveTab] = useState<'AUTO' | 'AI'>('AUTO');
  const [drawInfo, setDrawInfo] = useState<{date: Date, round: number} | null>(null);

  // Animation references
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('lottoHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    setDrawInfo(getNextDrawInfo());
  }, []);

  // Effect to clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const startRollingAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      const tempNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1);
      setCurrentNumbers(tempNumbers);
    }, 50);
  };

  const stopRollingAnimation = (finalNumbers: number[]) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentNumbers(finalNumbers);
  };

  const handleGenerateAuto = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    startRollingAnimation();

    // Simulate "thinking" time for suspense
    setTimeout(() => {
      const newNumbers = generateRandomNumbers();
      stopRollingAnimation(newNumbers);
      
      const newEntry: LottoSet = {
        id: Date.now().toString(),
        numbers: newNumbers,
        date: formatDate(new Date()),
        type: 'AUTO'
      };

      setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
      setIsGenerating(false);
    }, 800);
  };

  const handleGenerateAI = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    startRollingAnimation();

    try {
      const result = await generateAiNumbers(aiWish);
      stopRollingAnimation(result.numbers);

      const newEntry: LottoSet = {
        id: Date.now().toString(),
        numbers: result.numbers,
        date: formatDate(new Date()),
        type: 'AI',
        reason: result.reason
      };

      setHistory(prev => [newEntry, ...prev].slice(0, 50));
      setAiWish(''); // Clear input after generation
    } catch (e) {
      console.error(e);
      stopRollingAnimation(generateRandomNumbers()); // Fallback
    } finally {
      setIsGenerating(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('모든 기록을 삭제하시겠습니까?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-800">
      {/* Official Style Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md border-2 border-white">
              6/45
            </div>
            <div>
                <h1 className="text-lg font-extrabold tracking-tight text-gray-900 leading-none">나눔로또 AI</h1>
                <span className="text-[10px] text-blue-600 font-bold tracking-wide">OFFICIAL SIMULATOR</span>
            </div>
          </div>
          {drawInfo && (
             <div className="flex flex-col items-end">
               <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold mb-0.5">
                 다가오는 추첨
               </div>
               <div className="text-right">
                 <span className="text-sm font-bold text-gray-900 mr-1">제 {drawInfo.round}회</span>
                 <span className="text-xs text-gray-500 block">{formatDrawDate(drawInfo.date)}</span>
               </div>
             </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-lg mx-auto p-4 flex flex-col items-center">
        
        {/* Display Area */}
        <section className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-6 relative overflow-hidden">
           {/* Decorative background elements */}
           <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
           <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

           <div className="relative z-10 flex flex-col items-center">
             <div className="mb-6 flex flex-col items-center">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-500 mb-2 shadow-inner">
                    {drawInfo ? `제 ${drawInfo.round}회차 당첨 예상 번호` : '당첨 예상 번호'}
                </span>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                  {isGenerating ? '추첨 진행중...' : '행운을 잡으세요!'}
                </h2>
             </div>
             
             <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 min-h-[80px] items-center px-2">
               {currentNumbers.map((num, idx) => (
                 <LottoBall 
                   key={idx} 
                   number={num || 0} 
                   size="lg" 
                   animate={isGenerating}
                 />
               ))}
             </div>

             {!isGenerating && currentNumbers[0] === 0 && (
               <p className="text-gray-400 text-sm animate-pulse">아래 버튼을 눌러 번호를 생성하세요</p>
             )}
           </div>
        </section>

        {/* Tab Switching */}
        <div className="w-full bg-gray-200 p-1.5 rounded-xl flex mb-6 shadow-inner">
          <button 
            onClick={() => setActiveTab('AUTO')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'AUTO' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
          >
            일반 자동 생성
          </button>
          <button 
            onClick={() => setActiveTab('AI')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'AI' ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
          >
            AI 소원 생성
          </button>
        </div>

        {/* Controls */}
        <section className="w-full mb-8">
          {activeTab === 'AUTO' ? (
            <GenerateButton 
              onClick={handleGenerateAuto} 
              loading={isGenerating} 
              label="자동번호 생성하기"
              subLabel="순수한 무작위 확률로 추첨합니다"
              icon={<span>🎰</span>}
              variant="primary"
            />
          ) : (
            <div className="flex flex-col gap-3 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
               <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                 <span>🙏</span> 이루고 싶은 소원이 있나요?
               </label>
               <div className="relative">
                   <input 
                     type="text" 
                     value={aiWish}
                     onChange={(e) => setAiWish(e.target.value)}
                     placeholder="예: 이번 달 안에 새 차 뽑게 해주세요!"
                     className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-700 placeholder-gray-400 transition-all text-sm shadow-inner"
                   />
                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                       AI
                   </div>
               </div>
               <div className="mt-2">
                   <GenerateButton 
                    onClick={handleGenerateAI} 
                    loading={isGenerating} 
                    label="AI 행운번호 받기"
                    subLabel="제미나이가 당신의 소원을 분석합니다 ✨"
                    icon={<span>🔮</span>}
                    variant="secondary"
                  />
               </div>
            </div>
          )}
        </section>

        {/* History */}
        <HistoryList history={history} onClear={clearHistory} />

      </main>
      
      {/* Footer */}
      <footer className="p-8 text-center text-xs text-gray-400 border-t border-gray-200 bg-white w-full">
        <div className="max-w-lg mx-auto">
            <p className="font-medium mb-1">본 서비스는 동행복권의 공식 서비스가 아닙니다.</p>
            <p>재미를 위한 시뮬레이터이며, 실제 당첨을 보장하지 않습니다.</p>
            <p className="mt-4 text-[10px] opacity-70">Powered by Google Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};

export default App;