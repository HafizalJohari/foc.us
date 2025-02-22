import { useRef, useEffect } from 'react';
import { useStudyStore } from '@/lib/store';
import { STUDY_SOUNDS } from '@/lib/utils';
import { toast } from 'sonner';

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentTrack, setCurrentTrack, togglePlayback } = useStudyStore();

  useEffect(() => {
    if (audioRef.current) {
      if (currentTrack?.isPlaying) {
        audioRef.current.play().catch(() => {
          toast.error('Failed to play audio. Please try again.');
          setCurrentTrack({ ...currentTrack, isPlaying: false });
        });
      } else {
        audioRef.current.pause();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [currentTrack, setCurrentTrack]);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (currentTrack.isPlaying) {
        audioRef.current.play().catch(() => {
          toast.error('Failed to play audio. Please try again.');
          setCurrentTrack({ ...currentTrack, isPlaying: false });
        });
      }
    }
  }, [currentTrack?.id, setCurrentTrack]);

  const handleTrackSelect = (track: typeof STUDY_SOUNDS[0]) => {
    if (currentTrack?.id === track.id) {
      togglePlayback();
      toast.success(currentTrack.isPlaying ? 'Sound paused' : 'Sound playing');
    } else {
      setCurrentTrack({ ...track, isPlaying: true });
      toast.success(`Now playing: ${track.name}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, track: typeof STUDY_SOUNDS[0]) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTrackSelect(track);
    }
  };

  return (
    <div 
      className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
      role="region"
      aria-label="Study sounds player"
    >
      <h2 className="text-xl font-bold mb-4">Study Sounds</h2>
      
      <audio
        ref={audioRef}
        loop
        preload="none"
        onError={() => {
          toast.error('Error loading audio file');
          setCurrentTrack(null);
        }}
        onEnded={() => setCurrentTrack(null)}
        aria-hidden="true"
      />

      <div 
        className="grid grid-cols-2 gap-2"
        role="group"
        aria-label="Available study sounds"
      >
        {STUDY_SOUNDS.map((track) => (
          <button
            key={track.id}
            onClick={() => handleTrackSelect(track)}
            onKeyDown={(e) => handleKeyDown(e, track)}
            className={`
              p-4 rounded-lg text-left transition-colors focus:ring-2 focus:ring-offset-2
              ${currentTrack?.id === track.id
                ? 'bg-blue-100 text-blue-700 focus:ring-blue-500'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-400'
              }
            `}
            aria-pressed={currentTrack?.id === track.id}
            aria-label={`${track.name} - ${
              currentTrack?.id === track.id
                ? (currentTrack.isPlaying ? 'Currently playing' : 'Paused')
                : 'Click to play'
            }`}
          >
            <div className="font-medium">{track.name}</div>
            <div className="text-sm opacity-75">
              {currentTrack?.id === track.id
                ? (currentTrack.isPlaying ? 'Playing' : 'Paused')
                : 'Click to play'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 