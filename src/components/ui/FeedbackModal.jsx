import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export const FeedbackModal = ({ feedback, onComplete }) => {
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(onComplete, 2200);
      return () => clearTimeout(timer);
    }
  }, [feedback, onComplete]);

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            ${feedback.type === 'correct' 
              ? 'bg-emerald-50 bg-opacity-90' 
              : 'bg-red-50 bg-opacity-90'
            }
          `}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`
              px-16 py-12 rounded-3xl border-4
              ${feedback.type === 'correct'
                ? 'bg-white border-emerald-300'
                : 'bg-white border-red-300'
              }
            `}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                {feedback.type === 'correct' ? (
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-200">
                    <CheckCircle2 className="w-14 h-14 text-emerald-600" strokeWidth={2.5} />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center border-4 border-red-200">
                    <XCircle className="w-14 h-14 text-red-600" strokeWidth={2.5} />
                  </div>
                )}
              </motion.div>

              <h3 className={`text-5xl font-black mb-4 ${
                feedback.type === 'correct' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {feedback.type === 'correct' ? 'آفرین!' : 'اشتباه!'}
              </h3>

              {feedback.type === 'correct' ? (
                <p className="text-2xl font-bold text-gray-700">
                  <span className="text-indigo-600">+{feedback.points}</span> امتیاز
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg text-gray-600">پاسخ صحیح:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {feedback.correctAnswer}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};