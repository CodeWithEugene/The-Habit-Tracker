import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

interface NewHabitFormProps {
  onSuccess?: () => void;
}

export function NewHabitForm({ onSuccess }: NewHabitFormProps) {
  const createHabit = useMutation(api.habits.createHabit);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [category, setCategory] = useState("health");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [reminderTime, setReminderTime] = useState("");
  const [reward, setReward] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await createHabit({
        name,
        description,
        frequency,
        category,
        difficulty,
        reminderTime,
        isPublic: false,
        reward,
      });
      setName("");
      setDescription("");
      setFrequency("daily");
      setCategory("health");
      setDifficulty("medium");
      setReminderTime("");
      setReward("");
      toast.success("Habit created!");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create habit");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as "daily" | "weekly" | "monthly")}
              className="input-field"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              <option value="health">Health</option>
              <option value="fitness">Fitness</option>
              <option value="learning">Learning</option>
              <option value="productivity">Productivity</option>
              <option value="mindfulness">Mindfulness</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
              className="input-field"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reminder Time</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Reward</label>
          <input
            type="text"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            className="input-field"
            placeholder="e.g., Watch a movie after 7 days streak"
          />
        </div>
        <button type="submit" className="btn-primary w-full mt-6">
          Create Habit
        </button>
      </div>
    </form>
  );
}
