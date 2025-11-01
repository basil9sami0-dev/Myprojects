interface DailyProgressProps {
  stats: {
    totalCalories: number;
    dailyGoal: number;
    remaining: number;
    percentageConsumed: number;
  } | null | undefined;
}

export function DailyProgress({ stats }: DailyProgressProps) {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const progressColor = stats.percentageConsumed > 100 ? 'bg-red-500' : 'bg-green-500';
  const progressWidth = Math.min(stats.percentageConsumed, 100);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">📊 تقدمك اليومي</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalCalories}</div>
          <div className="text-sm text-gray-600">مستهلك</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.dailyGoal}</div>
          <div className="text-sm text-gray-600">الهدف</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${stats.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(stats.remaining)}
          </div>
          <div className="text-sm text-gray-600">
            {stats.remaining >= 0 ? 'متبقي' : 'زائد'}
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className={`h-4 rounded-full transition-all duration-300 ${progressColor}`}
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
      
      <div className="text-center text-sm text-gray-600">
        {stats.percentageConsumed}% من هدفك اليومي
      </div>
    </div>
  );
}
