import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { format, parseISO, differenceInDays } from "date-fns";
import { HabitQuickLog } from "./HabitQuickLog";

export function Dashboard() {
  const habits = useQuery(api.habits.listHabits) || [];
  const allStreaks = useQuery(api.habits.getAllStreaks) || [];
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Create a map of habit ID to its streaks
  const streaksMap: Record<string, any[]> = {};
  allStreaks.forEach(streak => {
    if (!streaksMap[streak.habitId]) {
      streaksMap[streak.habitId] = [];
    }
    streaksMap[streak.habitId].push(streak);
  });

  // Calculate completion rate
  const completedCount = habits.filter(habit => 
    streaksMap[habit._id]?.some(s => s.date === today && s.completed)
  ).length;
  
  const completionRate = habits.length > 0 
    ? (completedCount / habits.length * 100).toFixed(0) 
    : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6 accent-text">Today's Progress</h2>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600 mb-1">Completion Rate</p>
            <p className="text-3xl font-bold text-[#1E90FF]">
              {completionRate}%
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Habits Completed</p>
            <p className="text-3xl font-bold text-[#A259FF]">
              {completedCount} / {habits.length}
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#1E90FF] to-[#A259FF] h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6 accent-text">Quick Log</h2>
        <HabitQuickLog />
      </div>

      <div className="card p-6 md:col-span-2">
        <h2 className="text-2xl font-bold mb-6 accent-text">Current Streaks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {habits.map((habit) => {
            const streaks = streaksMap[habit._id] || [];
            const sortedStreaks = [...streaks]
              .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
              .filter(s => s.completed);
            
            let currentStreak = 0;
            if (sortedStreaks.length > 0) {
              const lastCompletionDate = parseISO(sortedStreaks[0].date);
              const daysSinceLastCompletion = differenceInDays(new Date(), lastCompletionDate);
              
              const frequencyDays = {
                daily: 1,
                weekly: 7,
                monthly: 30
              }[habit.frequency];
              
              if (daysSinceLastCompletion <= frequencyDays) {
                currentStreak = 1;
                let prevDate = lastCompletionDate;
                
                for (let i = 1; i < sortedStreaks.length; i++) {
                  const currentDate = parseISO(sortedStreaks[i].date);
                  const daysBetween = differenceInDays(prevDate, currentDate);
                  
                  if (daysBetween <= frequencyDays) {
                    currentStreak++;
                    prevDate = currentDate;
                  } else {
                    break;
                  }
                }
              }
            }
            
            return (
              <div
                key={habit._id}
                className="p-4 rounded-lg bg-gradient-to-r from-[#1E90FF]/5 to-[#A259FF]/5 border border-gray-200/50"
              >
                <h3 className="font-semibold text-lg">{habit.name}</h3>
                <p className="text-3xl font-bold text-[#1E90FF] mt-2">
                  {currentStreak} {habit.frequency === "daily" ? "days" : habit.frequency === "weekly" ? "weeks" : "months"}
                </p>
                <p className="text-sm text-gray-600 mt-1">{habit.frequency}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
