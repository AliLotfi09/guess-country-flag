import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

export const SearchInput = ({
  value,
  onChange,
  onKeyDown,
  suggestions = [],
  isOpen = false,
  selectedIndex = -1,
  onSelect,
  placeholder = 'جستجو...',
  disabled = false,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="
            w-full pr-14 pl-14 py-5 text-lg
            bg-gray-50 border-2 border-gray-200
            rounded-2xl
            focus:border-indigo-400 focus:bg-white focus:outline-none
            transition-all duration-200
            disabled:bg-gray-100 disabled:cursor-not-allowed
            placeholder:text-gray-400
          "
          autoComplete="off"
        />

        {value && !disabled && (
          <button
            onClick={() => onChange('')}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="
              absolute z-50 w-full mt-2
              bg-white border-2 border-gray-200 rounded-2xl
              overflow-hidden
            "
          >
            <ul className="search-dropdown">
              {suggestions.map((country, index) => (
                <motion.li
                  key={country.code}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <button
                    onClick={() => onSelect(country)}
                    className={`
                      w-full px-5 py-4 text-right
                      flex items-center justify-between gap-3
                      transition-colors duration-150
                      border-b border-gray-100 last:border-b-0
                      ${index === selectedIndex
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="font-semibold text-base">{country.name}</span>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      {country.continent}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};