"use client";

import { motion } from "framer-motion";

export function Hero() {
  const handleStartCreating = () => {
    window.open("https://www.effectivecpmnetwork.com/dxbgqi4y9j?key=67b52e134bd348e97801f436bbf6031a", "_blank");
    document.getElementById("templates-section")?.scrollIntoView({ behavior: "smooth" });
  };


  const videoSrc = "/templates/Video 1.mp4";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full glass text-xs font-semibold uppercase tracking-widest text-[var(--color-vesak-gold)] mb-6 animate-pulse">
            ✨ Spread Light, Peace & Joy This Vesak ✨
          </span>
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight tracking-tight">
            Create Your Personalized <br />
            <span className="text-gradient drop-shadow-xl">Vesak Cards</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
            Upload your photo, write heartfelt blessings, and instantly download or share beautiful Vesak greetings with your loved ones.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartCreating}
            className="px-8 py-4 mb-14 rounded-full bg-gradient-to-r from-[var(--color-vesak-gold)] via-[var(--color-vesak-orange)] to-[var(--color-vesak-lotus)] text-white font-bold text-lg shadow-[0_0_30px_rgba(255,140,0,0.4)] hover:shadow-[0_0_40px_rgba(255,140,0,0.7)] transition-all cursor-pointer"
          >
            Start Creating Card
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative mx-auto max-w-2xl rounded-2xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.5)] border border-[var(--color-vesak-gold)]/30 aspect-video bg-black/10 dark:bg-white/5 flex items-center justify-center z-20"
          >
            <video
              className="w-full h-full object-cover"
              src={videoSrc}
              controls
              autoPlay
              muted
              loop
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>
      </div>

      {/* Beautiful floating spiritual lanterns */}
      <motion.div
        className="absolute bottom-20 left-[5%] w-20 h-28 md:w-28 md:h-36 bg-gradient-to-b from-[var(--color-vesak-orange)] to-[var(--color-vesak-gold)] rounded-xl opacity-60 blur-[1px] hidden sm:block"
        style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)" }}
        animate={{ y: [0, -25, 0], rotate: [0, 4, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-[5%] w-16 h-22 md:w-20 md:h-28 bg-gradient-to-b from-[var(--color-vesak-lotus)] to-[var(--color-vesak-orange)] rounded-xl opacity-50 blur-[1px] hidden sm:block"
        style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)" }}
        animate={{ y: [0, -35, 0], rotate: [0, -8, 8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-40 right-[15%] w-12 h-16 bg-gradient-to-b from-[var(--color-vesak-blue)] to-[var(--color-vesak-gold)] rounded-xl opacity-40 blur-[2px] hidden md:block"
        style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)" }}
        animate={{ y: [0, -20, 0], rotate: [0, 6, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </section>
  );
}

