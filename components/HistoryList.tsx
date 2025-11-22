import React from 'react';
import { LottoSet } from '../types';
import LottoBall from './LottoBall';

interface HistoryListProps {
  history: LottoSet[];
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-700">최근 추첨 내역</h3>
        <button 
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-red-500 underline transition-colors"
        >
          기록 삭제
        </button>
      </div>
      
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
              <span className={`px-2 py-0.5 rounded-md font-medium ${item.type === 'AI' ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                {item.type === 'AI' ? 'AI 추천' : '자동 생성'}
              </span>
              <span>{item.date}</span>
            </div>
            
            <div className="flex justify-between items-center gap-1 sm:gap-2">
              {item.numbers.map((num, idx) => (
                <LottoBall key={`${item.id}-${idx}`} number={num} size="sm" />
              ))}
            </div>

            {item.reason && (
              <div className="mt-2 pt-2 border-t border-gray-50 text-xs text-gray-600 italic bg-gray-50 p-2 rounded">
                " {item.reason} "
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;