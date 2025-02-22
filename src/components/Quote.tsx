import { useStudyStore } from '@/lib/store';
import { generateMotivationalQuote } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export function Quote() {
  const { currentQuote, setCurrentQuote } = useStudyStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleNewQuote = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const newQuote = await generateMotivationalQuote();
      setCurrentQuote(newQuote);
    } catch (error) {
      console.error('Error generating quote:', error);
      toast.error('Failed to generate a new quote');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setCurrentQuote]);

  // Load initial quote
  useEffect(() => {
    handleNewQuote();
  }, []);

  // Set up auto-refresh interval
  useEffect(() => {
        const intervalId = setInterval(handleNewQuote, 10000);
    return () => clearInterval(intervalId);
  }, [handleNewQuote]);

  if (!currentQuote && !isLoading) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="relative bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-lg">
        {isLoading && !currentQuote ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin h-6 w-6 text-white">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        ) : (
          <>
            <blockquote className="text-sm sm:text-base text-white italic pr-8">
              "{currentQuote?.text}"
            </blockquote>
            <cite className="block mt-1 sm:mt-2 text-xs sm:text-sm text-white/80">
              — {currentQuote?.author}
            </cite>
          </>
        )}
        <button
          onClick={() => handleNewQuote()}
          disabled={isLoading}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 text-white/60 hover:text-white transition-colors ${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}
          aria-label="Get new quote"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
} 