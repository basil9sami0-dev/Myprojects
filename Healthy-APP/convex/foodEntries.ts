import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getTodayEntries = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const entries = await ctx.db
      .query("foodEntries")
      .withIndex("by_user_and_date", (q) => 
        q.eq("userId", userId).eq("date", args.date)
      )
      .collect();

    // Get food details for each entry
    const entriesWithFood = await Promise.all(
      entries.map(async (entry) => {
        const food = await ctx.db.get(entry.foodId);
        return { ...entry, food };
      })
    );

    return entriesWithFood;
  },
});

export const addFoodEntry = mutation({
  args: {
    foodId: v.id("foods"),
    quantity: v.number(),
    date: v.string(),
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snack")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const food = await ctx.db.get(args.foodId);
    if (!food) throw new Error("Food not found");

    // Calculate calories based on quantity
    const calories = Math.round((food.caloriesPer100g * args.quantity) / 100);

    return await ctx.db.insert("foodEntries", {
      userId,
      foodId: args.foodId,
      quantity: args.quantity,
      calories,
      date: args.date,
      mealType: args.mealType,
    });
  },
});

export const deleteFoodEntry = mutation({
  args: { entryId: v.id("foodEntries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== userId) {
      throw new Error("Entry not found or unauthorized");
    }

    await ctx.db.delete(args.entryId);
  },
});

export const getDailyStats = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const entries = await ctx.db
      .query("foodEntries")
      .withIndex("by_user_and_date", (q) => 
        q.eq("userId", userId).eq("date", args.date)
      )
      .collect();

    const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

    // Get user's daily calorie goal
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const dailyGoal = profile?.dailyCalorieGoal || 2000;
    const remaining = dailyGoal - totalCalories;

    return {
      totalCalories,
      dailyGoal,
      remaining,
      percentageConsumed: Math.round((totalCalories / dailyGoal) * 100),
    };
  },
});
