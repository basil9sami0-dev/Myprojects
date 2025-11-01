import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface FoodSearchProps {
  selectedDate: string;
}

export function FoodSearch({ selectedDate }: FoodSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("100");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");

  const searchResults = useQuery(api.foods.searchFoods, {
    searchTerm,
    category: selectedCategory || undefined,
  });

  const addFoodEntry = useMutation(api.foodEntries.addFoodEntry);

  const categories = [
    { value: "", label: "جميع الفئات" },
    { value: "grains", label: "حبوب ونشويات" },
    { value: "protein", label: "بروتين" },
    { value: "vegetables", label: "خضروات" },
    { value: "fruits", label: "فواكه" },
    { value: "dairy", label: "ألبان" },
    { value: "nuts", label: "مكسرات" },
    { value: "traditional", label: "أطعمة تقليدية" },
  ];

  const mealTypes = [
    { value: "breakfast", label: "فطار", emoji: "🌅" },
    { value: "lunch", label: "غداء", emoji: "☀️" },
    { value: "dinner", label: "عشاء", emoji: "🌙" },
    { value: "snack", label: "وجبة خفيفة", emoji: "🍎" },
  ];

  const handleAddFood = async (foodId: string) => {
    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error("يرجى إدخال كمية صحيحة");
      return;
    }

    try {
      await addFoodEntry({
        foodId: foodId as any,
        quantity: parseFloat(quantity),
        date: selectedDate,
        mealType,
      });
      toast.success("تم إضافة الطعام بنجاح!");
      setShowAddForm(null);
      setQuantity("100");
    } catch (error) {
      toast.error("حدث خطأ في إضافة الطعام");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">🔍 البحث عن الطعام</h3>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="ابحث عن الطعام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {searchResults?.map((food) => (
            <div key={food._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium">{food.name}</h4>
                  <p className="text-sm text-gray-600">{food.nameArabic}</p>
                  <p className="text-sm text-blue-600">{food.caloriesPer100g} سعرة/100جم</p>
                </div>
                <button
                  onClick={() => setShowAddForm(showAddForm === food._id ? null : food._id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  إضافة
                </button>
              </div>

              {showAddForm === food._id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">الكمية (جرام)</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">نوع الوجبة</label>
                      <select
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {mealTypes.map((meal) => (
                          <option key={meal.value} value={meal.value}>
                            {meal.emoji} {meal.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    السعرات المحسوبة: {Math.round((food.caloriesPer100g * parseFloat(quantity || "0")) / 100)} سعرة
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddFood(food._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      تأكيد الإضافة
                    </button>
                    <button
                      onClick={() => setShowAddForm(null)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors text-sm"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
