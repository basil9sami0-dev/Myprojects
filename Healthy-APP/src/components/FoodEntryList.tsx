import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface FoodEntry {
  _id: string;
  quantity: number;
  calories: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  food: {
    name: string;
    nameArabic: string;
    caloriesPer100g: number;
  } | null;
}

interface FoodEntryListProps {
  entries: FoodEntry[];
}

export function FoodEntryList({ entries }: FoodEntryListProps) {
  const deleteFoodEntry = useMutation(api.foodEntries.deleteFoodEntry);

  const mealTypeLabels = {
    breakfast: { label: "فطار", emoji: "🌅" },
    lunch: { label: "غداء", emoji: "☀️" },
    dinner: { label: "عشاء", emoji: "🌙" },
    snack: { label: "وجبة خفيفة", emoji: "🍎" },
  };

  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  const handleDelete = async (entryId: string) => {
    try {
      await deleteFoodEntry({ entryId: entryId as any });
      toast.success("تم حذف الطعام بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ في حذف الطعام");
    }
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="text-gray-500">
          <div className="text-4xl mb-2">🍽️</div>
          <p>لم تقم بإضافة أي طعام بعد</p>
          <p className="text-sm">ابحث عن الطعام وأضفه لتتبع سعراتك الحرارية</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(mealTypeLabels).map(([mealType, { label, emoji }]) => {
        const mealEntries = groupedEntries[mealType] || [];
        const mealCalories = mealEntries.reduce((sum, entry) => sum + entry.calories, 0);

        return (
          <div key={mealType} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {emoji} {label}
              </h3>
              <span className="text-sm text-gray-600">
                {mealCalories} سعرة حرارية
              </span>
            </div>

            {mealEntries.length === 0 ? (
              <p className="text-gray-500 text-sm">لا توجد أطعمة مضافة</p>
            ) : (
              <div className="space-y-2">
                {mealEntries.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{entry.food?.name}</div>
                      <div className="text-sm text-gray-600">
                        {entry.food?.nameArabic} • {entry.quantity}جم
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-blue-600">
                        {entry.calories} سعرة
                      </span>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
