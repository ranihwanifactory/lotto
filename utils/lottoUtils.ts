import { BallColor } from '../types';

export const getBallColor = (num: number): string => {
  if (num <= 10) return 'bg-yellow-400 border-yellow-500 text-black'; // 1-10
  if (num <= 20) return 'bg-blue-500 border-blue-600 text-white';   // 11-20
  if (num <= 30) return 'bg-red-500 border-red-600 text-white';    // 21-30
  if (num <= 40) return 'bg-slate-500 border-slate-600 text-white';   // 31-40
  return 'bg-green-500 border-green-600 text-white';               // 41-45
};

export const generateRandomNumbers = (): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < 6) {
    const num = Math.floor(Math.random() * 45) + 1;
    numbers.add(num);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

export const formatDrawDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    }).format(date);
};

export const getNextDrawInfo = () => {
    // Official Round 1: 2002-12-07 (Saturday)
    // Use a fixed time to avoid Timezone issues, essentially treating it as KST noon
    const START_DATE = new Date('2002-12-07T12:00:00+09:00'); 
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0); // Normalize time
    
    // Calculate next Saturday
    const dayOfWeek = today.getDay(); // 0(Sun) ... 6(Sat)
    let daysUntilSat = (6 - dayOfWeek + 7) % 7;
    
    // If today is Saturday, check if it's past 8:00 PM (20:00). 
    // If so, the draw is next week. If not, it's today.
    if (dayOfWeek === 6) {
        if (now.getHours() >= 20) {
            daysUntilSat = 7;
        } else {
            daysUntilSat = 0;
        }
    }
    
    // Special handling for Sunday (Sales usually for next Sat)
    if (dayOfWeek === 0) {
        daysUntilSat = 6;
    }

    const nextDrawDate = new Date(today);
    nextDrawDate.setDate(today.getDate() + daysUntilSat);

    // Calculate round number
    // Diff in milliseconds
    const diffTime = nextDrawDate.getTime() - START_DATE.getTime();
    // Diff in days, rounded to nearest integer to handle DST/Leap seconds roughly
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    // Round 1 is at diffDays 0. Round 2 is diffDays 7.
    const round = Math.floor(diffDays / 7) + 1;

    return {
        date: nextDrawDate,
        round: round
    };
};