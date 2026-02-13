import { motion } from 'framer-motion';
import * as FlagIcons from 'country-flag-icons/react/3x2';

export const CountryFlagDisplay = ({ countryCode }) => {
  const FlagComponent = FlagIcons[countryCode];

  return (
    <motion.div
      key={countryCode}
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 200, 
        damping: 15 
      }}
      className="flex justify-center"
    >
      <div className="
        w-full max-w-md h-64
        bg-white rounded-3xl shadow-2xl
        border-4 border-gray-100
        overflow-hidden
        flex items-center justify-center
        relative
      ">
        {FlagComponent ? (
          <FlagComponent className="w-full h-full object-cover" />
        ) : (
          <div className="text-8xl">🏳️</div>
        )}
      </div>
    </motion.div>
  );
};