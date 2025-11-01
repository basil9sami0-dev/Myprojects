import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return profile;
  },
});

export const createOrUpdateProfile = mutation({
  args: {
    age: v.number(),
    weight: v.number(),
    height: v.number(),
    gender: v.union(v.literal("male"), v.literal("female")),
    activityLevel: v.union(
      v.literal("sedentary"),
      v.literal("light"),
      v.literal("moderate"),
      v.literal("active"),
      v.literal("very_active")
    ),
    goal: v.union(
      v.literal("lose_weight"),
      v.literal("maintain"),
      v.literal("gain_weight")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (args.gender === "male") {
      bmr = 10 * args.weight + 6.25 * args.height - 5 * args.age + 5;
    } else {
      bmr = 10 * args.weight + 6.25 * args.height - 5 * args.age - 161;
    }

    // Apply activity level multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    let dailyCalorieGoal = bmr * activityMultipliers[args.activityLevel];

    // Adjust based on goal
    if (args.goal === "lose_weight") {
      dailyCalorieGoal -= 500; // 500 calorie deficit for 1 lb/week loss
    } else if (args.goal === "gain_weight") {
      dailyCalorieGoal += 500; // 500 calorie surplus for 1 lb/week gain
    }

    dailyCalorieGoal = Math.round(dailyCalorieGoal);

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        ...args,
        dailyCalorieGoal,
      });
      return existingProfile._id;
    } else {
      return await ctx.db.insert("userProfiles", {
        userId,
        ...args,
        dailyCalorieGoal,
      });
    }
  },
});
