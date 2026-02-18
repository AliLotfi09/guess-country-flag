// src/features/flag-game/FlagGame.jsx
import { useEffect, useState } from 'react';
import { ChevronRight, Trophy, Flame, CheckCircle, XCircle, Lightbulb, Coins } from 'lucide-react';
import { searchCountries } from '@data/countries';
import { useGameEngine } from '@hooks/useGameEngine';

export function FlagGame({
  level,
  onBack,
  onGameComplete,
  coins,
  onEarnCoins,
  onSpendCoins,
  onSaveProgress,
  savedProgress,
  miniApp, // ← ایتا SDK
}) {
  const game = useGameEngine(
    (lvl, score, correctAns, total, streak) => {
      onGameComplete(lvl, score, correctAns, total, streak);
    },
    onSaveProgress,
    onEarnCoins
  );

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showHintMenu, setShowHintMenu] = useState(false);
  const [activeHints, setActiveHints] = useState({});

  useEffect(() => {
    if (savedProgress) {
      game.resumeGame(savedProgress);
    } else {
      game.startGame(level);
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setSuggestions(searchCountries(query));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // هپتیک هنگام انتخاب پیشنهاد
  const handleSelect = (country) => {
    miniApp?.hapticSelection?.();
    game.submitAnswer(country.name);
    setQuery('');
    setSuggestions([]);
  };

  const handleNext = () => {
    miniApp?.hapticImpact?.('light');
    if (game.isGameComplete) {
      game.resetGame();
      onBack();
    } else {
      game.nextQuestion();
      setQuery('');
      setActiveHints({});
    }
  };

  const handleUseHint = (type, cost) => {
    if (coins < cost) {
      miniApp?.hapticNotification?.('error');
      alert('سکه کافی ندارید! 💰');
      return;
    }
    if (activeHints[type]) {
      alert('شما قبلاً از این راهنما استفاده کرده‌اید!');
      return;
    }
    const success = onSpendCoins(cost);
    if (success) {
      miniApp?.hapticImpact?.('medium');
      const hint = game.useHint(type);
      if (hint) {
        setActiveHints(prev => ({ ...prev, [type]: hint }));
        setShowHintMenu(false);
      }
    }
  };

  if (!game.gameStarted || !game.currentCountry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (game.isGameComplete) {
    return (
      <div className="min-h-screen bg-gray-50 animate-fadeIn">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center">
              <h2 className="text-lg font-semibold text-gray-900">نتیجه بازی</h2>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-gray-900" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">بازی تمام شد!</h3>
              <p className="text-gray-500">
                سطح {level === 'easy' ? 'آسان' : level === 'medium' ? 'متوسط' : 'سخت'}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">امتیاز کل</span>
                <span className="text-2xl font-bold text-gray-900">{game.score}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">دقت</span>
                <span className="text-2xl font-bold text-gray-900">{game.accuracy}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-600 font-medium">بهترین زنجیره</span>
                <span className="text-2xl font-bold text-gray-900">{game.bestStreak}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{game.correctAnswers}</div>
                  <div className="text-xs text-gray-600">صحیح</div>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">{game.wrongAnswers}</div>
                  <div className="text-xs text-gray-600">غلط</div>
                </div>
              </div>
            </div>

            <button
              onClick={onBack}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors active:scale-98"
            >
              بازگشت به منو
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-900 font-medium active:opacity-60 transition"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              خروج
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full">
                <Coins className="w-4 h-4 text-yellow-600" strokeWidth={2} />
                <span className="text-sm font-bold text-yellow-700">
                  {coins === 0 ? 'صفر' : coins}
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <span className="text-sm font-bold text-gray-900">
                  {game.currentQuestion + 1}/{game.totalQuestions}
                </span>
              </div>
            </div>
          </div>

          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 transition-all duration-500 ease-out"
              style={{ width: `${((game.currentQuestion + 1) / game.totalQuestions) * 100}%` }}
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
            <div className="text-2xl font-bold text-gray-900">{game.streak}</div>
          </div>
        </div>

        {/* راهنماهای فعال */}
        {(activeHints['first-letter'] || activeHints['continent']) && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 animate-slideDown">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-blue-900 mb-2">راهنماها:</h4>
                <div className="space-y-1 text-sm">
                  {activeHints['first-letter'] && (
                    <p className="text-blue-700">• حرف اول: <span className="font-bold">{activeHints['first-letter']}</span></p>
                  )}
                  {activeHints['continent'] && (
                    <p className="text-blue-700">• قاره: <span className="font-bold">{activeHints['continent']}</span></p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* کارت پرچم */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-6">
          <div className="aspect-[3/2] bg-gray-50 rounded-2xl flex items-center justify-center mb-6 overflow-hidden border border-gray-100">
            <span
              className={`fi fi-${game.currentCountry.code} fis`}
              style={{ fontSize: '140px' }}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              این پرچم متعلق به کدام کشور است؟
            </p>
          </div>
        </div>

        {/* دکمه راهنما */}
        {!game.isAnswered && (
          <div className="mb-4">
            <button
              onClick={() => {
                miniApp?.hapticImpact?.('light');
                setShowHintMenu(!showHintMenu);
              }}
              className="w-full py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-900 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Lightbulb className="w-5 h-5" strokeWidth={2} />
              دریافت راهنما
            </button>

            {showHintMenu && (
              <div className="mt-3 bg-white border border-gray-200 rounded-2xl p-3 space-y-2 animate-slideDown">
                <button
                  onClick={() => handleUseHint('first-letter', 10)}
                  disabled={!!activeHints['first-letter']}
                  className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-right disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900">نمایش حرف اول</span>
                    <span className="text-sm font-bold text-yellow-600 flex items-center gap-1">
                      <Coins className="w-4 h-4" strokeWidth={2} /> 10
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">حرف اول نام کشور را نشان می‌دهد</p>
                </button>

                <button
                  onClick={() => handleUseHint('continent', 15)}
                  disabled={!!activeHints['continent']}
                  className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-right disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900">نمایش قاره</span>
                    <span className="text-sm font-bold text-yellow-600 flex items-center gap-1">
                      <Coins className="w-4 h-4" strokeWidth={2} /> 15
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">قاره‌ای که کشور در آن قرار دارد</p>
                </button>
              </div>
            )}
          </div>
        )}

        {/* جستجو */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="نام کشور را بنویسید..."
            disabled={game.isAnswered}
            autoFocus
            className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-base font-medium"
          />

          {suggestions.length > 0 && !game.isAnswered && (
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-xl animate-slideDown">
              {suggestions.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelect(country)}
                  className="w-full px-5 py-4 text-right hover:bg-gray-50 border-b last:border-b-0 border-gray-100 transition-colors active:bg-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{country.name}</span>
                    <span className="text-xs text-gray-400">{country.continent}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* مودال بازخورد */}
      {game.feedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full animate-slideUp">
            {game.feedback.type === 'correct' ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">آفرین! 🎉</h3>
                <p className="text-gray-600 mb-4">پاسخ شما صحیح است</p>

                <div className="space-y-2 mb-6">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                    <Trophy className="w-5 h-5 text-yellow-600" strokeWidth={2} />
                    <span className="text-2xl font-bold text-yellow-600">+{game.feedback.points}</span>
                  </div>

                  {game.feedback.coins > 0 && (
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl animate-pulse">
                      <Coins className="w-5 h-5 text-orange-600" strokeWidth={2} />
                      <span className="text-2xl font-bold text-orange-600">+{game.feedback.coins}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-12 h-12 text-red-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">نادرست</h3>
                <p className="text-sm text-gray-500 mb-2">پاسخ صحیح:</p>
                <p className="text-2xl font-bold text-gray-900 mb-6">{game.feedback.correctAnswer}</p>
              </>
            )}

            <button
              onClick={handleNext}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors active:scale-98"
            >
              {game.currentQuestion + 1 >= game.totalQuestions ? 'مشاهده نتایج' : 'سوال بعدی'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
