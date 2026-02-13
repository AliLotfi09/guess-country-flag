import { ChevronRight, ChevronLeft } from 'lucide-react';

export function LevelSelect({ onSelectLevel, onBack }) {
  const levels = [
    { 
      id: 'easy', 
      title: 'آسان', 
      description: 'کشورهای معروف جهان',
      points: '+10'
    },
    { 
      id: 'medium', 
      title: 'متوسط', 
      description: 'چالش متعادل',
      points: '+20'
    },
    { 
      id: 'hard', 
      title: 'سخت', 
      description: 'برای حرفه‌ای‌ها',
      points: '+30'
    },
  ];

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
            <h2 className="text-lg font-semibold text-gray-900">انتخاب سطح</h2>
            <div className="w-16" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="space-y-3 animate-slideUp">
          {levels.map((level, index) => (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 hover:border-gray-900 active:bg-gray-50 transition-all group animate-slideUp"
            >
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {level.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {level.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                    {level.points}
                  </span>
                  <ChevronLeft 
                    className="w-5 h-5 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-[-2px] transition-all" 
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-5 bg-white border border-gray-200 rounded-2xl animate-slideUp" style={{ animationDelay: '150ms' }}>
          <h3 className="font-bold text-gray-900 mb-2">نحوه بازی</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            در هر بازی، تمام 50 کشور سطح انتخابی شما به صورت تصادفی نمایش داده می‌شود. 
            با پاسخ‌های متوالی صحیح، امتیاز بیشتری کسب کنید.
          </p>
        </div>
      </div>
    </div>
  );
}