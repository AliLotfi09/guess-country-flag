import { Flag } from "lucide-react"


export function IntroScreen({ onStart, onProfile }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fadeIn">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-4">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl">
                <Flag size={28} strokeWidth={2} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">پرچم‌یاب</h1>
            <p className="text-gray-500">دانش جغرافیایی خود را بسنجید</p>
          </div>

          {/* Info */}
          <div className="space-y-3 mb-8 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <p>150 کشور در 3 سطح دشواری</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <p>هر بازی 50 سوال از 50 کشور هر سطح</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <p>پاسخ‌های متوالی صحیح امتیاز بیشتری دارند</p>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={onStart}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all active:scale-98"
          >
            شروع بازی
          </button>
        </div>

        {/* Profile Link */}
        <button
          onClick={onProfile}
          className="w-full py-3 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          مشاهده آمار و رکوردها
        </button>
      </div>
    </div>
  );
}