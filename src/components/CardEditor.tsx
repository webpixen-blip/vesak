"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Draggable from "react-draggable";
import { useDropzone } from "react-dropzone";
import * as htmlToImage from "html-to-image";
import { Upload, Download, Share2, X, ZoomIn, ZoomOut } from "lucide-react";
import type { Template } from "./TemplateSelection";

const VESAK_GREETINGS = [
  "Wishing you a serene Wesak Day filled with peace, love, and spiritual awakening.",
  "May the light of Lord Buddha guide you toward wisdom and compassion. Happy Wesak Day!",
  "On this sacred occasion, may you find true happiness and inner calm in your life.",
  "May Wesak bring harmony to your home and peace to your heart.",
  "Let us celebrate the birth, enlightenment, and passing of Lord Buddha with kindness and gratitude.",
  "Wishing you a blessed Wesak filled with good thoughts, good words, and good deeds.",
  "May the teachings of the Buddha inspire you to walk the path of peace and righteousness.",
  "On this holy Wesak Day, may your life be filled with positivity and spiritual strength.",
  "Let the spirit of Wesak bring hope, forgiveness, and compassion to everyone.",
  "Wishing you and your family a joyful Wesak filled with blessings and enlightenment.",
];

interface Props {
  template: Template;
  onClose: () => void;
}

