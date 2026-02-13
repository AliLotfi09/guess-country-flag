import { useEffect, useState } from "react";
import {
  ChevronRight,
  Trophy,
  Flame,
  CheckCircle,
  XCircle,
  Flag,
} from "lucide-react";
import { searchCountries } from "../../data/countries";
import { useGameEngine } from "../../hooks/useGameEngine";

export function FlagGame({ level, onBack }) {
  const game = useGameEngine();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    game.startGame(level);
  }, [level]);

  useEffect(() => {
    setSuggestions(query ? searchCountries(query) : []);
  }, [query]);

  const handleSelect = (country) => {
    game.submitAnswer(country.name);
    setQuery("");
    setSuggestions([]);
  };

  const handleNext = () => {
    if (game.isGameComplete) {
      game.resetGame();
      onBack();
    } else {
      game.nextQuestion();
      setQuery("");
    }
  };

  const getLevelInfo = () => {
    const levels = {
      easy: { label: "آسان", color: "emerald" },
      medium: { label: "متوسط", color: "amber" },
      hard: { label: "سخت", color: "red" },
    };
    return levels[level] || levels.easy;
  };

  const levelInfo = getLevelInfo();

  if (!game.gameStarted || !game.currentCountry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (game.isGameComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center">
              <h2 className="text-lg font-semibold text-gray-900">
                نتیجه بازی
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-8">
            {/* Icon */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-primary" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                بازی تمام شد
              </h3>
              <p className="text-gray-500">سطح {levelInfo.label}</p>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-medium">امتیاز کل</span>
                <span className="text-2xl font-bold text-gray-900">
                  {game.score}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-medium">دقت</span>
                <span className="text-2xl font-bold text-gray-900">
                  {game.accuracy}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">
                    {game.correctAnswers}
                  </div>
                  <div className="text-xs text-gray-600">صحیح</div>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {10 - game.correctAnswers}
                  </div>
                  <div className="text-xs text-gray-600">غلط</div>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={onBack}
              className="w-full py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors active:scale-98"
            >
              بازگشت به منو
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-primary font-medium active:opacity-60 transition"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              خروج
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-900 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-gray-600">
                سوال {game.currentQuestion + 1} از {game.totalQuestions}
              </span>
            </div>
          </div>

          {/* Progress Bar */}

          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 transition-all duration-500 ease-out"
              style={{
                width: `${((game.currentQuestion + 1) / game.totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-yellow-600" strokeWidth={2} />
              </div>
              <span className="text-xs font-medium text-gray-500">امتیاز</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{game.score}</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-600" strokeWidth={2} />
              </div>
              <span className="text-xs font-medium text-gray-500">زنجیره</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {game.streak}
            </div>
          </div>
        </div>

        {/* Flag Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-6">
          <div className="aspect-[3/2] bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
            <div className="text-9xl">{game.currentCountry.flag}</div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              این پرچم متعلق به کدام کشور است؟
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی کشور..."
            disabled={game.isAnswered}
            autoFocus
            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-base"
          />

          {suggestions.length > 0 && !game.isAnswered && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              {suggestions.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelect(country)}
                  className="w-full px-5 py-4 text-right hover:bg-gray-50 border-b last:border-b-0 border-gray-100 transition-colors active:bg-gray-100"
                >
                  <span className="font-medium text-gray-900">
                    {country.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {game.feedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-6">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
            {game.feedback.type === "correct" ? (
              <>
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle
                    className="w-12 h-12 text-emerald-600"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">درست!</h3>
                <p className="text-gray-600 mb-4">پاسخ شما صحیح است</p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-50 border border-yellow-100 rounded-xl mb-6">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="text-2xl font-bold text-yellow-600">
                    +{game.feedback.points}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle
                    className="w-12 h-12 text-red-600"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  نادرست
                </h3>
                <p className="text-sm text-gray-500 mb-2">پاسخ صحیح:</p>
                <p className="text-2xl font-bold text-gray-900 mb-6">
                  {game.feedback.correctAnswer}
                </p>
              </>
            )}

            <button
              onClick={handleNext}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors active:scale-98"
            >
              {game.isGameComplete ? "مشاهده نتایج" : "سوال بعدی"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
