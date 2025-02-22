import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export async function generateMotivationalQuote(): Promise<{ text: string; author: string }> {
  try {
    const response = await fetch('/api/quote');
    if (!response.ok) throw new Error('Failed to fetch quote');
    return response.json();
  } catch (error) {
    console.error('Error fetching quote:', error);
    return {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    };
  }
}

export const STUDY_SOUNDS = [
  {
    id: 'white-noise',
    name: 'White Noise',
    url: '/sounds/white-noise.mp3'
  },
  {
    id: 'rain',
    name: 'Rain Sounds',
    url: '/sounds/rain.mp3'
  },
  {
    id: 'cafe',
    name: 'Cafe Ambience',
    url: '/sounds/cafe.mp3'
  }
]; 