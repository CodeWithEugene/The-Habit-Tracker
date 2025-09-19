import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { addDays, addWeeks, addMonths, parseISO, isBefore } from "date-fns";

export const createHabit = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    frequency: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
    category: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    reminderTime: v.optional(v.string()),
    isPublic: v.boolean(),
    reward: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("habits", { ...args, userId });
  },
});

export const listHabits = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getAllStreaks = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("streaks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getLastCompletion = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const lastCompletion = await ctx.db
      .query("streaks")
      .withIndex("by_habit_user", (q) => 
        q.eq("habitId", args.habitId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("completed"), true))
      .order("desc")
      .first();

    return lastCompletion;
  },
});

export const toggleHabitCompletion = mutation({
  args: { habitId: v.id("habits"), date: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error("Habit not found");

    // Get the last completion
    const lastCompletion = await ctx.db
      .query("streaks")
      .withIndex("by_habit_user", (q) => 
        q.eq("habitId", args.habitId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("completed"), true))
      .order("desc")
      .first();

    if (lastCompletion) {
      const lastDate = parseISO(lastCompletion.date);
      const currentDate = parseISO(args.date);
      
      let nextValidDate;
      switch (habit.frequency) {
        case "daily":
          nextValidDate = addDays(lastDate, 1);
          break;
        case "weekly":
          nextValidDate = addWeeks(lastDate, 1);
          break;
        case "monthly":
          nextValidDate = addMonths(lastDate, 1);
          break;
      }

      if (isBefore(currentDate, nextValidDate)) {
        throw new Error(`This ${habit.frequency} habit can't be completed again until ${nextValidDate.toLocaleDateString()}`);
      }
    }

    const existing = await ctx.db
      .query("streaks")
      .withIndex("by_habit_user", (q) => 
        q.eq("habitId", args.habitId).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("date"), args.date))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: !existing.completed,
      });
      return { completed: !existing.completed };
    } else {
      await ctx.db.insert("streaks", {
        habitId: args.habitId,
        userId,
        date: args.date,
        completed: true,
      });
      return { completed: true };
    }
  },
});
