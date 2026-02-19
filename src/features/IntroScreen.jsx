// src/features/IntroScreen.jsx
import { Flag } from "lucide-react";
import ShinyText from "@components/ShinyText";
import GridMotion from "@components/GridMotion";
import "flag-icons/css/flag-icons.min.css";

const countryCodes = [
  "ir", "us", "de", "fr", "jp", "br", "ca", "it", "es", "gb",
  "cn", "ru", "tr", "az", "in", "kr", "sa", "ae", "ar", "mx",
  "nl", "se", "no", "ch", "au", "be", "dk", "fi", "gr", "ie",
  "pt", "pl", "cz", "hu", "ro", "bg", "ua", "by", "lt", "lv",
  "ee", "sk", "si", "hr", "ba", "rs", "me", "mk", "al", "is",
  "li", "lu", "mt", "cy", "jo", "kw", "om", "qa", "bh", "eg",
  "ma", "tn", "dz", "ly", "sd", "et", "ke", "tz", "ug", "ng",
  "gh", "ci", "sn", "ml", "bf", "ne", "sl", "lr", "gm", "zw",
  "zm", "na", "bw", "ao", "mz", "mg", "sc", "mu", "lk", "np",
  "bt", "mn", "kz", "uz", "tm", "kg", "tj", "af", "pk", "bd",
  "mm", "th", "vn", "kh", "la", "my", "sg", "id", "ph", "tl",
];

const items = countryCodes.map((code) => (
  <div
    key={code}
    className="overflow-hidden flex items-center justify-center rounded-xl w-24 rotate-90"
  >
    <img
      src={`https://cdn.jsdelivr.net/npm/country-flag-icons/3x2/${code.toUpperCase()}.svg`}
      alt={code}
      className=""
    />
  </div>
));

export function IntroScreen({ onStart, onProfile, user }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 flex items-center justify-center p-6">
      {/* GridMotion پس‌زمینه */}
      <div className="absolute inset-0 z-0">
        <GridMotion
          className="bg-gray-50 w-3"
          items={items}
          gradientColor="transparent"
          horizontal={true}
        />
      </div>

      {/* محتوا */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/90 border border-gray-200 rounded-3xl p-8 shadow-xl backdrop-blur-lg">

          {/* سلام به کاربر ایتا */}
          {user && (
            <div className="mb-6 px-4 py-3 bg-gray-900 rounded-2xl text-center animate-slideDown">
              <p className="text-white text-sm font-medium">
                سلام {user.first_name} 👋
                {user.username && (
                  <span className="text-gray-400 text-xs mr-1">@{user.username}</span>
                )}
              </p>
            </div>
          )}

          {/* عنوان */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Flag size={28} className="text-white" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <ShinyText
                text="دِرَفــش باز"
                speed={2}
                color="var(--primary)"
                shineColor="oklch(0.708 0 0)"
                spread={90}
                direction="left"
                yoyo
              />
            </h1>

            <p className="text-gray-500 text-sm">
              دانش جغرافیایی خود را بسنجید
            </p>
          </div>

          {/* اطلاعات */}
          <div className="space-y-3 mb-8 text-sm text-gray-600">
            {[
              "150 کشور در 3 سطح دشواری",
              "هر بازی 50 سوال از هر سطح",
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

          {/* دکمه شروع */}
          <button
            onClick={onStart}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold transition hover:bg-gray-800 active:scale-95"
          >
            شروع بازی
          </button>
        </div>

        {/* آمار */}
        <button
          onClick={onProfile}
          className="w-full border-gray-200 bg-gray-900/40 backdrop-blur-lg rounded-lg my-3 py-3 text-sm text-gray-200 hover:text-gray-300 transition font-medium"
        >
          مشاهده آمار و رکوردها
        </button>
      </div>
    </div>
  );
}
