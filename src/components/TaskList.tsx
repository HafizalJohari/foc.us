import { useState } from 'react';
import { useStudyStore } from '@/lib/store';
import { toast } from 'sonner';

export function TaskList() {
  const { tasks, addTask, toggleTask, deleteTask } = useStudyStore();
  const [newTask, setNewTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTask = newTask.trim();

    if (!trimmedTask) {
      toast.error('Please enter a task description');
      return;
    }

    // Check for duplicate task
    if (tasks.some(task => task.description.toLowerCase() === trimmedTask.toLowerCase())) {
      toast.error('This task already exists');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTask(trimmedTask);
      setNewTask('');
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task. Please try again.');
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask(taskId);
    } catch (error) {
      toast.error('Failed to update task. Please try again.');
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string, description: string) => {
    try {
      await deleteTask(taskId);
      toast.success(`Task "${description}" deleted successfully!`);
    } catch (error) {
      toast.error('Failed to delete task. Please try again.');
      console.error('Error deleting task:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div 
      className="w-full max-w-md p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
      role="region"
      aria-label="Study tasks"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Study Tasks</h2>
      
      <form onSubmit={handleSubmit} className="mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
            aria-label="New task description"
            disabled={isSubmitting}
            maxLength={100}
          />
          <button
            type="submit"
            className={`w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base ${
              isSubmitting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700'
            }`}
            aria-label="Add task"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>

      <div 
        className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1"
        role="list"
        aria-label="Task list"
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50/80 backdrop-blur-sm rounded-lg group"
            role="listitem"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
              onKeyDown={(e) => handleKeyDown(e, () => handleToggleTask(task.id))}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              aria-label={`Mark "${task.description}" as ${task.completed ? 'incomplete' : 'complete'}`}
            />
            <span 
              className={`flex-1 text-sm sm:text-base ${task.completed ? 'line-through text-gray-500' : ''}`}
              aria-hidden="true"
            >
              {task.description}
            </span>
            <button
              onClick={() => handleDeleteTask(task.id, task.description)}
              onKeyDown={(e) => handleKeyDown(e, () => handleDeleteTask(task.id, task.description))}
              className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity focus:ring-2 focus:ring-red-500 rounded"
              aria-label={`Delete task: ${task.description}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <p 
          className="text-center text-gray-500 mt-4 text-sm sm:text-base"
          role="status"
        >
          No tasks yet. Add some tasks to get started!
        </p>
      )}
    </div>
  );
} 