import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { format } from "date-fns";
import { toast } from "sonner";

export function HabitQuickLog() {
  const habits = useQuery(api.habits.listHabits) || [];
  const toggleCompletion = useMutation(api.habits.toggleHabitCompletion);
  const today = format(new Date(), "yyyy-MM-dd");

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
    <div className="space-y-3">
      {habits.map((habit) => (
        <button
          key={habit._id}
          onClick={() => handleComplete(habit)}
          className="w-full text-left p-3 rounded-lg border border-gray-200/50 hover:bg-gray-50 transition-all hover:shadow-sm flex justify-between items-center"
        >
          <span className="font-medium">{habit.name}</span>
          <span className="text-[#1E90FF]">✓</span>
        </button>
      ))}
    </div>
  );
}
