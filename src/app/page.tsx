'use client';

import { Header } from '@/components/Header';
import { Timer } from '@/components/Timer';
import { TaskList } from '@/components/TaskList';
import { ProgressBar } from '@/components/ProgressBar';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Quote } from '@/components/Quote';
import { BackgroundGradientAnimation } from '@/components/BackgroundGradientAnimation';

export default function Home() {
  return (
    <>
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(108, 0, 162)"
        gradientBackgroundEnd="rgb(0, 17, 82)"
        firstColor="18, 113, 255"
        secondColor="221, 74, 255"
        thirdColor="100, 220, 255"
        fourthColor="200, 50, 50"
        fifthColor="180, 180, 50"
        pointerColor="140, 100, 255"
        size="80%"
        blendingValue="hard-light"
        containerClassName="fixed inset-0"
      />
      
      <div className="relative z-10 min-h-screen">
        <Header />
        
        <main>
          <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
            <Quote />
            <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
              <div className="space-y-4 sm:space-y-8 order-1 md:order-none">
                <Timer />
                <MusicPlayer />
              </div>
              
              <div className="space-y-4 sm:space-y-8 order-2 md:order-none">
                <TaskList />
                <ProgressBar />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
