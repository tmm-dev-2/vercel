import { useState, useEffect, useCallback } from 'react';

import { Command } from 'cmdk';
import { SymbolRecommendation } from '../lib/websocket/types/recommendation-types';
import { RecommendationHandler } from '../lib/websocket/recommendation-handler';

interface SymbolSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSymbolSelect: (symbol: string) => void;
}

export const SymbolSearch = ({ isOpen, onClose, onSymbolSelect }: SymbolSearchProps) => {
  const [search, setSearch] = useState('');
  const [recommendations, setRecommendations] = useState<Record<string, SymbolRecommendation[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const recommendationHandler = RecommendationHandler.getInstance();

  const updateRecommendations = useCallback(async () => {
    if (!search) {
      const defaultResults = await recommendationHandler.getRecommendations('');
      setRecommendations(defaultResults);
      return;
    }

    setIsLoading(true);
    try {
      const results = await recommendationHandler.getRecommendations(search);
      setRecommendations(results);
    } catch (error) {
      console.error('Search failed:', error);
      setRecommendations({});
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      updateRecommendations();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [search, updateRecommendations]);

  useEffect(() => {
    if (isOpen) {
      updateRecommendations();
    }
  }, [isOpen, updateRecommendations]);

  if (!isOpen) return null;

  const hasResults = Object.keys(recommendations).length > 0;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[750px]">
        <Command className="w-full bg-[#131722] rounded-lg shadow-2xl overflow-hidden border border-[#2a2e39]">
          <div className="flex items-center p-3 border-b border-[#2a2e39] bg-[#1e222d]">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Command.Input 
              value={search}
              onValueChange={setSearch}
              className="w-full bg-transparent text-white outline-none text-lg placeholder-gray-400"
              placeholder="Search markets..."
              autoFocus
            />
          </div>

          {hasResults && (
            <div className="border-b border-[#2a2e39] bg-[#1e222d] p-2">
              <div className="flex space-x-2">
                <div 
                  className={`px-4 py-2 rounded cursor-pointer transition-colors ${
                    selectedCategory === 'All' ? 'bg-[#2962FF] text-white' : 'text-gray-400 hover:bg-[#2a2e39]'
                  }`}
                  onClick={() => setSelectedCategory('All')}
                >
                  All
                </div>
                {Object.keys(recommendations).map(category => (
                  <div
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded cursor-pointer transition-colors ${
                      selectedCategory === category ? 'bg-[#2962FF] text-white' : 'text-gray-400 hover:bg-[#2a2e39]'
                    }`}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-[600px] overflow-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">
                Searching...
              </div>
            ) : !hasResults ? (
              <div className="p-4 text-center text-gray-400">
                {search ? 'No results found' : 'Start typing to search...'}
              </div>
            ) : (
              Object.entries(recommendations)
                .filter(([category]) => selectedCategory === 'All' || category === selectedCategory)
                .map(([category, symbols]) => (
                  <div key={category} className="p-2">
                    <div className="text-xs text-[#787b86] uppercase font-semibold px-3 py-2">{category}</div>
                    {symbols.map(symbol => (
                      <div
                        key={symbol.symbol}
                        onClick={() => {
                          recommendationHandler.addRecentSymbol(symbol);
                          onSymbolSelect(symbol.symbol);
                          onClose();
                        }}
                        className="flex items-center justify-between px-4 py-2 hover:bg-[#2a2e39] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-[#2a2e39] rounded-full flex items-center justify-center text-xs text-white">
                            {symbol.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-white font-semibold">{symbol.symbol}</div>
                            <div className="text-sm text-[#787b86]">{symbol.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#787b86] px-2 py-1 rounded bg-[#2a2e39]">{symbol.type}</span>
                          <span className="text-sm text-[#787b86]">{symbol.exchange}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
            )}
          </div>
        </Command>
      </div>
    </div>
  );
};
