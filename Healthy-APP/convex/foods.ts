import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const searchFoods = query({
  args: { 
    searchTerm: v.string(),
    category: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return await ctx.db
        .query("foods")
        .filter((q) => args.category ? q.eq(q.field("category"), args.category) : true)
        .take(20);
    }

    return await ctx.db
      .query("foods")
      .withSearchIndex("search_foods", (q) => {
        let query = q.search("name", args.searchTerm);
        if (args.category) {
          query = query.eq("category", args.category);
        }
        return query;
      })
      .take(20);
  },
});

export const getFoodById = query({
  args: { foodId: v.id("foods") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.foodId);
  },
});

export const seedFoods = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if foods already exist
    const existingFoods = await ctx.db.query("foods").take(1);
    if (existingFoods.length > 0) {
      return "Foods already seeded";
    }

    const foods = [
      // Grains & Bread
      { name: "White Rice", nameArabic: "أرز أبيض", caloriesPer100g: 130, protein: 2.7, carbs: 28, fat: 0.3, category: "grains" },
      { name: "Brown Rice", nameArabic: "أرز بني", caloriesPer100g: 111, protein: 2.6, carbs: 23, fat: 0.9, category: "grains" },
      { name: "White Bread", nameArabic: "خبز أبيض", caloriesPer100g: 265, protein: 9, carbs: 49, fat: 3.2, category: "grains" },
      { name: "Whole Wheat Bread", nameArabic: "خبز القمح الكامل", caloriesPer100g: 247, protein: 13, carbs: 41, fat: 4.2, category: "grains" },
      
      // Proteins
      { name: "Chicken Breast", nameArabic: "صدر دجاج", caloriesPer100g: 165, protein: 31, carbs: 0, fat: 3.6, category: "protein" },
      { name: "Beef", nameArabic: "لحم بقر", caloriesPer100g: 250, protein: 26, carbs: 0, fat: 15, category: "protein" },
      { name: "Fish (Salmon)", nameArabic: "سمك السلمون", caloriesPer100g: 208, protein: 20, carbs: 0, fat: 13, category: "protein" },
      { name: "Eggs", nameArabic: "بيض", caloriesPer100g: 155, protein: 13, carbs: 1.1, fat: 11, category: "protein" },
      { name: "Lentils", nameArabic: "عدس", caloriesPer100g: 116, protein: 9, carbs: 20, fat: 0.4, category: "protein" },
      
      // Vegetables
      { name: "Tomatoes", nameArabic: "طماطم", caloriesPer100g: 18, protein: 0.9, carbs: 3.9, fat: 0.2, category: "vegetables" },
      { name: "Cucumber", nameArabic: "خيار", caloriesPer100g: 16, protein: 0.7, carbs: 4, fat: 0.1, category: "vegetables" },
      { name: "Lettuce", nameArabic: "خس", caloriesPer100g: 15, protein: 1.4, carbs: 2.9, fat: 0.2, category: "vegetables" },
      { name: "Onions", nameArabic: "بصل", caloriesPer100g: 40, protein: 1.1, carbs: 9.3, fat: 0.1, category: "vegetables" },
      { name: "Carrots", nameArabic: "جزر", caloriesPer100g: 41, protein: 0.9, carbs: 10, fat: 0.2, category: "vegetables" },
      
      // Fruits
      { name: "Apple", nameArabic: "تفاح", caloriesPer100g: 52, protein: 0.3, carbs: 14, fat: 0.2, category: "fruits" },
      { name: "Banana", nameArabic: "موز", caloriesPer100g: 89, protein: 1.1, carbs: 23, fat: 0.3, category: "fruits" },
      { name: "Orange", nameArabic: "برتقال", caloriesPer100g: 47, protein: 0.9, carbs: 12, fat: 0.1, category: "fruits" },
      { name: "Grapes", nameArabic: "عنب", caloriesPer100g: 62, protein: 0.6, carbs: 16, fat: 0.2, category: "fruits" },
      { name: "Dates", nameArabic: "تمر", caloriesPer100g: 277, protein: 1.8, carbs: 75, fat: 0.2, category: "fruits" },
      
      // Dairy
      { name: "Milk (Whole)", nameArabic: "حليب كامل الدسم", caloriesPer100g: 61, protein: 3.2, carbs: 4.8, fat: 3.3, category: "dairy" },
      { name: "Yogurt", nameArabic: "زبادي", caloriesPer100g: 59, protein: 10, carbs: 3.6, fat: 0.4, category: "dairy" },
      { name: "Cheese", nameArabic: "جبن", caloriesPer100g: 113, protein: 25, carbs: 4.1, fat: 0.3, category: "dairy" },
      
      // Nuts & Seeds
      { name: "Almonds", nameArabic: "لوز", caloriesPer100g: 579, protein: 21, carbs: 22, fat: 50, category: "nuts" },
      { name: "Walnuts", nameArabic: "جوز", caloriesPer100g: 654, protein: 15, carbs: 14, fat: 65, category: "nuts" },
      
      // Traditional Middle Eastern Foods
      { name: "Hummus", nameArabic: "حمص", caloriesPer100g: 166, protein: 8, carbs: 14, fat: 10, category: "traditional" },
      { name: "Falafel", nameArabic: "فلافل", caloriesPer100g: 333, protein: 13, carbs: 32, fat: 18, category: "traditional" },
      { name: "Tabbouleh", nameArabic: "تبولة", caloriesPer100g: 36, protein: 2, carbs: 6, fat: 0.6, category: "traditional" },
      { name: "Kabsa Rice", nameArabic: "أرز كبسة", caloriesPer100g: 180, protein: 4, carbs: 35, fat: 3, category: "traditional" },
    ];

    for (const food of foods) {
      await ctx.db.insert("foods", food);
    }

    return "Foods seeded successfully";
  },
});
