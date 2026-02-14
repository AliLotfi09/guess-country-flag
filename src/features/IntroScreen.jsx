import { Flag } from "lucide-react";
import ShinyText from "@components/ShinyText";
import DotGrid from "@components/DotGrid"; // مسیر درست

export function IntroScreen({ onStart, onProfile }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* والد DotGrid با height مشخص */}
      <div className="absolute inset-0 w-full h-full">
        <DotGrid
          dotSize={2}
          gap={15}
          baseColor="#58447d"
    activeColor="#ffffff"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* محتوا کارت */}
      <div className="w-full max-w-md relative z-10 mx-auto">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-4 shadow-lg">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Flag size={28} strokeWidth={2} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <ShinyText
                text="پرچم یـــاب"
                speed={2}
                delay={0}
                color="var(--primary)"
                shineColor="oklch(0.708 0 0)"
                spread={90}
                direction="left"
                yoyo
                pauseOnHover={false}
                disabled={false}
              />
            </h1>
            <p className="text-gray-500">دانش جغرافیایی خود را بسنجید</p>
          </div>

          {/* Info */}
          <div className="space-y-3 mb-8 text-sm text-gray-600">
            {[
              "150 کشور در 3 سطح دشواری",
              "هر بازی 50 سوال از 50 کشور هر سطح",
              "پاسخ‌های متوالی صحیح امتیاز بیشتری دارند",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <p>{text}</p>
              </div>
            ))}
          </div>

          {/* Start Button */}
          <button
            onClick={onStart}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-transform active:scale-95"
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
