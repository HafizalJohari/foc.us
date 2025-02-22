import { useStudyStore } from '@/lib/store';
import { calculateProgress } from '@/lib/utils';
import { useEffect, useMemo, memo } from 'react';
import { toast } from 'sonner';

const ProgressBarComponent = memo(function ProgressBar() {
  const { tasks } = useStudyStore();
  
  const { completedTasks, progress } = useMemo(() => {
    const completed = tasks.filter(task => task.completed).length;
    return {
      completedTasks: completed,
      progress: calculateProgress(completed, tasks.length)
    };
  }, [tasks]);

  useEffect(() => {
    if (progress === 100 && tasks.length > 0) {
      toast.success('Congratulations! You\'ve completed all tasks! 🎉');
    }
  }, [progress, tasks.length]);

  return (
    <div 
      className="w-full max-w-md p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
      role="region"
      aria-label="Study progress"
    >
      <div className="flex justify-between mb-2">
        <span 
          className="text-xs sm:text-sm font-semibold text-gray-700"
          id="progress-label"
        >
          Progress
        </span>
        <span 
          className="text-xs sm:text-sm font-semibold text-gray-700"
          aria-hidden="true"
        >
          {progress}%
        </span>
      </div>
      <div 
        className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-labelledby="progress-label"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div 
        className="mt-2 text-xs sm:text-sm text-gray-600"
        role="status"
        aria-live="polite"
      >
        {completedTasks} of {tasks.length} tasks completed
        {tasks.length > 0 && (
          <span className="sr-only">
            , {progress}% complete
          </span>
        )}
      </div>
    </div>
  );
});

export { ProgressBarComponent as ProgressBar }; 