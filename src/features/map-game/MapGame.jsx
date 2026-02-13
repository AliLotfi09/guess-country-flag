import { useEffect, useState } from 'react';
import { ChevronRight, Trophy, Flame, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { searchCountries } from '../../data/countries';
import { useGameEngine } from '../../hooks/useGameEngine';
import { CountryMap } from '../CountryMap';

export function MapGame({ level, onBack }) {
  const game = useGameEngine();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    game.startGame(level);
  }, [level]);

  useEffect(() => {
    setSuggestions(query ? searchCountries(query) : []);
  }, [query]);

  const handleSelect = (country) => {
    game.submitAnswer(country.name);
    setQuery('');
    setSuggestions([]);
  };

  const handleNext = () => {
    if (game.isGameComplete) {
      game.resetGame();
      onBack();
    } else {
      game.nextQuestion();
      setQuery('');
    }
  };

  if (!game.gameStarted || !game.currentCountry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (game.isGameComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">بازی تمام شد! 🎉</h2>
            <p className="text-gray-500">نتایج شما</p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                امتیاز کل
              </span>
              <span className="text-2xl font-bold text-primary">{game.score}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                دقت
              </span>
              <span className="text-2xl font-bold">{game.accuracy}٪</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                پاسخ صحیح
              </span>
              <span className="text-2xl font-bold">{game.correctAnswers} از 10</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition"
          >
            بازگشت به منو
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">
              سوال {game.currentQuestion + 1} از 10
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">پیشرفت بازی</span>
            <span className="text-sm font-bold text-primary">
              {Math.round(((game.currentQuestion + 1) / 10) * 100)}٪
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((game.currentQuestion + 1) / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">امتیاز</span>
            </div>
            <div className="text-2xl font-bold">{game.score}</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">زنجیره</span>
            </div>
            <div className="text-2xl font-bold">{game.streak}</div>
          </div>
        </div>

        {/* Map */}
        <div className="mb-6">
          <CountryMap countryCode={game.currentCountry.code} />
          <div className="text-center mt-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm text-gray-700">
              💡 این کشور در قاره <span className="font-bold text-primary">{game.currentCountry.continent}</span> قرار دارد
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="نام کشور را تایپ کنید..."
            disabled={game.isAnswered}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition disabled:bg-gray-50 text-lg"
          />

          {suggestions.length > 0 && !game.isAnswered && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
              {suggestions.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-3 text-right hover:bg-gray-50 border-b last:border-b-0 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{country.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {country.continent}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {game.feedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full animate-in zoom-in duration-300">
            {game.feedback.type === 'correct' ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
                  <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">آفرین! 🎉</h3>
                <p className="text-gray-600 mb-4">پاسخ شما صحیح بود</p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-xl mb-6">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">+{game.feedback.points}</span>
                  <span className="text-sm text-gray-600">امتیاز</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
                  <XCircle className="w-12 h-12 text-red-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">متاسفانه!</h3>
                <p className="text-sm text-gray-500 mb-2">پاسخ صحیح:</p>
                <p className="text-2xl font-bold text-gray-900 mb-6">{game.feedback.correctAnswer}</p>
              </>
            )}
            
            <button
              onClick={handleNext}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              {game.isGameComplete ? 'مشاهده نتایج' : 'سوال بعدی'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}