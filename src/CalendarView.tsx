import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const habits = useQuery(api.habits.listHabits) || [];
  const toggleCompletion = useMutation(api.habits.toggleHabitCompletion);

  const start = startOfMonth(selectedDate);
  const end = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start, end });

  const handleComplete = async (habit: any) => {
    try {
      const result = await toggleCompletion({
        habitId: habit._id,
        date: format(selectedDate, "yyyy-MM-dd"),
      });
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-6 accent-text">
            {format(selectedDate, "MMMM yyyy")}
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-medium text-gray-600 p-2"
              >
                {day}
              </div>
            ))}
            {days.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-2 text-center rounded-lg transition-colors
                  ${
                    format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                      ? "bg-[#1E90FF] text-white font-medium"
                      : "hover:bg-[#1E90FF]/5"
                  }`}
              >
                {format(day, "d")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6 accent-text">
          {format(selectedDate, "MMMM d, yyyy")}
        </h2>
        <div className="space-y-4">
          {habits.map((habit) => (
            <div
              key={habit._id}
              className="p-4 border border-gray-200/50 rounded-lg hover:bg-gray-50 transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{habit.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{habit.frequency}</p>
                </div>
                <button
                  onClick={() => handleComplete(habit)}
                  className="btn-primary text-sm"
                >
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
