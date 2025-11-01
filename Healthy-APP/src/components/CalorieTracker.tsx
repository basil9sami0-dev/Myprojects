import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FoodSearch } from "./FoodSearch";
import { DailyProgress } from "./DailyProgress";
import { FoodEntryList } from "./FoodEntryList";

export function CalorieTracker() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const todayEntries = useQuery(api.foodEntries.getTodayEntries, { date: selectedDate });
  const dailyStats = useQuery(api.foodEntries.getDailyStats, { date: selectedDate });
  const seedFoods = useMutation(api.foods.seedFoods);

  // Seed foods on first load
  useState(() => {
    seedFoods();
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return "اليوم";
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return "أمس";
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">📅 {formatDate(selectedDate)}</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Daily Progress */}
      <DailyProgress stats={dailyStats} />

      {/* Food Search */}
      <FoodSearch selectedDate={selectedDate} />

      {/* Food Entries */}
      <FoodEntryList entries={todayEntries || []} />
    </div>
  );
}
