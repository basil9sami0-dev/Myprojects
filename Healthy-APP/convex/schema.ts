import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id("users"),
    age: v.number(),
    weight: v.number(), // in kg
    height: v.number(), // in cm
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
    dailyCalorieGoal: v.number(),
  }).index("by_user", ["userId"]),

  foods: defineTable({
    name: v.string(),
    nameArabic: v.string(),
    caloriesPer100g: v.number(),
    protein: v.number(), // grams per 100g
    carbs: v.number(), // grams per 100g
    fat: v.number(), // grams per 100g
    category: v.string(),
  }).searchIndex("search_foods", {
    searchField: "name",
    filterFields: ["category"],
  }),

  foodEntries: defineTable({
    userId: v.id("users"),
    foodId: v.id("foods"),
    quantity: v.number(), // in grams
    calories: v.number(),
    date: v.string(), // YYYY-MM-DD format
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snack")
    ),
  }).index("by_user_and_date", ["userId", "date"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
