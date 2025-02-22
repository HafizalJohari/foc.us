import { useEffect, useRef } from 'react';
import { useStudyStore } from '@/lib/store';
import { formatTime } from '@/lib/utils';
import { toast } from 'sonner';

export function Timer() {
  const { timer, startTimer, pauseTimer, resetTimer, updateTimeLeft, setTimerMode } = useStudyStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning && timer.timeLeft > 0) {
      interval = setInterval(() => {
        updateTimeLeft(timer.timeLeft - 1);
      }, 1000);
    } else if (timer.timeLeft === 0) {
      // Initialize audio only when needed
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/timer-end.mp3');
      }

      // Play sound and switch modes
      audioRef.current.play().catch(() => {
        // Fallback if audio fails to play
        console.warn('Audio playback failed');
      });

      const newMode = timer.mode === 'study' ? 'break' : 'study';
      setTimerMode(newMode);
      
      // Show notification
      toast.success(
        `Time's up! ${newMode === 'study' ? 'Back to studying!' : 'Take a break!'}`,
        {
          duration: 4000,
        }
      );
    }

    return () => {
      clearInterval(interval);
      // Clean up audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [timer.isRunning, timer.timeLeft, timer.mode, updateTimeLeft, setTimerMode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      timer.isRunning ? pauseTimer() : startTimer();
    }
  };

  return (
    <div 
      className="flex flex-col items-center space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
      role="timer"
      aria-label={`${timer.mode} timer - ${formatTime(timer.timeLeft)}`}
    >
      <div 
        className="text-4xl sm:text-6xl font-bold font-mono tabular-nums"
        aria-live="polite"
      >
        {formatTime(timer.timeLeft)}
      </div>
      <div 
        className="text-xl sm:text-2xl font-semibold text-gray-600 capitalize"
        aria-live="polite"
      >
        {timer.mode} Mode
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
        <button
          onClick={() => timer.isRunning ? pauseTimer() : startTimer()}
          onKeyDown={handleKeyDown}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
          aria-label={timer.isRunning ? 'Pause timer' : 'Start timer'}
        >
          {timer.isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm sm:text-base"
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>
    </div>
  );
} 