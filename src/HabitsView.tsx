import { useState } from "react";
import { NewHabitForm } from "./NewHabitForm";
import { HabitList } from "./HabitList";
import { Dialog } from "@headlessui/react";

export function HabitsView() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200/50">
        <div className="flex-1 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field !mt-0 !py-1"
            >
              <option value="all">All Categories</option>
              <option value="health">Health</option>
              <option value="fitness">Fitness</option>
              <option value="learning">Learning</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field !mt-0 !py-1"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed Today</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Difficulty:</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="input-field !mt-0 !py-1"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => setIsFormVisible(true)}
          className="btn-primary flex items-center gap-2"
        >
          <span className="text-xl leading-none">+</span>
          <span>New Habit</span>
        </button>
      </div>

      <Dialog
        open={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold accent-text">Create New Habit</h2>
                <button
                  onClick={() => setIsFormVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <NewHabitForm onSuccess={() => setIsFormVisible(false)} />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <HabitList
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        difficultyFilter={difficultyFilter}
      />
    </div>
  );
}
