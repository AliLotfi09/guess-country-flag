export function ResumeGameDialog({ onResume, onNewGame, progress }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          بازی ناتمام
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          شما یک بازی ناتمام دارید. می‌خواهید ادامه دهید؟
        </p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">سطح</span>
            <span className="text-sm font-bold text-gray-900">
              {progress.currentLevel === 'easy' ? 'آسان' : 
               progress.currentLevel === 'medium' ? 'متوسط' : 'سخت'}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">پیشرفت</span>
            <span className="text-sm font-bold text-gray-900">
              {progress.currentQuestion + 1}/50
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">امتیاز</span>
            <span className="text-sm font-bold text-gray-900">{progress.score}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors active:scale-98"
          >
            ادامه بازی
          </button>
          <button
            onClick={onNewGame}
            className="w-full py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl font-bold hover:border-gray-900 transition-colors active:scale-98"
          >
            شروع بازی جدید
          </button>
        </div>
      </div>
    </div>
  );
}