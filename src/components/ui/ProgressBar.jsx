import { motion } from 'framer-motion';

export const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-700 text-base">
          سوال {current} از {total}
        </span>
        <span className="font-black text-indigo-600 text-lg">
          {Math.round(percentage)}٪
        </span>
      </div>

      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-y-0 right-0 bg-gradient-to-l from-indigo-500 to-purple-500 rounded-full"
        />
      </div>
    </div>
  );
};