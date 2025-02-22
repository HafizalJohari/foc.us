import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MusicTrack, Quote, Task, TimerMode } from '@/types';

interface StudyStore {
  // Timer state
  timer: {
    mode: TimerMode;
    timeLeft: number;
    isRunning: boolean;
    studyDuration: number;
    breakDuration: number;
  };
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateTimeLeft: (time: number) => void;
  setTimerMode: (mode: TimerMode) => void;

  // Tasks state
  tasks: Task[];
  addTask: (description: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Music state
  currentTrack: MusicTrack | null;
  setCurrentTrack: (track: MusicTrack | null) => void;
  togglePlayback: () => void;

  // Quote state
  currentQuote: Quote | null;
  setCurrentQuote: (quote: Quote) => void;
}

export const useStudyStore = create<StudyStore>()(
  persist(
    (set) => ({
      // Timer initial state
      timer: {
        mode: 'study',
        timeLeft: 25 * 60, // 25 minutes in seconds
        isRunning: false,
        studyDuration: 25 * 60,
        breakDuration: 5 * 60,
      },
      startTimer: () =>
        set((state) => ({
          timer: { ...state.timer, isRunning: true },
        })),
      pauseTimer: () =>
        set((state) => ({
          timer: { ...state.timer, isRunning: false },
        })),
      resetTimer: () =>
        set((state) => ({
          timer: {
            ...state.timer,
            timeLeft:
              state.timer.mode === 'study'
                ? state.timer.studyDuration
                : state.timer.breakDuration,
            isRunning: false,
          },
        })),
      updateTimeLeft: (time) =>
        set((state) => ({
          timer: { ...state.timer, timeLeft: time },
        })),
      setTimerMode: (mode) =>
        set((state) => ({
          timer: {
            ...state.timer,
            mode,
            timeLeft:
              mode === 'study'
                ? state.timer.studyDuration
                : state.timer.breakDuration,
            isRunning: false,
          },
        })),

      // Tasks initial state
      tasks: [],
      addTask: async (description) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              description,
              completed: false,
              createdAt: new Date(),
            },
          ],
        })),
      toggleTask: async (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      deleteTask: async (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      // Music initial state
      currentTrack: null,
      setCurrentTrack: (track) => set({ currentTrack: track }),
      togglePlayback: () =>
        set((state) => ({
          currentTrack: state.currentTrack
            ? { ...state.currentTrack, isPlaying: !state.currentTrack.isPlaying }
            : null,
        })),

      // Quote initial state
      currentQuote: null,
      setCurrentQuote: (quote) => set({ currentQuote: quote }),
    }),
    {
      name: 'study-store',
      partialize: (state) => ({
        tasks: state.tasks,
        timer: {
          ...state.timer,
          isRunning: false,
        },
      }),
    }
  )
); 