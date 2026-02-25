// src/features/flag-game/GameCompleteScreen.jsx
import { Trophy, Star, Target, Flame, RotateCcw, Home } from 'lucide-react';

// ── تعریف سطح جغرافی بر اساس دقت و سطح بازی ──
const getGeographyLevel = (accuracy, level, correctAnswers, totalQuestions) => {
  const score = accuracy;

  const titles = {
    easy: [
      { min: 90, title: 'استاد جغرافیا', emoji: '🌍', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', desc: 'شناخت کشورهای معروف جهان رو کامل داری!' },
      { min: 70, title: 'جهانگرد حرفه‌ای', emoji: '✈️', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', desc: 'آدرسِ بیشتر دنیا رو بلدی!' },
      { min: 50, title: 'سیاح مبتدی', emoji: '🗺️', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', desc: 'پایه‌های جغرافیا رو داری، ادامه بده!' },
      { min: 0,  title: 'کاشف تازه‌کار', emoji: '🧭', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', desc: 'اول باید کمی بیشتر تمرین کنی.' },
    ],
    medium: [
      { min: 85, title: 'دیپلمات جهانی', emoji: '🌐', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', desc: 'دانش جغرافیایی‌ات فوق‌العاده‌ست!' },
      { min: 65, title: 'خبرنگار بین‌المللی', emoji: '📡', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', desc: 'جهان رو خوب می‌شناسی.' },
      { min: 40, title: 'جهانگرد معمولی', emoji: '🌏', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', desc: 'نصفه‌نصفه، ولی خوبه!' },
      { min: 0,  title: 'نقشه‌خوان مبتدی', emoji: '📍', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', desc: 'هنوز راه داری تا استاد بشی.' },
    ],
    hard: [
      { min: 80, title: 'افسانه جغرافیا', emoji: '👑', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', desc: 'نادر و عجیب! دانش جغرافیایی‌ات غیرعادیه.' },
      { min: 60, title: 'پژوهشگر جهانی', emoji: '🔭', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', desc: 'کشورهای کمتر شناخته‌شده رو هم بلدی.' },
      { min: 35, title: 'مجله‌خوان جغرافیا', emoji: '📚', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', desc: 'بد نیست، با این سختی!' },
      { min: 0,  title: 'کشف‌کننده شجاع', emoji: '⚔️', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', desc: 'سطح سختیه، تلاشت قابل احترامه.' },
    ],
  };

  const levelTitles = titles[level] || titles.easy;
  return levelTitles.find(t => score >= t.min) || levelTitles[levelTitles.length - 1];
};

const levelLabel = { easy: 'آسان', medium: 'متوسط', hard: 'سخت' };

const StarRating = ({ accuracy }) => {
  const stars = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : accuracy >= 30 ? 1 : 0;
  return (
    <div className="flex items-center justify-center gap-1 mb-2">
      {[1, 2, 3].map(i => (
        <Star
          key={i}
          className={`w-8 h-8 transition-all duration-300 ${i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

export function GameCompleteScreen({ level, score, accuracy, correctAnswers, totalQuestions, bestStreak, wrongAnswers, onBack }) {
  const geoLevel = getGeographyLevel(accuracy, level, correctAnswers, totalQuestions);

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900">نتیجه بازی</h2>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-4">

        {/* ── کارت سطح جغرافیایی ── */}
        <div className={`${geoLevel.bg} border-2 ${geoLevel.border} rounded-3xl p-8 text-center animate-slideUp`}>
          <div className="text-6xl mb-3">{geoLevel.emoji}</div>
          <StarRating accuracy={accuracy} />
          <h3 className={`text-2xl font-black ${geoLevel.color} mb-1`}>{geoLevel.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{geoLevel.desc}</p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-white/70 rounded-full">
            <span className="text-xs text-gray-500">سطح بازی:</span>
            <span className="text-xs font-bold text-gray-800">{levelLabel[level]}</span>
          </div>
        </div>

        {/* ── آمار ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-slideUp" style={{ animationDelay: '80ms' }}>
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Trophy} iconBg="bg-yellow-100" iconColor="text-yellow-600" label="امتیاز کل" value={score.toLocaleString()} />
            <StatCard icon={Target} iconBg="bg-blue-100" iconColor="text-blue-600" label="دقت" value={`${accuracy}%`} />
            <StatCard icon={Flame} iconBg="bg-orange-100" iconColor="text-orange-600" label="بهترین زنجیره" value={bestStreak} />
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex gap-2">
                <div className="flex-1 text-center p-2 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-xl font-black text-green-600">{correctAnswers}</div>
                  <div className="text-xs text-gray-500 mt-0.5">صحیح</div>
                </div>
                <div className="flex-1 text-center p-2 bg-red-50 rounded-lg border border-red-100">
                  <div className="text-xl font-black text-red-600">{wrongAnswers}</div>
                  <div className="text-xs text-gray-500 mt-0.5">غلط</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── دکمه‌ها ── */}
        <div className="space-y-3 animate-slideUp" style={{ animationDelay: '160ms' }}>
          <button
            onClick={onBack}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors active:scale-98 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" strokeWidth={2} />
            بازگشت به منو
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, label, value }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={2} />
        </div>
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-black text-gray-900">{value}</div>
    </div>
  );
}