import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { HabitIcon } from "./components/HabitIcon";
import { ProgressRing } from "./components/ProgressRing";

interface HabitListProps {
  categoryFilter: string;
  statusFilter: string;
  difficultyFilter: string;
}

export function HabitList({
  categoryFilter,
  statusFilter,
  difficultyFilter,
}: HabitListProps) {
  const habits = useQuery(api.habits.listHabits) || [];
  const allStreaks = useQuery(api.habits.getAllStreaks) || [];
  const toggleCompletion = useMutation(api.habits.toggleHabitCompletion);
  const today = format(new Date(), "yyyy-MM-dd");

  // Create a map of habit ID to its streaks
  const streaksMap: Record<string, any[]> = {};
  allStreaks.forEach(streak => {
    if (!streaksMap[streak.habitId]) {
      streaksMap[streak.habitId] = [];
    }
    streaksMap[streak.habitId].push(streak);
  });

  const filteredHabits = habits.filter((habit) => {
    if (categoryFilter !== "all" && habit.category !== categoryFilter) {
      return false;
    }
    if (difficultyFilter !== "all" && habit.difficulty !== difficultyFilter) {
      return false;
    }

    const habitStreaks = streaksMap[habit._id] || [];
    const completedToday = habitStreaks.some(s => s.date === today && s.completed);

    if (statusFilter === "completed" && !completedToday) {
      return false;
    }
    if (statusFilter === "pending" && completedToday) {
      return false;
    }

    return true;
  });

  const handleComplete = async (habit: any) => {
    try {
      const result = await toggleCompletion({ habitId: habit._id, date: today });
      if (result.completed) {
        toast.success(`Completed ${habit.name}!`, {
          description: `Keep up the great work with your ${habit.frequency} habit!`,
        });
      }
    } catch (error: any) {
      toast.error("Couldn't complete habit", {
        description: error.message,
      });
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold accent-text">Your Habits</h2>
        <ProgressRing 
          progress={
            habits.length > 0
              ? (filteredHabits.filter(h => 
                  streaksMap[h._id]?.some(s => s.date === today && s.completed)
                ).length / habits.length) * 100
              : 0
          }
          size={48}
          strokeWidth={4}
        />
      </div>
      <div className="space-y-4">
        {filteredHabits.map((habit) => {
          const habitStreaks = streaksMap[habit._id] || [];
          const completedToday = habitStreaks.some(s => s.date === today && s.completed);
          const currentStreak = habitStreaks
            .filter(s => s.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .length;

          return (
            <div
              key={habit._id}
              className="group border-2 border-gray-200/50 rounded-xl p-4 hover:bg-gray-50 
                transition-all duration-300 hover:border-[#1E90FF]/20 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`habit-checkbox ${completedToday ? 'checked' : 'unchecked'}`}
                      onClick={() => handleComplete(habit)}
                      role="button"
                      tabIndex={0}
                    >
                      {completedToday && (
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <HabitIcon category={habit.category as any} />
                        <h3 className="text-lg font-semibold group-hover:text-[#1E90FF] transition-colors">
                          {habit.name}
                        </h3>
                      </div>
                      {habit.description && (
                        <p className="text-gray-600 mt-1">{habit.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 ml-10">
                    <span className="badge badge-blue">
                      {habit.frequency}
                    </span>
                    <span className="badge badge-purple">
                      {habit.category}
                    </span>
                    <span className="badge badge-gray">
                      {habit.difficulty}
                    </span>
                    {currentStreak > 0 && (
                      <span className="badge badge-blue flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        {currentStreak} {habit.frequency}
                      </span>
                    )}
                  </div>
                </div>
                {!completedToday && (
                  <button
                    onClick={() => handleComplete(habit)}
                    className="btn-primary whitespace-nowrap ml-4 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filteredHabits.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <path d="M12 18c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0-10c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z"/>
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No habits match your filters</p>
            <p className="text-gray-400 mt-1">Try adjusting your filters to see more habits</p>
          </div>
        )}
      </div>
    </div>
  );
}
