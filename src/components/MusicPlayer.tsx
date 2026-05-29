"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { motion } from "framer-motion";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // You can replace this with your actual music/video source
  const musicUrl = "/templates/1.mp3"; 

  useEffect(() => {
    const tryAutoplay = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.5;
          await audioRef.current.play();
          setIsPlaying(true);
          setHasInteracted(true);
        } catch (error) {
          console.log("Autoplay prevented by browser. Waiting for user interaction.");
          // Autoplay blocked, wait for user to click
        }
      }
    };

    tryAutoplay();

    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch(e => console.error("Error playing audio after interaction:", e));
      }
    };

    // Listen for any click on the document to start music if autoplay was blocked
    document.addEventListener("click", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setHasInteracted(true);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full shadow-2xl"
    >
      <audio ref={audioRef} src={musicUrl} loop />
      
      {!hasInteracted && !isPlaying && (
        <div className="absolute -top-12 right-0 bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm whitespace-nowrap animate-bounce flex items-center gap-2">
          <Play size={14} /> Click anywhere to play music
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-primary/90 rotate-45" />
        </div>
      )}

      <button
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 text-primary transition-colors"
      >
        {isPlaying ? (
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-current animate-[bounce_1s_infinite_0ms]" />
            <div className="w-1 h-4 bg-current animate-[bounce_1s_infinite_200ms]" />
            <div className="w-1 h-4 bg-current animate-[bounce_1s_infinite_400ms]" />
          </div>
        ) : (
          <Play size={18} className="ml-1" />
        )}
      </button>

      <div className="h-6 w-px bg-white/20 mx-1" />

      <button
        onClick={toggleMute}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-foreground transition-colors"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </motion.div>
  );
}
