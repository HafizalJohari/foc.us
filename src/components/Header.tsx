import { useEffect, useState } from 'react';
import { useStudyStore } from '@/lib/store';
import { generateMotivationalQuote } from '@/lib/utils';
import { toast } from 'sonner';

export function Header() {
  const { currentQuote, setCurrentQuote } = useStudyStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentQuote) {
      handleNewQuote();
    }
  }, [currentQuote]);

  const handleNewQuote = async () => {
    setIsLoading(true);
    try {
      const newQuote = await generateMotivationalQuote();
      setCurrentQuote(newQuote);
    } catch (error) {
      toast.error('Failed to generate a new quote');
      console.error('Error generating quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="w-full bg-white/10 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Study Focus
        </h1>
      </div>
    </header>
  );
} 