import { useState, useCallback, useMemo } from 'react';
import { searchCountries } from '@data/countries';

/**
 * Hook for country search with autocomplete
 */
export const useCountrySearch = (onSelect) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const suggestions = useMemo(() => {
    if (!query) return [];
    return searchCountries(query);
  }, [query]);

  const handleChange = useCallback((value) => {
    setQuery(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(-1);
  }, []);

  const handleSelect = useCallback((country) => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect?.(country);
  }, [onSelect]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        break;

      default:
        break;
    }
  }, [isOpen, suggestions, selectedIndex, handleSelect]);

  const clearQuery = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  return {
    query,
    suggestions,
    isOpen,
    selectedIndex,
    handleChange,
    handleSelect,
    handleKeyDown,
    clearQuery,
  };
};