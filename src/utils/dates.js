export function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isToday(dateStr) {
  return dateStr === getTodayStr();
}

export function calculateStreak(completions) {
  if (!completions || completions.length === 0) return 0;
  
  // Sort descending
  const sorted = [...completions].sort((a, b) => new Date(b) - new Date(a));
  
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checkDate = new Date(today);
  
  // Check if completed today first
  if (sorted[0] === getTodayStr()) {
     currentStreak++;
     checkDate.setDate(checkDate.getDate() - 1);
  } else if (sorted[0] !== getTodayStr()) {
     // If not completed today, maybe completed yesterday?
     const yesterday = new Date(today);
     yesterday.setDate(yesterday.getDate() - 1);
     const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
     
     if (sorted[0] !== yesterdayStr) {
         return 0; // Streak broken
     }
     checkDate.setDate(checkDate.getDate() - 1);
  }

  // Count backwards
  for (let i = currentStreak > 0 ? 1 : 0; i < sorted.length; i++) {
     const nextExpectedStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
     
     if (sorted[i] === nextExpectedStr) {
         currentStreak++;
         checkDate.setDate(checkDate.getDate() - 1);
     } else {
         break;
     }
  }
  
  return currentStreak;
}
