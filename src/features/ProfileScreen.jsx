import { ChevronRight, Trophy, Target, TrendingUp, Award, Play } from 'lucide-react';

export function ProfileScreen({ stats, onBack, onReset, onStartGame }) {
  const totalAccuracy = stats.totalGames > 0 
    ? Math.round((stats.totalScore / (stats.totalGames * 1500)) * 100) // 50 سوال × 30 امتیاز
    : 0;

  // Empty State
  if (stats.totalGames === 0) {
    return (
      <div className="min-h-screen bg-gray-50 animate-fadeIn">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-900 font-medium active:opacity-60 transition"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                بازگشت
              </button>
              <h2 className="text-lg font-semibold text-gray-900">آمار و رکوردها</h2>
              <div className="w-16" />
            </div>
          </div>
        </div>

        {/* Empty State Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
          <div className="w-full max-w-md text-center">
            <div className="bg-white border border-gray-200 rounded-3xl p-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-gray-400" strokeWidth={2} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                هنوز بازی نکرده‌اید
              </h3>
              
              <p className="text-gray-500 mb-8 leading-relaxed">
                اولین بازی خود را شروع کنید تا آمار و رکوردهای شما اینجا نمایش داده شود
              </p>
              
              <button
                onClick={onStartGame}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" strokeWidth={2} />
                شروع اولین بازی
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // With Stats
  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-900 font-medium active:opacity-60 transition"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              بازگشت
            </button>
            <h2 className="text-lg font-semibold text-gray-900">آمار و رکوردها</h2>
            <div className="w-16" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        {/* Overall Stats */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900">آمار کلی</h3>
            <div className="px-3 py-1 bg-gray-100 rounded-full">
              <span className="text-xs font-semibold text-gray-600">
                کل: {stats.totalGames} بازی
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-600" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-gray-500">مجموع امتیاز</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                {stats.totalScore.toLocaleString()}
              </div>
            </div>
            
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-gray-500">میانگین دقت</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                {totalAccuracy}%
              </div>
            </div>
            
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-gray-500">تعداد بازی</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                {stats.totalGames}
              </div>
            </div>
            
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-orange-600" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-gray-500">بهترین زنجیره</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                {stats.longestStreak}
              </div>
            </div>
          </div>
        </div>

        {/* Best Scores by Level */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-4">رکوردها</h3>
          
          <div className="space-y-3">
            {[
              { level: 'easy', label: 'آسان', color: 'emerald' },
              { level: 'medium', label: 'متوسط', color: 'amber' },
              { level: 'hard', label: 'سخت', color: 'red' },
            ].map(item => (
              <div key={item.level} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 bg-${item.color}-500 rounded-full`} />
                    <span className="font-bold text-gray-900">{item.label}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {stats.gamesPerLevel[item.level]} بازی انجام شده
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-gray-900">
                    {stats.bestScores[item.level]}
                  </div>
                  <div className="text-xs text-gray-500">
                    دقت {stats.bestAccuracy[item.level]}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            if (confirm('آیا مطمئن هستید که می‌خواهید تمام آمار را پاک کنید؟')) {
              onReset();
            }
          }}
          className="w-full py-3 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          پاک کردن همه آمار
        </button>
      </div>
    </div>
  );
}