export function CardEditor({ template, onClose }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<string | null>(null);
  
  // Text Editor State
  const [greetingText, setGreetingText] = useState(VESAK_GREETINGS[1]);
  const [greetingColor, setGreetingColor] = useState("#FFFFFF");
  const [greetingSize, setGreetingSize] = useState(18);
  const [greetingWidth, setGreetingWidth] = useState(260);
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [templateBase64, setTemplateBase64] = useState<string>("");

  useEffect(() => {
    fetch(template.image)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTemplateBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
  }, [template.image]);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const textDragRef = useRef<HTMLDivElement>(null);
  const toDragRef = useRef<HTMLDivElement>(null);
  const fromDragRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleGenerate = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      try {
        await htmlToImage.toPng(cardRef.current, { cacheBust: true, skipFonts: true });
      } catch (e) {}
      
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      
      setGeneratedCard(dataUrl);
    } catch (error) {
      console.error("Error generating card", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareToWhatsApp = async () => {
    if (!generatedCard) return;

    const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vesakcardmaker.com';
    try {
      if (navigator.share) {
        const response = await fetch(generatedCard);
        const blob = await response.blob();
        const file = new File([blob], "Vesak_Greeting_Card.png", { type: "image/png" });

        const shareData = {
          title: "Happy Vesak Day!",
          text: `Make your personalized Vesak greeting card here: ${currentUrl}`,
          files: [file],
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return; 
        }
      }

      const text = encodeURIComponent(`Happy Vesak Day! ✨\nMake yours here: ${currentUrl}`);
      window.open(`https://wa.me/?text=${text}`, "_blank");
    } catch (error) {
      console.error("Error sharing:", error);
      const text = encodeURIComponent(`Happy Vesak Day! ✨\nMake yours here: ${currentUrl}`);
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
  };

  const handleDownload = () => {
    if (!generatedCard) return;
    const link = document.createElement("a");
    link.href = generatedCard;
    link.download = `Vesak_Greeting_Card.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/75 backdrop-blur-lg overflow-y-auto pt-6 pb-10">
      <div className="relative w-full max-w-5xl glass rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl mt-12 md:mt-0 border border-[var(--glass-border)]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/20 hover:bg-black/40 dark:bg-white/10 dark:hover:bg-white/20 transition-all text-white border border-white/10 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="w-full md:w-5/12 p-6 md:p-8 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-[var(--glass-border)] max-h-[85vh] overflow-y-auto pb-24 scrollbar-thin">
          <div>
            <span className="text-xs uppercase tracking-wider text-[var(--color-vesak-orange)] font-semibold">Customizer</span>
            <h2 className="text-2xl font-bold font-serif mt-1">Design Your Card</h2>
          </div>
          
          {template.type === "photo" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold opacity-90">Upload Photo</label>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 ${isDragActive ? "border-[var(--color-vesak-gold)] bg-[var(--color-vesak-gold)]/10" : "border-[var(--glass-border)] hover:border-[var(--color-vesak-gold)] hover:bg-black/5 dark:hover:bg-white/5"}`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-2 opacity-60 text-[var(--color-vesak-orange)] animate-bounce" size={24} />
                <p className="text-sm font-medium opacity-80">
                  {isDragActive ? "Drop photo here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs opacity-60 mt-1">Supports PNG, JPG, JPEG</p>
              </div>
              
              {photo && (
                <div className="flex items-center gap-4 mt-4 bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-[var(--glass-border)]">
                  <ZoomOut size={16} className="opacity-70" />
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2.5" 
                    step="0.05"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="flex-1 accent-[var(--color-vesak-gold)] h-1 rounded-lg cursor-pointer bg-black/10 dark:bg-white/10"
                  />
                  <ZoomIn size={16} className="opacity-70" />
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-[var(--glass-border)]">
            <h3 className="text-base font-semibold uppercase tracking-wider text-[var(--color-vesak-gold)]">Greeting Text Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold opacity-85 block mb-1">To</label>
                <input 
                  type="text" 
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  placeholder="e.g. Dear Mother"
                  className="w-full bg-black/5 dark:bg-white/5 rounded-lg px-3 py-2 border border-[var(--glass-border)] focus:border-[var(--color-vesak-gold)] outline-none text-sm transition-all focus:ring-1 focus:ring-[var(--color-vesak-gold)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold opacity-85 block mb-1">From</label>
                <input 
                  type="text" 
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-black/5 dark:bg-white/5 rounded-lg px-3 py-2 border border-[var(--glass-border)] focus:border-[var(--color-vesak-gold)] outline-none text-sm transition-all focus:ring-1 focus:ring-[var(--color-vesak-gold)]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold opacity-85">Message</label>
                <button 
                  onClick={() => setGreetingText(VESAK_GREETINGS[Math.floor(Math.random() * VESAK_GREETINGS.length)])}
                  className="text-[10px] font-bold uppercase tracking-wider bg-[var(--color-vesak-gold)]/20 text-[var(--color-vesak-orange)] hover:bg-[var(--color-vesak-gold)]/30 px-2.5 py-1 rounded-full transition-all cursor-pointer border border-[var(--color-vesak-gold)]/30"
                >
                  🎲 Random Greeting
                </button>
              </div>
              <textarea 
                value={greetingText}
                onChange={(e) => setGreetingText(e.target.value)}
                rows={3}
                className="w-full bg-black/5 dark:bg-white/5 rounded-lg px-3 py-2 border border-[var(--glass-border)] focus:border-[var(--color-vesak-gold)] outline-none text-sm resize-none transition-all focus:ring-1 focus:ring-[var(--color-vesak-gold)]"
              />
            </div>

            <div className="space-y-3 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--glass-border)]">
              <div className="flex flex-col">
                <div className="flex justify-between text-xs opacity-75 mb-1 font-medium">
                  <span>Font Size</span>
                  <span>{greetingSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="12" max="48" 
                  value={greetingSize} 
                  onChange={(e) => setGreetingSize(Number(e.target.value))}
                  className="accent-[var(--color-vesak-gold)] w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between text-xs opacity-75 mb-1 font-medium">
                  <span>Text Wrap Width</span>
                  <span>{greetingWidth}px</span>
                </div>
                <input 
                  type="range" 
                  min="150" max="400" 
                  value={greetingWidth} 
                  onChange={(e) => setGreetingWidth(Number(e.target.value))}
                  className="accent-[var(--color-vesak-gold)] w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs opacity-75 font-medium">Text Color</span>
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-inner cursor-pointer">
                  <input 
                    type="color" 
                    value={greetingColor} 
                    onChange={(e) => setGreetingColor(e.target.value)}
                    className="absolute inset-[-10px] w-16 h-16 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !!generatedCard}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all cursor-pointer text-base ${
              generatedCard ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-gradient-to-r from-[var(--color-vesak-gold)] via-[var(--color-vesak-orange)] to-[var(--color-vesak-lotus)] hover:opacity-90 active:scale-98"
            }`}
          >
            {isGenerating ? "Creating Blessings..." : generatedCard ? "✨ Card Generated!" : "Create Card"}
          </button>
        </div>

        <div className="w-full md:w-7/12 p-6 md:p-8 flex items-center justify-center bg-black/15 min-h-[50vh] relative">
          {!generatedCard ? (
            <div className="relative shadow-2xl rounded-2xl overflow-hidden w-full max-w-sm mx-auto flex-shrink-0 border border-white/10">
              <div className="absolute top-3 left-3 z-30 bg-black/40 backdrop-blur-md text-[10px] uppercase font-bold text-white py-1 px-2.5 rounded-full flex items-center gap-1.5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span> Live Editor Canvas
              </div>
              <div className="absolute top-3 right-3 z-30 bg-black/40 backdrop-blur-md text-[10px] font-medium text-white py-1 px-2.5 rounded-full border border-white/10">
                Drag labels to reposition
              </div>

              <div ref={cardRef} className="relative overflow-hidden w-full h-auto block select-none bg-white">
                <img src={templateBase64 || template.image} alt="Template" className="w-full h-auto block z-0 pointer-events-none" />
                
                {template.type === "photo" && photo && (
                  <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center">
                    <Draggable nodeRef={dragRef}>
                      <div ref={dragRef} className="cursor-move">
                        <div style={{ transform: `scale(${scale})`, transformOrigin: 'center', transition: 'transform 0.1s ease-out' }}>
                          <img 
                            src={photo} 
                            alt="User upload" 
                            draggable="false"
                            style={{ maxWidth: 'none', width: '300px' }}
                            className="pointer-events-none"
                          />
                        </div>
                      </div>
                    </Draggable>
                  </div>
                )}
                
                {toName && (
                  <div className="absolute inset-0 z-20 overflow-hidden flex items-start justify-start p-8 pointer-events-none">
                    <Draggable nodeRef={toDragRef}>
                      <div 
                        ref={toDragRef} 
                        className="cursor-move pointer-events-auto font-bold border-2 border-current px-2.5 py-1 rounded shadow-lg bg-black/40 backdrop-blur-md drop-shadow-md hover:ring-2 ring-white/50 ring-dashed transition-all"
                        style={{ color: greetingColor, fontSize: `${Math.max(12, greetingSize * 0.75)}px` }}
                      >
                        To: {toName}
                      </div>
                    </Draggable>
                  </div>
                )}
                
                <div className="absolute inset-0 z-20 overflow-hidden flex items-center justify-center pointer-events-none">
                  <Draggable nodeRef={textDragRef}>
                    <div 
                      ref={textDragRef} 
                      className="cursor-move pointer-events-auto flex flex-col p-4 hover:ring-2 ring-white/50 ring-dashed rounded-lg transition-all bg-black/10 backdrop-blur-[1px]"
                      style={{ 
                        color: greetingColor, 
                        fontSize: `${greetingSize}px`,
                        width: `${greetingWidth}px`,
                        maxWidth: '90%'
                      }}
                    >
                      <div className="text-center font-medium drop-shadow-lg whitespace-pre-wrap leading-relaxed w-full h-full flex items-center justify-center">
                        {greetingText}
                      </div>
                    </div>
                  </Draggable>
                </div>

                {fromName && (
                  <div className="absolute inset-0 z-20 overflow-hidden flex items-end justify-end p-8 pointer-events-none">
                    <Draggable nodeRef={fromDragRef}>
                      <div 
                        ref={fromDragRef} 
                        className="cursor-move pointer-events-auto font-bold border-2 border-current px-2.5 py-1 rounded shadow-lg bg-black/40 backdrop-blur-md drop-shadow-md hover:ring-2 ring-white/50 ring-dashed transition-all"
                        style={{ color: greetingColor, fontSize: `${Math.max(12, greetingSize * 0.75)}px` }}
                      >
                        From: {fromName}
                      </div>
                    </Draggable>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-6 w-full max-w-sm"
              >
                <div className="relative shadow-[0_20px_50px_rgba(255,215,0,0.3)] rounded-2xl overflow-hidden border-2 border-[var(--color-vesak-gold)] w-full mx-auto">
                  <img src={generatedCard} alt="Generated Card" className="w-full h-auto block" />
                  
                  <motion.div 
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 2, duration: 1.2 }}
                    className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent flex items-center justify-center pointer-events-none"
                  >
                    <span className="text-5xl animate-bounce">✨🙏🌸</span>
                  </motion.div>
                </div>
                
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 text-foreground border border-[var(--glass-border)] rounded-xl font-medium backdrop-blur-md transition-all active:scale-98 cursor-pointer"
                  >
                    <Download size={18} /> Download
                  </button>
                  <button 
                    onClick={shareToWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-medium shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <Share2 size={18} /> Share
                  </button>
                </div>
                
                <button 
                  onClick={() => setGeneratedCard(null)}
                  className="text-xs opacity-75 hover:opacity-100 underline transition-all font-semibold uppercase tracking-wider text-[var(--color-vesak-orange)] cursor-pointer"
                >
                  ← Edit Card Again
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
