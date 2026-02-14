'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { searchAirports, getAirport, type Airport } from '@/data/airports';

interface AirportAutocompleteProps {
  /** The 3-letter IATA code (controlled value) */
  value: string;
  /** Called with the 3-letter IATA code when an airport is selected */
  onChange: (iata: string) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Additional className for the input */
  className?: string;
  /** Icon to render inside the input (left side) */
  icon?: React.ReactNode;
  /** Label for accessibility */
  label?: string;
  /** id attribute for the input */
  id?: string;
  /** name attribute for the input */
  name?: string;
}

export function AirportAutocomplete({
  value,
  onChange,
  placeholder = 'City or airport',
  required = false,
  className = '',
  icon,
  label,
  id,
  name,
}: AirportAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Resolve the display text from the IATA code
  const selectedAirport = value ? getAirport(value) : undefined;

  // When the value changes externally (e.g. swap), update the display
  useEffect(() => {
    if (!isFocused) {
      setQuery(value || '');
    }
  }, [value, isFocused]);

  // Search when query changes
  const handleInputChange = useCallback((text: string) => {
    setQuery(text);

    if (text.length === 0) {
      setResults([]);
      setIsOpen(false);
      // If the user clears the input, clear the value
      if (value) onChange('');
      return;
    }

    const matches = searchAirports(text, 8);
    setResults(matches);
    setIsOpen(matches.length > 0);
    setHighlightIndex(-1);
  }, [value, onChange]);

  // Select an airport
  const handleSelect = useCallback((airport: Airport) => {
    onChange(airport.iata);
    setQuery(airport.iata);
    setIsOpen(false);
    setResults([]);
    inputRef.current?.blur();
  }, [onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      // If user types exactly 3 uppercase letters and presses Enter/Tab, accept as IATA
      if ((e.key === 'Enter' || e.key === 'Tab') && query.length === 3) {
        const upper = query.toUpperCase();
        const airport = getAirport(upper);
        if (airport) {
          onChange(airport.iata);
          setQuery(airport.iata);
        } else {
          // Accept raw 3-letter code even if not in our list
          onChange(upper);
          setQuery(upper);
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < results.length) {
          handleSelect(results[highlightIndex]);
        } else if (results.length > 0) {
          handleSelect(results[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery(value || '');
        break;
      case 'Tab':
        if (highlightIndex >= 0 && highlightIndex < results.length) {
          handleSelect(results[highlightIndex]);
        } else if (results.length > 0) {
          handleSelect(results[0]);
        }
        break;
    }
  }, [isOpen, results, highlightIndex, handleSelect, query, value, onChange]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // Restore display to selected value
        if (value && !query) {
          setQuery(value);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, query]);

  const handleFocus = () => {
    setIsFocused(true);
    // Select all text on focus for easy replacement
    if (query) {
      setQuery('');
      const matches = searchAirports('', 0);
      setResults(matches);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Restore to IATA code if we have a selected value
    setTimeout(() => {
      if (value) {
        setQuery(value);
      }
    }, 200);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          aria-label={label}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
          className={`${className} ${icon ? 'pl-12!' : ''} ${value && !isFocused ? 'uppercase tracking-widest font-semibold text-lg' : ''}`}
        />
      </div>

      {/* Selected airport info hint */}
      {selectedAirport && !isFocused && !isOpen && (
        <div className="mt-1 text-xs text-text-muted truncate">
          {selectedAirport.name}, {selectedAirport.city}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-64 overflow-auto glass-card rounded-xl shadow-lg py-1"
        >
          {results.map((airport, i) => (
            <li
              key={airport.iata}
              role="option"
              aria-selected={i === highlightIndex}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent input blur
                handleSelect(airport);
              }}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                i === highlightIndex
                  ? 'bg-accent-blue/10 text-text-primary'
                  : 'text-text-secondary hover:bg-accent-blue/5'
              }`}
            >
              <span className="font-mono font-bold text-accent-blue text-sm w-10 shrink-0">
                {airport.iata}
              </span>
              <span className="flex-1 min-w-0 truncate text-sm">
                <span className="text-text-primary">{airport.city}</span>
                <span className="text-text-muted ml-1.5">
                  – {airport.name}
                </span>
              </span>
              <span className="text-xs text-text-muted shrink-0">
                {airport.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
